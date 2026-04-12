import re
import os


def _extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.txt':
        with open(file_path, 'r', errors='ignore') as f:
            return f.read()
    if ext == '.pdf':
        try:
            from reportlab.lib.pagesizes import letter
            import io
            # Basic PDF text extraction fallback
            with open(file_path, 'rb') as f:
                raw = f.read().decode('latin-1', errors='ignore')
            return re.sub(r'[^\x20-\x7E\n]', ' ', raw)
        except Exception:
            return ''
    return ''


def parse_document(file_path, form_data):
    if not file_path or not os.path.exists(file_path):
        return {'status': 'file_not_found'}

    text = _extract_text(file_path)
    if not text:
        return {'status': 'unreadable'}

    extracted = {}

    area_match = re.search(r'(\d[\d,]*\.?\d*)\s*(?:sq\.?\s*ft|sqft|square\s*feet)', text, re.I)
    if area_match:
        extracted['area_sqft'] = float(area_match.group(1).replace(',', ''))

    price_match = re.search(r'(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)\s*(?:lakh|lac|crore|cr)?', text, re.I)
    if price_match:
        val = float(price_match.group(1).replace(',', ''))
        suffix = price_match.group(0).lower()
        if 'crore' in suffix or 'cr' in suffix:
            val *= 1e7
        elif 'lakh' in suffix or 'lac' in suffix:
            val *= 1e5
        extracted['price'] = val

    survey_match = re.search(r'survey\s*(?:no\.?|number)?\s*[:\-]?\s*(\w+[\-/]?\w*)', text, re.I)
    if survey_match:
        extracted['survey_number'] = survey_match.group(1)

    owner_match = re.search(r'(?:owner|vendor|seller)\s*[:\-]\s*([A-Za-z\s]{3,40})', text, re.I)
    if owner_match:
        extracted['owner_name'] = owner_match.group(1).strip()

    mismatches = []
    if 'area_sqft' in extracted:
        form_area = float(form_data.get('area_sqft', 0))
        if abs(extracted['area_sqft'] - form_area) / max(form_area, 1) > 0.05:
            mismatches.append(f"Area mismatch: doc={extracted['area_sqft']}, form={form_area}")

    if 'owner_name' in extracted and 'owner_name' in form_data:
        doc_owner = extracted['owner_name'].lower()
        form_owner = form_data['owner_name'].lower()
        if doc_owner not in form_owner and form_owner not in doc_owner:
            mismatches.append(f"Owner mismatch: doc='{extracted['owner_name']}', form='{form_data['owner_name']}'")

    integrity = max(0, 100 - len(mismatches) * 20 - (10 if not extracted else 0))

    return {
        'status': 'parsed',
        'raw_text': text[:500],
        'owner_name': extracted.get('owner_name'),
        'area_sqft': extracted.get('area_sqft'),
        'date': extracted.get('date'),
        'integrity_score': integrity,
        'extracted': extracted,
        'mismatches': mismatches,
        'mismatch_count': len(mismatches)
    }

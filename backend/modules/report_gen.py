import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer,
                                 Table, TableStyle, HRFlowable)

GOLD    = colors.HexColor('#a07830')
DARK    = colors.HexColor('#1a1a1a')
ACCENT  = colors.HexColor('#27ae60')
DANGER  = colors.HexColor('#c0392b')
WARN    = colors.HexColor('#e67e22')
LIGHT   = colors.HexColor('#f9f5ee')
PURPLE  = colors.HexColor('#7c3aed')
TEAL    = colors.HexColor('#0891b2')


def _fmt(val):
    try:
        v = float(val)
        if v >= 1e7:  return 'Rs. %.2f Cr' % (v / 1e7)
        if v >= 1e5:  return 'Rs. %.2f L'  % (v / 1e5)
        return 'Rs. {:,.0f}'.format(v)
    except Exception:
        return str(val) if val is not None else '-'


def _table(data, col_widths, header_bg=None):
    if header_bg is None:
        header_bg = DARK
    t = Table(data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0, 0), (-1, 0),  header_bg),
        ('TEXTCOLOR',     (0, 0), (-1, 0),  colors.white),
        ('FONTNAME',      (0, 0), (-1, 0),  'Helvetica-Bold'),
        ('FONTSIZE',      (0, 0), (-1, -1), 9),
        ('ROWBACKGROUNDS',(0, 1), (-1, -1), [LIGHT, colors.white]),
        ('GRID',          (0, 0), (-1, -1), 0.4, colors.HexColor('#e8dcc8')),
        ('TOPPADDING',    (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING',   (0, 0), (-1, -1), 8),
    ]))
    return t


def generate_report(result, output_path):
    doc = SimpleDocTemplate(
        output_path, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm
    )
    styles = getSampleStyleSheet()
    normal = styles['Normal']

    h1 = ParagraphStyle('H1', parent=styles['Title'],
        textColor=DARK, fontSize=20, spaceAfter=4, fontName='Helvetica-Bold')
    h2 = ParagraphStyle('H2', parent=styles['Heading2'],
        textColor=GOLD, fontSize=12, spaceBefore=14, spaceAfter=4, fontName='Helvetica-Bold')
    sub = ParagraphStyle('Sub', parent=normal,
        textColor=colors.HexColor('#6b6b6b'), fontSize=9, spaceAfter=6)

    story = []

    # Header
    story.append(Paragraph('LandIQ - AI Land Intelligence Report', h1))
    story.append(Paragraph(
        'Analysis ID: %s  |  LandIQ v2.0.0  |  6 AI Models  |  Bangalore' % result.get('analysis_id', 'N/A'),
        sub))
    story.append(HRFlowable(width='100%', thickness=2, color=GOLD))
    story.append(Spacer(1, 0.3*cm))

    # 1. Property Details
    inp = result.get('input', {})
    story.append(Paragraph('1. Property Details', h2))
    story.append(_table([
        ['Field',           'Value'],
        ['Locality',        str(inp.get('locality', inp.get('city', '-')))],
        ['State',           str(inp.get('state', 'Karnataka'))],
        ['Zone',            str(inp.get('zone', '-')).capitalize()],
        ['Infrastructure',  str(inp.get('infrastructure', '-')).capitalize()],
        ['Area',            '%s sqft' % inp.get('area_sqft', '-')],
        ['Asking Price',    _fmt(inp.get('asking_price', 0))],
        ['Legal Disputes',  'Yes' if inp.get('legal_disputes') else 'No'],
        ['Flood Zone',      'Yes' if inp.get('flood_zone') else 'No'],
        ['Near Tech Park',  'Yes' if inp.get('near_tech_park') else 'No'],
    ], [6*cm, 10*cm]))

    # 2. AI Valuation
    val = result.get('valuation', {})
    story.append(Paragraph('2. AI Valuation - 3-Model Ensemble', h2))
    story.append(Paragraph('Ensemble: Random Forest (35%) + XGBoost (45%) + ANN (20%)', sub))
    story.append(_table([
        ['Model / Metric',           'Value'],
        ['Random Forest Estimate',   _fmt(val.get('rf_estimate', 0))],
        ['XGBoost Estimate',         _fmt(val.get('xgb_estimate', 0))],
        ['ANN Estimate',             _fmt(val.get('ann_estimate', 0))],
        ['Ensemble Estimated Value', _fmt(val.get('estimated_value', 0))],
        ['Price per sqft',           'Rs. {:,.0f}'.format(float(val.get('price_per_sqft', 0)))],
        ['Confidence Score',         '%s%%' % val.get('confidence_pct', 0)],
        ['Asking vs Estimated',      '%+.1f%%' % float(result.get('asking_vs_estimated_pct', 0))],
    ], [7*cm, 9*cm]))

    # SHAP
    shap = val.get('shap_values', {})
    if shap:
        story.append(Spacer(1, 0.2*cm))
        story.append(Paragraph('Top Feature Contributions (SHAP / XAI)', sub))
        shap_rows = [['Feature', 'Contribution %']]
        for feat, contrib in sorted(shap.items(), key=lambda x: x[1], reverse=True)[:6]:
            shap_rows.append([feat.replace('_', ' ').title(), '%.1f%%' % contrib])
        story.append(_table(shap_rows, [9*cm, 7*cm], header_bg=PURPLE))

    # 3. Risk Analysis
    risk = result.get('risk', {})
    story.append(Paragraph('3. Risk Analysis - GBM Classifier', h2))
    risk_color = DANGER if risk.get('risk_level') in ('HIGH', 'CRITICAL') else ACCENT
    story.append(Paragraph(
        '<b>Risk Score: %s / 100  |  Level: %s  |  Model: %s</b>' % (
            risk.get('risk_score', 0), risk.get('risk_level', ''), risk.get('ml_model', '')),
        ParagraphStyle('rc', parent=normal, textColor=risk_color, fontSize=11, spaceAfter=6)))

    bd = risk.get('breakdown', {})
    risk_rows = [['Risk Category', 'Score / 100']]
    for k, v in bd.items():
        risk_rows.append([k.replace('_', ' ').title(), str(v)])
    story.append(_table(risk_rows, [9*cm, 7*cm]))

    proba = risk.get('risk_probabilities', {})
    if proba:
        story.append(Spacer(1, 0.2*cm))
        story.append(Paragraph('ML Classifier Probabilities', sub))
        prob_rows = [['Risk Level', 'Probability']]
        for level, p in proba.items():
            prob_rows.append([level, '%.1f%%' % (p * 100)])
        story.append(_table(prob_rows, [9*cm, 7*cm], header_bg=TEAL))

    # 4. Fraud Detection
    fraud = result.get('fraud', {})
    story.append(Paragraph('4. Fraud Detection - IsolationForest + Rule Engine', h2))
    fd_color = DANGER if fraud.get('fraud_detected') else ACCENT
    story.append(Paragraph(
        '<b>Fraud Detected: %s  |  Risk: %s  |  Probability: %.1f%%</b>' % (
            'YES' if fraud.get('fraud_detected') else 'NO',
            fraud.get('fraud_risk', ''),
            float(fraud.get('fraud_probability', 0)) * 100),
        ParagraphStyle('fc', parent=normal, textColor=fd_color, fontSize=11, spaceAfter=4)))
    if fraud.get('anomaly_score') is not None:
        story.append(Paragraph(
            'IsolationForest Anomaly Score: %s/100  |  Model: %s' % (
                fraud.get('anomaly_score'), fraud.get('ml_model', '')), sub))
    for sig in fraud.get('signals', []):
        story.append(Paragraph(
            '  [%s] %s: %s' % (sig['severity'], sig['type'].replace('_', ' ').upper(), sig['detail']),
            normal))

    # 5. Forecast
    fc = result.get('forecast', {})
    story.append(Paragraph('5. 5-Year Price Forecast', h2))
    story.append(Paragraph(
        'Locality: %s  |  Annual Growth: %s%%  |  5-Year Gain: %s%%' % (
            fc.get('locality', ''), fc.get('annual_growth_rate_pct', 0), fc.get('five_year_gain_pct', 0)),
        sub))
    fc_rows = [['Year', 'Price/sqft (Rs)', 'Total Value']]
    for pt in fc.get('series', []):
        fc_rows.append([str(pt['year']), 'Rs. {:,.0f}'.format(float(pt['price_sqft'])), _fmt(pt['total_value'])])
    story.append(_table(fc_rows, [3*cm, 6*cm, 7*cm]))

    # 6. Legal
    legal = result.get('legal', {})
    if legal.get('status') == 'parsed':
        story.append(Paragraph('6. Legal Document Analysis', h2))
        legal_rows = [
            ['Field', 'Value'],
            ['Status', legal.get('status', '')],
            ['Integrity Score', '%s%%' % legal.get('integrity_score', 0)],
            ['Extracted Owner', str(legal.get('owner_name', '-'))],
            ['Extracted Area', '%s sqft' % legal.get('area_sqft', '-')],
            ['Mismatches', str(legal.get('mismatch_count', 0))],
        ]
        story.append(_table(legal_rows, [6*cm, 10*cm]))
        for m in legal.get('mismatches', []):
            story.append(Paragraph('  Warning: %s' % m,
                ParagraphStyle('warn', parent=normal, textColor=WARN, fontSize=9)))

    # Recommendation
    story.append(Spacer(1, 0.5*cm))
    story.append(HRFlowable(width='100%', thickness=2, color=GOLD))
    rec = result.get('recommendation', '')
    rec_color = DANGER if 'AVOID' in rec or 'HIGH RISK' in rec else (ACCENT if 'GOOD' in rec or 'DEAL' in rec else GOLD)
    story.append(Paragraph(
        '<b>RECOMMENDATION: %s</b>' % rec,
        ParagraphStyle('rec', parent=normal, textColor=rec_color, fontSize=13, spaceBefore=10, spaceAfter=6)))

    story.append(Spacer(1, 0.8*cm))
    story.append(Paragraph(
        '<i>Generated by LandIQ v2.0.0 - AI Land Intelligence | RF + XGBoost + ANN + GBM + IsolationForest | Bangalore 2024</i>',
        ParagraphStyle('footer', parent=normal, textColor=colors.HexColor('#9a9a9a'), fontSize=7.5)))

    doc.build(story)

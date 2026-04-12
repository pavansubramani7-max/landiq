import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer,
                                 Table, TableStyle, HRFlowable)

PRIMARY  = colors.HexColor('#1a3c5e')
ACCENT   = colors.HexColor('#10b981')
DANGER   = colors.HexColor('#ef4444')
WARN     = colors.HexColor('#f59e0b')
LIGHT    = colors.HexColor('#f1f5f9')
PURPLE   = colors.HexColor('#7c3aed')
TEAL     = colors.HexColor('#0891b2')


def _fmt(val):
    try:
        v = float(val)
        if v >= 1e7:  return f'Rs. {v/1e7:.2f} Cr'
        if v >= 1e5:  return f'Rs. {v/1e5:.2f} L'
        return f'Rs. {v:,.0f}'
    except Exception:
        return str(val)


def _table(data, col_widths, header_bg=PRIMARY):
    t = Table(data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND',   (0, 0), (-1, 0),  header_bg),
        ('TEXTCOLOR',    (0, 0), (-1, 0),  colors.white),
        ('FONTNAME',     (0, 0), (-1, 0),  'Helvetica-Bold'),
        ('FONTSIZE',     (0, 0), (-1, -1), 9),
        ('ROWBACKGROUNDS',(0,1), (-1, -1), [LIGHT, colors.white]),
        ('GRID',         (0, 0), (-1, -1), 0.4, colors.HexColor('#e2e8f0')),
        ('TOPPADDING',   (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING',(0, 0), (-1, -1), 5),
        ('LEFTPADDING',  (0, 0), (-1, -1), 8),
    ]))
    return t


def generate_report(result, output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4,
                            leftMargin=2*cm, rightMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    normal = styles['Normal']

    def h1_style(): return ParagraphStyle('H1', parent=styles['Title'],
        textColor=PRIMARY, fontSize=20, spaceAfter=4, fontName='Helvetica-Bold')
    def h2_style(): return ParagraphStyle('H2', parent=styles['Heading2'],
        textColor=PRIMARY, fontSize=12, spaceBefore=14, spaceAfter=4, fontName='Helvetica-Bold')
    def sub_style(color=None): return ParagraphStyle('Sub', parent=normal,
        textColor=color or colors.HexColor('#64748b'), fontSize=9, spaceAfter=6)

    story = []

    # ── Header ────────────────────────────────────────────────────────────────
    story.append(Paragraph('LandIQ — AI Land Intelligence Report', h1_style()))
    story.append(Paragraph(f"Analysis ID: {result.get('analysis_id','N/A')}  |  LandIQ v2.0.0  |  6 AI Models", sub_style()))
    story.append(HRFlowable(width='100%', thickness=2, color=PRIMARY))
    story.append(Spacer(1, 0.3*cm))

    # ── Property Details ──────────────────────────────────────────────────────
    inp = result.get('input', {})
    story.append(Paragraph('1. Property Details', h2_style()))
    story.append(_table([
        ['Field', 'Value'],
        ['Locality / City', f"{inp.get('locality', inp.get('city', ''))}"],
        ['State',           inp.get('state', 'Karnataka')],
        ['Zone',            inp.get('zone', '').capitalize()],
        ['Infrastructure',  inp.get('infrastructure', '').capitalize()],
        ['Area',            f"{inp.get('area_sqft', '')} sqft"],
        ['Asking Price',    _fmt(inp.get('asking_price', 0))],
        ['Legal Disputes',  'Yes' if inp.get('legal_disputes') else 'No'],
        ['Flood Zone',      'Yes' if inp.get('flood_zone') else 'No'],
        ['Near Tech Park',  'Yes' if inp.get('near_tech_park') else 'No'],
    ], [6*cm, 10*cm]))

    # ── AI Valuation (3-Model Ensemble) ───────────────────────────────────────
    val = result.get('valuation', {})
    story.append(Paragraph('2. AI Valuation — 3-Model Ensemble', h2_style()))
    story.append(Paragraph('Ensemble: Random Forest (35%) + XGBoost (45%) + ANN (20%)', sub_style()))
    story.append(_table([
        ['Model / Metric',          'Value'],
        ['Random Forest Estimate',  _fmt(val.get('rf_estimate', 0))],
        ['XGBoost Estimate',        _fmt(val.get('xgb_estimate', 0))],
        ['ANN Estimate',            _fmt(val.get('ann_estimate', 0))],
        ['Ensemble Estimated Value',_fmt(val.get('estimated_value', 0))],
        ['Price per sqft',          f"Rs. {val.get('price_per_sqft', 0):,.0f}"],
        ['Confidence Score',        f"{val.get('confidence_pct', 0)}%"],
        ['Asking vs Estimated',     f"{result.get('asking_vs_estimated_pct', 0):+.1f}%"],
    ], [7*cm, 9*cm]))

    # SHAP values
    shap = val.get('shap_values', {})
    if shap:
        story.append(Spacer(1, 0.2*cm))
        story.append(Paragraph('Top Feature Contributions (SHAP)', sub_style(PRIMARY)))
        shap_rows = [['Feature', 'Contribution %']]
        for feat, contrib in sorted(shap.items(), key=lambda x: x[1], reverse=True)[:6]:
            shap_rows.append([feat.replace('_', ' ').title(), f"{contrib:.1f}%"])
        story.append(_table(shap_rows, [9*cm, 7*cm], header_bg=PURPLE))

    # ── Risk Analysis ─────────────────────────────────────────────────────────
    risk = result.get('risk', {})
    story.append(Paragraph('3. Risk Analysis — GBM Classifier', h2_style()))
    risk_color = DANGER if risk.get('risk_level') in ('HIGH', 'CRITICAL') else ACCENT
    story.append(Paragraph(
        f"<b>Risk Score: {risk.get('risk_score', 0)} / 100  |  Level: {risk.get('risk_level', '')}  |  Model: {risk.get('ml_model','')}</b>",
        ParagraphStyle('rc', parent=normal, textColor=risk_color, fontSize=11, spaceAfter=6)))

    bd = risk.get('breakdown', {})
    risk_rows = [['Risk Category', 'Score / 100']]
    for k, v in bd.items():
        risk_rows.append([k.replace('_', ' ').title(), str(v)])
    story.append(_table(risk_rows, [9*cm, 7*cm]))

    # Risk probabilities
    proba = risk.get('risk_probabilities', {})
    if proba:
        story.append(Spacer(1, 0.2*cm))
        story.append(Paragraph('ML Classifier Probabilities', sub_style(PRIMARY)))
        prob_rows = [['Risk Level', 'Probability']]
        for level, p in proba.items():
            prob_rows.append([level, f"{p*100:.1f}%"])
        story.append(_table(prob_rows, [9*cm, 7*cm], header_bg=TEAL))

    # ── Fraud Detection ───────────────────────────────────────────────────────
    fraud = result.get('fraud', {})
    story.append(Paragraph('4. Fraud Detection — IsolationForest + Rule Engine', h2_style()))
    fd_color = DANGER if fraud.get('fraud_detected') else ACCENT
    story.append(Paragraph(
        f"<b>Fraud Detected: {'YES' if fraud.get('fraud_detected') else 'NO'}  |  Risk: {fraud.get('fraud_risk','')}  |  Probability: {fraud.get('fraud_probability',0)*100:.1f}%</b>",
        ParagraphStyle('fc', parent=normal, textColor=fd_color, fontSize=11, spaceAfter=4)))
    if fraud.get('anomaly_score') is not None:
        story.append(Paragraph(
            f"IsolationForest Anomaly Score: {fraud.get('anomaly_score')}/100  |  Model: {fraud.get('ml_model','')}",
            sub_style()))
    for sig in fraud.get('signals', []):
        story.append(Paragraph(
            f"  [{sig['severity']}] {sig['type'].replace('_',' ').upper()}: {sig['detail']}", normal))

    # ── 5-Year Forecast ───────────────────────────────────────────────────────
    fc = result.get('forecast', {})
    story.append(Paragraph('5. 5-Year Price Forecast', h2_style()))
    story.append(Paragraph(
        f"Locality: {fc.get('locality','')}  |  Annual Growth: {fc.get('annual_growth_rate_pct',0)}%  |  5-Year Gain: {fc.get('five_year_gain_pct',0)}%",
        sub_style()))
    fc_rows = [['Year', 'Price/sqft (Rs)', 'Total Value']]
    for pt in fc.get('series', []):
        fc_rows.append([str(pt['year']), f"Rs. {pt['price_sqft']:,.0f}", _fmt(pt['total_value'])])
    story.append(_table(fc_rows, [3*cm, 6*cm, 7*cm]))

    # ── Legal Intelligence ────────────────────────────────────────────────────
    legal = result.get('legal', {})
    if legal.get('status') == 'parsed':
        story.append(Paragraph('6. Legal Document Analysis', h2_style()))
        legal_rows = [['Field', 'Value'],
                      ['Status', legal.get('status','')],
                      ['Integrity Score', f"{legal.get('integrity_score',0)}%"],
                      ['Extracted Owner', legal.get('owner_name','—')],
                      ['Extracted Area', f"{legal.get('area_sqft','—')} sqft"],
                      ['Mismatches', str(legal.get('mismatch_count', 0))]]
        story.append(_table(legal_rows, [6*cm, 10*cm]))
        for m in legal.get('mismatches', []):
            story.append(Paragraph(f"  Warning: {m}", ParagraphStyle('warn', parent=normal, textColor=WARN, fontSize=9)))

    # ── Recommendation ────────────────────────────────────────────────────────
    story.append(Spacer(1, 0.5*cm))
    story.append(HRFlowable(width='100%', thickness=2, color=PRIMARY))
    rec = result.get('recommendation', '')
    rec_color = DANGER if 'AVOID' in rec or 'HIGH RISK' in rec else (ACCENT if 'GOOD' in rec or 'DEAL' in rec else PRIMARY)
    story.append(Paragraph(
        f"<b>RECOMMENDATION: {rec}</b>",
        ParagraphStyle('rec', parent=normal, textColor=rec_color, fontSize=13, spaceBefore=10, spaceAfter=6)))

    story.append(Spacer(1, 0.8*cm))
    story.append(Paragraph(
        '<i>Generated by LandIQ v2.0.0 — AI-Powered Land Intelligence Platform | '
        'Models: RF + XGBoost + ANN + GBM Classifier + IsolationForest | Bangalore 2024</i>',
        ParagraphStyle('footer', parent=normal, textColor=colors.HexColor('#94a3b8'), fontSize=7.5)))

    doc.build(story)

"""
LandIQ Backend Server v2.0.0
Run: python server.py
"""
import os, sys, uuid, json
from datetime import timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from dotenv import load_dotenv
load_dotenv(os.path.join(BASE_DIR, '.env'))

import numpy as np
from flask import Flask, request, send_file
from flask.json.provider import DefaultJSONProvider
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


# ── Numpy-safe JSON provider (fixes Python 3.14 + Flask 3.x) ─────────────────
class NumpyJSONProvider(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, np.integer):  return int(obj)
        if isinstance(obj, np.floating): return float(obj)
        if isinstance(obj, np.bool_):    return bool(obj)
        if isinstance(obj, np.ndarray):  return obj.tolist()
        return super().default(obj)


# ── Flask app ─────────────────────────────────────────────────────────────────
class LandIQApp(Flask):
    json_provider_class = NumpyJSONProvider

application = LandIQApp(__name__)
CORS(application)

# ── Config ────────────────────────────────────────────────────────────────────
application.config.update(
    SECRET_KEY               = os.getenv('SECRET_KEY', 'landiq-secret-dev-key-32chars!!'),
    JWT_SECRET_KEY           = os.getenv('JWT_SECRET_KEY', 'landiq-jwt-dev-key-32chars!!!'),
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))),
    MAX_CONTENT_LENGTH       = 16 * 1024 * 1024,
    UPLOAD_FOLDER            = os.getenv('UPLOAD_FOLDER',  os.path.join(BASE_DIR, 'uploads')),
    REPORTS_FOLDER           = os.getenv('REPORTS_FOLDER', os.path.join(BASE_DIR, 'reports')),
)

os.makedirs(application.config['UPLOAD_FOLDER'],  exist_ok=True)
os.makedirs(application.config['REPORTS_FOLDER'], exist_ok=True)

# ── Extensions ────────────────────────────────────────────────────────────────
JWTManager(application)

limiter = Limiter(
    get_remote_address, app=application,
    default_limits=['200 per day', '60 per hour'],
    storage_uri='memory://',
)

try:
    from prometheus_flask_exporter import PrometheusMetrics
    PrometheusMetrics(application, default_labels={'app': 'landiq'})
except Exception:
    pass

# ── Blueprints ────────────────────────────────────────────────────────────────
from app.routes.auth      import auth_bp
from app.routes.parcels   import parcels_bp
from app.routes.analysis  import analysis_bp
from app.routes.documents import documents_bp
from app.routes.admin     import admin_bp

for bp in [auth_bp, parcels_bp, analysis_bp, documents_bp, admin_bp]:
    application.register_blueprint(bp)

# ── Database ──────────────────────────────────────────────────────────────────
from app.database import init_db
with application.app_context():
    init_db()

# ── AI modules ────────────────────────────────────────────────────────────────
from modules.valuation       import predict_value
from modules.risk_analysis   import analyze_risk
from modules.fraud_detection import detect_fraud
from modules.forecasting     import forecast_prices
from modules.legal_intel     import parse_document
from modules.report_gen      import generate_report

_store = {}  # in-memory analysis store


def _safe_json(obj):
    """Recursively convert numpy types to native Python types."""
    if isinstance(obj, dict):
        return {k: _safe_json(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_safe_json(i) for i in obj]
    if isinstance(obj, np.integer):  return int(obj)
    if isinstance(obj, np.floating): return float(obj)
    if isinstance(obj, np.bool_):    return bool(obj)
    if isinstance(obj, np.ndarray):  return obj.tolist()
    return obj


# ── Routes ────────────────────────────────────────────────────────────────────
@application.get('/api/health')
def health():
    return application.json.response({'status': 'ok', 'version': '2.0.0'})


@application.post('/api/analyze')
@limiter.limit('30 per hour')
def analyze():
    data = request.get_json()
    if not data:
        return application.json.response({'error': 'No data provided'}), 400

    for f in ['area_sqft', 'zone', 'infrastructure', 'asking_price']:
        if f not in data:
            return application.json.response({'error': f'Missing field: {f}'}), 400

    if not data.get('city')     and data.get('locality'): data['city']     = data['locality']
    if not data.get('locality') and data.get('city'):     data['locality'] = data['city']

    doc_path = data.pop('_doc_path', None)
    legal    = parse_document(doc_path, data) if doc_path else {'status': 'no_document'}

    try:
        valuation = _safe_json(predict_value(data))
        risk      = _safe_json(analyze_risk(data, valuation))
        fraud     = _safe_json(detect_fraud(data, valuation))
        forecast  = _safe_json(forecast_prices(data))
    except Exception as e:
        return application.json.response({'error': 'AI error: ' + str(e)}), 500

    estimated = float(valuation['estimated_value'])
    asking    = float(data['asking_price'])
    diff_pct  = round(((asking - estimated) / estimated) * 100, 2)

    if fraud['fraud_detected']:
        rec = 'AVOID - Fraud signals detected. Do not proceed.'
    elif risk['risk_score'] > 70:
        rec = 'HIGH RISK - Proceed only with full legal due diligence.'
    elif diff_pct > 20:
        rec = 'OVERPRICED - Negotiate down or walk away.'
    elif diff_pct < -15:
        rec = 'GOOD DEAL - Below market value. Verify legal status.'
    else:
        rec = 'FAIR DEAL - Price aligns with market. Standard due diligence advised.'

    aid = str(uuid.uuid4())[:8]
    result = _safe_json({
        'analysis_id': aid, 'input': data,
        'valuation': valuation, 'risk': risk,
        'fraud': fraud, 'forecast': forecast,
        'legal': legal, 'recommendation': rec,
        'asking_vs_estimated_pct': diff_pct,
    })
    _store[aid] = result
    return application.json.response(result)


@application.post('/api/upload-doc')
@limiter.limit('20 per hour')
def upload_doc():
    if 'file' not in request.files:
        return application.json.response({'error': 'No file'}), 400
    f = request.files['file']
    ext = os.path.splitext(f.filename)[1].lower()
    if ext not in {'.txt', '.pdf', '.png', '.jpg', '.jpeg'}:
        return application.json.response({'error': 'Unsupported type'}), 400
    path = os.path.join(application.config['UPLOAD_FOLDER'], uuid.uuid4().hex + ext)
    f.save(path)
    return application.json.response({'file_path': path, 'status': 'uploaded'})


@application.get('/api/report/<aid>')
def get_report(aid):
    if aid not in _store:
        return application.json.response({'error': 'Not found'}), 404
    path = os.path.join(application.config['REPORTS_FOLDER'], f'report_{aid}.pdf')
    try:
        generate_report(_store[aid], path)
    except Exception as e:
        return application.json.response({'error': str(e)}), 500
    return send_file(path, as_attachment=True,
                     download_name=f'LandIQ_{aid}.pdf',
                     mimetype='application/pdf')


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print('=' * 50)
    print('  LandIQ Backend v2.0.0')
    print('  http://localhost:5000')
    print('  http://localhost:5000/api/health')
    print('=' * 50)
    application.run(debug=False, port=5000, host='0.0.0.0')

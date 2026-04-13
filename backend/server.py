"""
LandIQ Backend - Main Server Entry Point
Run: python server.py
"""
import os
import sys
import uuid
from datetime import timedelta

# Ensure backend directory is in path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from dotenv import load_dotenv
load_dotenv(os.path.join(BASE_DIR, '.env'))

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import json
import numpy as np

# ── Custom JSON encoder to handle numpy types (Python 3.14 fix) ───────────────
class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):  return int(obj)
        if isinstance(obj, np.floating): return float(obj)
        if isinstance(obj, np.bool_):    return bool(obj)
        if isinstance(obj, np.ndarray):  return obj.tolist()
        return super().default(obj)

# ── Create Flask app ──────────────────────────────────────────────────────────
application = Flask(__name__)
CORS(application)

# Fix numpy types not JSON serializable in Python 3.14 / Flask 3.x
from flask.json.provider import DefaultJSONProvider
class _NumpyProvider(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, np.integer):  return int(obj)
        if isinstance(obj, np.floating): return float(obj)
        if isinstance(obj, np.bool_):    return bool(obj)
        if isinstance(obj, np.ndarray):  return obj.tolist()
        return super().default(obj)
application.json_provider_class = _NumpyProvider
application.json = _NumpyProvider(application)

# ── Config ────────────────────────────────────────────────────────────────────
application.config['SECRET_KEY']                = os.getenv('SECRET_KEY', 'landiq-secret-dev-key-change-in-prod')
application.config['JWT_SECRET_KEY']            = os.getenv('JWT_SECRET_KEY', 'landiq-jwt-dev-key-change-in-prod')
application.config['JWT_ACCESS_TOKEN_EXPIRES']  = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600)))
application.config['SQLALCHEMY_DATABASE_URI']   = os.getenv('DATABASE_URL', 'sqlite:///./landiq.db')
application.config['MAX_CONTENT_LENGTH']        = 16 * 1024 * 1024
application.config['UPLOAD_FOLDER']             = os.getenv('UPLOAD_FOLDER',  os.path.join(BASE_DIR, 'uploads'))
application.config['REPORTS_FOLDER']            = os.getenv('REPORTS_FOLDER', os.path.join(BASE_DIR, 'reports'))

os.makedirs(application.config['UPLOAD_FOLDER'],  exist_ok=True)
os.makedirs(application.config['REPORTS_FOLDER'], exist_ok=True)

# ── JWT ───────────────────────────────────────────────────────────────────────
JWTManager(application)

# ── Rate Limiter ──────────────────────────────────────────────────────────────
limiter = Limiter(
    get_remote_address,
    app=application,
    default_limits=['200 per day', '60 per hour'],
    storage_uri='memory://',
)

# ── Prometheus (optional) ─────────────────────────────────────────────────────
try:
    from prometheus_flask_exporter import PrometheusMetrics
    _metrics = PrometheusMetrics(application, default_labels={'app': 'landiq', 'version': '2.0.0'})
    _metrics.info('landiq_app_info', 'LandIQ Application Info', version='2.0.0')
except Exception:
    pass

# ── Register Blueprints ───────────────────────────────────────────────────────
from app.routes.auth      import auth_bp
from app.routes.parcels   import parcels_bp
from app.routes.analysis  import analysis_bp
from app.routes.documents import documents_bp
from app.routes.admin     import admin_bp

application.register_blueprint(auth_bp)
application.register_blueprint(parcels_bp)
application.register_blueprint(analysis_bp)
application.register_blueprint(documents_bp)
application.register_blueprint(admin_bp)

# ── Init DB ───────────────────────────────────────────────────────────────────
from app.database import init_db
with application.app_context():
    init_db()

# ── AI Modules ────────────────────────────────────────────────────────────────
from modules.valuation      import predict_value
from modules.risk_analysis  import analyze_risk
from modules.fraud_detection import detect_fraud
from modules.forecasting    import forecast_prices
from modules.legal_intel    import parse_document
from modules.report_gen     import generate_report

_analysis_store = {}

# ── Routes ────────────────────────────────────────────────────────────────────

@application.get('/api/health')
def health():
    return jsonify({'status': 'ok', 'version': '2.0.0'})


@application.post('/api/analyze')
@limiter.limit('30 per hour')
def analyze():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    for f in ['area_sqft', 'zone', 'infrastructure', 'asking_price']:
        if f not in data:
            return jsonify({'error': f'Missing field: {f}'}), 400

    # Support both locality and city
    if not data.get('city')     and data.get('locality'): data['city']     = data['locality']
    if not data.get('locality') and data.get('city'):     data['locality'] = data['city']

    doc_path = data.pop('_doc_path', None)
    legal    = parse_document(doc_path, data) if doc_path else {'status': 'no_document'}

    try:
        valuation = predict_value(data)
        risk      = analyze_risk(data, valuation)
        fraud     = detect_fraud(data, valuation)
        forecast  = forecast_prices(data)
    except Exception as e:
        return jsonify({'error': 'AI analysis error: ' + str(e)}), 500

    estimated = valuation['estimated_value']
    asking    = float(data['asking_price'])
    diff_pct  = ((asking - estimated) / estimated) * 100

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
    result = {
        'analysis_id': aid,
        'input': data,
        'valuation': valuation,
        'risk': risk,
        'fraud': fraud,
        'forecast': forecast,
        'legal': legal,
        'recommendation': rec,
        'asking_vs_estimated_pct': round(diff_pct, 2),
    }
    _analysis_store[aid] = result
    return jsonify(result)


@application.post('/api/upload-doc')
@limiter.limit('20 per hour')
def upload_doc():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    f = request.files['file']
    if not f.filename:
        return jsonify({'error': 'Empty filename'}), 400
    ext = os.path.splitext(f.filename)[1].lower()
    if ext not in {'.txt', '.pdf', '.png', '.jpg', '.jpeg'}:
        return jsonify({'error': 'Unsupported file type'}), 400
    filename = uuid.uuid4().hex + ext
    path = os.path.join(application.config['UPLOAD_FOLDER'], filename)
    f.save(path)
    return jsonify({'file_path': path, 'status': 'uploaded'})


@application.get('/api/report/<aid>')
def get_report(aid):
    if aid not in _analysis_store:
        return jsonify({'error': 'Analysis not found'}), 404
    result      = _analysis_store[aid]
    report_path = os.path.join(application.config['REPORTS_FOLDER'], f'report_{aid}.pdf')
    try:
        generate_report(result, report_path)
    except Exception as e:
        return jsonify({'error': 'Report error: ' + str(e)}), 500
    return send_file(report_path, as_attachment=True,
                     download_name=f'LandIQ_Report_{aid}.pdf',
                     mimetype='application/pdf')


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print('=' * 50)
    print('  LandIQ Backend Server v2.0.0')
    print('  URL: http://localhost:5000')
    print('  Health: http://localhost:5000/api/health')
    print('=' * 50)
    application.run(debug=False, port=5000, host='0.0.0.0')

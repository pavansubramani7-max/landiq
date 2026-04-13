import os, sys, uuid, json
from datetime import timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

import numpy as np
from flask import Flask, request, send_file
from flask.json.provider import DefaultJSONProvider
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv

load_dotenv(os.path.join(BASE_DIR, '.env'))


# ── Numpy-safe JSON (fixes Python 3.14 bool/float not serializable) ───────────
class _NP(DefaultJSONProvider):
    def default(self, o):
        if isinstance(o, np.integer):  return int(o)
        if isinstance(o, np.floating): return float(o)
        if isinstance(o, np.bool_):    return bool(o)
        if isinstance(o, np.ndarray):  return o.tolist()
        return super().default(o)


def _safe(obj):
    """Recursively convert numpy types to native Python."""
    if isinstance(obj, dict):   return {k: _safe(v) for k, v in obj.items()}
    if isinstance(obj, list):   return [_safe(i) for i in obj]
    if isinstance(obj, np.integer):  return int(obj)
    if isinstance(obj, np.floating): return float(obj)
    if isinstance(obj, np.bool_):    return bool(obj)
    if isinstance(obj, np.ndarray):  return obj.tolist()
    return obj


# ── Flask app with numpy-safe JSON ────────────────────────────────────────────
class _App(Flask):
    json_provider_class = _NP

app = _App(__name__)
CORS(app, resources={r'/api/*': {'origins': '*'}})

# ── Config ────────────────────────────────────────────────────────────────────
app.config.update(
    SECRET_KEY               = os.getenv('SECRET_KEY', 'landiq-secret-dev-key-32chars!!'),
    JWT_SECRET_KEY           = os.getenv('JWT_SECRET_KEY', 'landiq-jwt-dev-key-32chars!!!'),
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))),
    MAX_CONTENT_LENGTH       = 16 * 1024 * 1024,
    UPLOAD_FOLDER            = os.getenv('UPLOAD_FOLDER',  os.path.join(BASE_DIR, 'uploads')),
    REPORTS_FOLDER           = os.getenv('REPORTS_FOLDER', os.path.join(BASE_DIR, 'reports')),
)

os.makedirs(app.config['UPLOAD_FOLDER'],  exist_ok=True)
os.makedirs(app.config['REPORTS_FOLDER'], exist_ok=True)

JWTManager(app)

limiter = Limiter(
    get_remote_address, app=app,
    default_limits=['200 per day', '60 per hour'],
    storage_uri='memory://',
)

try:
    from prometheus_flask_exporter import PrometheusMetrics
    PrometheusMetrics(app, default_labels={'app': 'landiq'})
except Exception:
    pass

# ── Blueprints ────────────────────────────────────────────────────────────────
from app.routes.auth      import auth_bp
from app.routes.parcels   import parcels_bp
from app.routes.analysis  import analysis_bp
from app.routes.documents import documents_bp
from app.routes.admin     import admin_bp

for bp in [auth_bp, parcels_bp, analysis_bp, documents_bp, admin_bp]:
    app.register_blueprint(bp)

from app.database import init_db
with app.app_context():
    init_db()

# ── AI modules ────────────────────────────────────────────────────────────────
from modules.valuation       import predict_value
from modules.risk_analysis   import analyze_risk
from modules.fraud_detection import detect_fraud
from modules.forecasting     import forecast_prices
from modules.legal_intel     import parse_document
from modules.report_gen      import generate_report

_store = {}


def _jsonify(data):
    return app.response_class(
        json.dumps(_safe(data), ensure_ascii=False) + '\n',
        mimetype='application/json'
    )


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get('/api/health')
def health():
    return _jsonify({'status': 'ok', 'version': '2.0.0'})


@app.post('/api/analyze')
@limiter.limit('30 per hour')
def analyze():
    data = request.get_json()
    if not data:
        return _jsonify({'error': 'No data provided'}), 400

    for f in ['area_sqft', 'zone', 'infrastructure', 'asking_price']:
        if f not in data:
            return _jsonify({'error': 'Missing field: ' + f}), 400

    if not data.get('city')     and data.get('locality'): data['city']     = data['locality']
    if not data.get('locality') and data.get('city'):     data['locality'] = data['city']

    doc_path = data.pop('_doc_path', None)
    legal    = parse_document(doc_path, data) if doc_path else {'status': 'no_document'}

    try:
        valuation = _safe(predict_value(data))
        risk      = _safe(analyze_risk(data, valuation))
        fraud     = _safe(detect_fraud(data, valuation))
        forecast  = _safe(forecast_prices(data))
    except Exception as e:
        return _jsonify({'error': 'AI error: ' + str(e)}), 500

    estimated = float(valuation['estimated_value'])
    asking    = float(data['asking_price'])
    diff_pct  = round(((asking - estimated) / estimated) * 100, 2)

    if bool(fraud['fraud_detected']):
        rec = 'AVOID - Fraud signals detected. Do not proceed.'
    elif float(risk['risk_score']) > 70:
        rec = 'HIGH RISK - Proceed only with full legal due diligence.'
    elif diff_pct > 20:
        rec = 'OVERPRICED - Negotiate down or walk away.'
    elif diff_pct < -15:
        rec = 'GOOD DEAL - Below market value. Verify legal status.'
    else:
        rec = 'FAIR DEAL - Price aligns with market. Standard due diligence advised.'

    aid = str(uuid.uuid4())[:8]
    result = _safe({
        'analysis_id': aid, 'input': data,
        'valuation': valuation, 'risk': risk,
        'fraud': fraud, 'forecast': forecast,
        'legal': legal, 'recommendation': rec,
        'asking_vs_estimated_pct': diff_pct,
    })
    _store[aid] = result
    return _jsonify(result)


@app.post('/api/upload-doc')
@limiter.limit('20 per hour')
def upload_doc():
    if 'file' not in request.files:
        return _jsonify({'error': 'No file'}), 400
    f   = request.files['file']
    ext = os.path.splitext(f.filename)[1].lower()
    if ext not in {'.txt', '.pdf', '.png', '.jpg', '.jpeg'}:
        return _jsonify({'error': 'Unsupported type'}), 400
    path = os.path.join(app.config['UPLOAD_FOLDER'], uuid.uuid4().hex + ext)
    f.save(path)
    return _jsonify({'file_path': path, 'status': 'uploaded'})


@app.get('/api/report/<aid>')
def get_report(aid):
    if aid not in _store:
        return _jsonify({'error': 'Not found'}), 404
    path = os.path.join(app.config['REPORTS_FOLDER'], 'report_' + aid + '.pdf')
    try:
        generate_report(_store[aid], path)
    except Exception as e:
        return _jsonify({'error': str(e)}), 500
    return send_file(path, as_attachment=True,
                     download_name='LandIQ_' + aid + '.pdf',
                     mimetype='application/pdf')


if __name__ == '__main__':
    print('=' * 50)
    print('  LandIQ Backend v2.0.0')
    print('  http://localhost:5000')
    print('=' * 50)
    app.run(debug=False, port=5000, host='0.0.0.0')

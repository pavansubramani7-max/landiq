"""
Live integration test — run with: python test_api.py
Requires backend running on http://localhost:5000
"""
import requests
import json
import sys

BASE = 'http://localhost:5000'
PASS = '\033[92m✓\033[0m'
FAIL = '\033[91m✗\033[0m'
errors = []


def check(label, condition, detail=''):
    if condition:
        print(f'  {PASS} {label}')
    else:
        print(f'  {FAIL} {label} {detail}')
        errors.append(label)


def section(title):
    print(f'\n\033[1m{title}\033[0m')


# ── Health ────────────────────────────────────────────────────────────────────
section('Health')
r = requests.get(f'{BASE}/api/health')
check('GET /api/health → 200', r.status_code == 200)
check('status == ok', r.json().get('status') == 'ok')

# ── Auth ──────────────────────────────────────────────────────────────────────
section('Auth')
reg = requests.post(f'{BASE}/api/auth/register', json={
    'email': 'livetest@landiq.com',
    'password': 'test1234',
    'full_name': 'Live Test User'
})
check('POST /api/auth/register → 201 or 409', reg.status_code in (201, 409))

login = requests.post(f'{BASE}/api/auth/login', json={
    'email': 'livetest@landiq.com',
    'password': 'test1234'
})
check('POST /api/auth/login → 200', login.status_code == 200)
token = login.json().get('token', '')
check('Token received', bool(token))
headers = {'Authorization': f'Bearer {token}'}

me = requests.get(f'{BASE}/api/auth/me', headers=headers)
check('GET /api/auth/me → 200', me.status_code == 200)
check('Email matches', me.json().get('email') == 'livetest@landiq.com')

# ── Parcels ───────────────────────────────────────────────────────────────────
section('Parcels')
parcel_data = {
    'survey_number': 'LIVE-TEST-001',
    'state': 'Telangana',
    'district': 'Hyderabad',
    'city': 'Hyderabad',
    'pincode': '500001',
    'land_type': 'commercial',
    'area_sqft': 8500,
    'quoted_price': 12000000,
    'owner_name': 'Live Test Owner',
    'num_ownership_changes': 2,
    'dist_highway_km': 3.5,
    'flood_zone_risk': 'low',
    'pending_litigations': 'none',
}
cp = requests.post(f'{BASE}/api/parcels/', json=parcel_data, headers=headers)
check('POST /api/parcels/ → 201', cp.status_code == 201)
parcel_id = cp.json().get('id', '')
check('Parcel ID received', bool(parcel_id))

lp = requests.get(f'{BASE}/api/parcels/', headers=headers)
check('GET /api/parcels/ → 200', lp.status_code == 200)
check('Parcel in list', any(p['id'] == parcel_id for p in lp.json()))

gp = requests.get(f'{BASE}/api/parcels/{parcel_id}', headers=headers)
check('GET /api/parcels/:id → 200', gp.status_code == 200)

up = requests.put(f'{BASE}/api/parcels/{parcel_id}', json={'owner_name': 'Updated Owner'}, headers=headers)
check('PUT /api/parcels/:id → 200', up.status_code == 200)
check('Owner updated', up.json().get('owner_name') == 'Updated Owner')

# ── Analysis ──────────────────────────────────────────────────────────────────
section('Analysis (JWT)')
an = requests.post(f'{BASE}/api/analysis/parcel/{parcel_id}',
                   json={'infrastructure': 'good'}, headers=headers)
check('POST /api/analysis/parcel/:id → 200', an.status_code == 200)
pred = an.json()
check('prediction_id present', 'prediction_id' in pred)
check('valuation present', 'valuation' in pred)
check('risk present', 'risk' in pred)
check('fraud present', 'fraud' in pred)
check('recommendation present', 'recommendation' in pred)
check('investment_score 0-100', 0 <= pred.get('investment_score', -1) <= 100)
pred_id = pred.get('prediction_id', '')

hist = requests.get(f'{BASE}/api/analysis/parcel/{parcel_id}/history', headers=headers)
check('GET /api/analysis/parcel/:id/history → 200', hist.status_code == 200)
check('History is list', isinstance(hist.json(), list))

if pred_id:
    rep = requests.get(f'{BASE}/api/analysis/report/{pred_id}', headers=headers)
    check('GET /api/analysis/report/:id → 200', rep.status_code == 200)
    check('Content-Type is PDF', 'pdf' in rep.headers.get('Content-Type', ''))

# ── Legacy analyze ────────────────────────────────────────────────────────────
section('Legacy /api/analyze')
payload = {
    'area_sqft': 8500, 'city': 'Hyderabad', 'state': 'Telangana',
    'zone': 'commercial', 'infrastructure': 'good', 'asking_price': 12000000,
    'distance_highway_km': 3.5, 'distance_city_center_km': 8.0,
    'distance_water_km': 2.0, 'ownership_changes': 2, 'years_held': 4,
    'legal_disputes': False, 'flood_zone': False
}
la = requests.post(f'{BASE}/api/analyze', json=payload)
check('POST /api/analyze → 200', la.status_code == 200)
data = la.json()
check('Estimated value > 0', data.get('valuation', {}).get('estimated_value', 0) > 0)
check('Risk score 0-100', 0 <= data.get('risk', {}).get('risk_score', -1) <= 100)
check('Forecast has 6 points', len(data.get('forecast', {}).get('series', [])) == 6)
aid = data.get('analysis_id', '')
if aid:
    rp = requests.get(f'{BASE}/api/report/{aid}')
    check('GET /api/report/:id → 200 PDF', rp.status_code == 200 and 'pdf' in rp.headers.get('Content-Type', ''))
    with open(f'test_report_{aid}.pdf', 'wb') as f:
        f.write(rp.content)
    print(f'  → PDF saved: test_report_{aid}.pdf')

# ── Summary ───────────────────────────────────────────────────────────────────
print(f'\n{"="*50}')
if errors:
    print(f'\033[91m{len(errors)} test(s) FAILED:\033[0m')
    for e in errors:
        print(f'  - {e}')
    sys.exit(1)
else:
    print(f'\033[92mAll tests passed!\033[0m')

import pytest


# ── Health ────────────────────────────────────────────────────────────────────
class TestHealth:
    def test_health_ok(self, client):
        r = client.get('/api/health')
        assert r.status_code == 200
        assert r.get_json()['status'] == 'ok'
        assert 'version' in r.get_json()


# ── Legacy /api/analyze ───────────────────────────────────────────────────────
class TestAnalyze:
    def test_analyze_success(self, client, sample_payload):
        r = client.post('/api/analyze', json=sample_payload)
        assert r.status_code == 200
        data = r.get_json()
        for key in ('analysis_id', 'valuation', 'risk', 'fraud', 'forecast', 'recommendation'):
            assert key in data

    def test_analyze_missing_fields(self, client):
        r = client.post('/api/analyze', json={'area_sqft': 1000})
        assert r.status_code == 400
        assert 'Missing fields' in r.get_json()['error']

    def test_analyze_no_body(self, client):
        r = client.post('/api/analyze', data='', content_type='application/json')
        assert r.status_code == 400

    def test_valuation_structure(self, client, sample_payload):
        val = client.post('/api/analyze', json=sample_payload).get_json()['valuation']
        assert val['estimated_value'] > 0
        assert 'price_per_sqft' in val
        assert 0 <= val['confidence_pct'] <= 100

    def test_risk_structure(self, client, sample_payload):
        risk = client.post('/api/analyze', json=sample_payload).get_json()['risk']
        assert risk['risk_level'] in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
        assert 0 <= risk['risk_score'] <= 100
        assert 'breakdown' in risk

    def test_fraud_structure(self, client, sample_payload):
        fraud = client.post('/api/analyze', json=sample_payload).get_json()['fraud']
        assert 'fraud_detected' in fraud
        assert isinstance(fraud['signals'], list)

    def test_forecast_6_points(self, client, sample_payload):
        fc = client.post('/api/analyze', json=sample_payload).get_json()['forecast']
        assert len(fc['series']) == 6
        assert fc['series'][5]['total_value'] > fc['series'][0]['total_value']

    def test_fraud_detected_on_suspicious(self, client, sample_payload):
        sample_payload['asking_price'] = 100000
        sample_payload['ownership_changes'] = 5
        sample_payload['years_held'] = 1
        fraud = client.post('/api/analyze', json=sample_payload).get_json()['fraud']
        assert fraud['fraud_detected'] is True

    def test_report_pdf(self, client, sample_payload):
        aid = client.post('/api/analyze', json=sample_payload).get_json()['analysis_id']
        r = client.get(f'/api/report/{aid}')
        assert r.status_code == 200
        assert r.content_type == 'application/pdf'

    def test_report_not_found(self, client):
        assert client.get('/api/report/nonexistent').status_code == 404


# ── Auth ──────────────────────────────────────────────────────────────────────
class TestAuth:
    def test_register_success(self, client):
        r = client.post('/api/auth/register', json={
            'email': 'newuser@test.com',
            'password': 'pass1234',
            'full_name': 'New User'
        })
        assert r.status_code in (201, 409)
        if r.status_code == 201:
            data = r.get_json()
            assert 'token' in data
            assert data['user']['email'] == 'newuser@test.com'
            assert data['user']['role'] == 'user'

    def test_register_missing_field(self, client):
        r = client.post('/api/auth/register', json={'email': 'x@x.com'})
        assert r.status_code == 400

    def test_login_success(self, client, user_token):
        assert user_token is not None
        assert len(user_token) > 10

    def test_login_wrong_password(self, client):
        r = client.post('/api/auth/login', json={
            'email': 'testuser@landiq.com',
            'password': 'wrongpass'
        })
        assert r.status_code == 401

    def test_login_unknown_email(self, client):
        r = client.post('/api/auth/login', json={
            'email': 'nobody@nowhere.com',
            'password': 'pass'
        })
        assert r.status_code == 401

    def test_me_authenticated(self, client, auth_headers):
        r = client.get('/api/auth/me', headers=auth_headers)
        assert r.status_code == 200
        assert 'email' in r.get_json()

    def test_me_unauthenticated(self, client):
        r = client.get('/api/auth/me')
        assert r.status_code == 401


# ── Parcels ───────────────────────────────────────────────────────────────────
class TestParcels:
    def test_list_requires_auth(self, client):
        assert client.get('/api/parcels/').status_code == 401

    def test_create_parcel(self, client, auth_headers):
        r = client.post('/api/parcels/', json={
            'survey_number': 'SRV-001',
            'state': 'Karnataka',
            'district': 'Bangalore Urban',
            'city': 'Bangalore',
            'pincode': '560001',
            'land_type': 'commercial',
            'area_sqft': 3000,
            'quoted_price': 9000000,
            'owner_name': 'Ravi Kumar',
        }, headers=auth_headers)
        assert r.status_code == 201
        data = r.get_json()
        assert data['survey_number'] == 'SRV-001'
        assert data['city'] == 'Bangalore'
        return data['id']

    def test_create_parcel_missing_fields(self, client, auth_headers):
        r = client.post('/api/parcels/', json={'city': 'Mumbai'}, headers=auth_headers)
        assert r.status_code == 400

    def test_list_parcels(self, client, auth_headers, sample_parcel):
        r = client.get('/api/parcels/', headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.get_json(), list)

    def test_get_parcel(self, client, auth_headers, sample_parcel):
        pid = sample_parcel['id']
        r = client.get(f'/api/parcels/{pid}', headers=auth_headers)
        assert r.status_code == 200
        assert r.get_json()['id'] == pid

    def test_get_parcel_not_found(self, client, auth_headers):
        r = client.get('/api/parcels/nonexistent-id', headers=auth_headers)
        assert r.status_code == 404

    def test_update_parcel(self, client, auth_headers, sample_parcel):
        pid = sample_parcel['id']
        r = client.put(f'/api/parcels/{pid}', json={'owner_name': 'Updated Owner'}, headers=auth_headers)
        assert r.status_code == 200
        assert r.get_json()['owner_name'] == 'Updated Owner'

    def test_delete_parcel(self, client, auth_headers):
        r = client.post('/api/parcels/', json={
            'survey_number': 'SRV-DEL-001',
            'state': 'Maharashtra',
            'district': 'Mumbai',
            'city': 'Mumbai',
            'pincode': '400001',
            'land_type': 'residential',
            'area_sqft': 1000,
            'quoted_price': 2000000,
            'owner_name': 'Delete Me',
        }, headers=auth_headers)
        pid = r.get_json()['id']
        r2 = client.delete(f'/api/parcels/{pid}', headers=auth_headers)
        assert r2.status_code == 200
        assert client.get(f'/api/parcels/{pid}', headers=auth_headers).status_code == 404


# ── Analysis ──────────────────────────────────────────────────────────────────
class TestAnalysis:
    def test_analyze_parcel(self, client, auth_headers, sample_parcel):
        pid = sample_parcel['id']
        r = client.post(f'/api/analysis/parcel/{pid}',
                        json={'infrastructure': 'good'},
                        headers=auth_headers)
        assert r.status_code == 200
        data = r.get_json()
        assert 'prediction_id' in data
        assert 'valuation' in data
        assert 'risk' in data
        assert 'fraud' in data
        assert 'recommendation' in data
        assert 0 <= data['investment_score'] <= 100
        assert 0 <= data['fraud_probability'] <= 1

    def test_analyze_parcel_not_found(self, client, auth_headers):
        r = client.post('/api/analysis/parcel/nonexistent',
                        json={}, headers=auth_headers)
        assert r.status_code == 404

    def test_parcel_history(self, client, auth_headers, sample_parcel):
        pid = sample_parcel['id']
        client.post(f'/api/analysis/parcel/{pid}', json={}, headers=auth_headers)
        r = client.get(f'/api/analysis/parcel/{pid}/history', headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.get_json(), list)

    def test_analysis_requires_auth(self, client, sample_parcel):
        pid = sample_parcel['id']
        assert client.post(f'/api/analysis/parcel/{pid}', json={}).status_code == 401


# ── Admin ─────────────────────────────────────────────────────────────────────
class TestAdmin:
    def test_stats_requires_auth(self, client):
        assert client.get('/api/admin/stats').status_code == 401

    def test_stats_requires_admin_role(self, client, auth_headers):
        r = client.get('/api/admin/stats', headers=auth_headers)
        assert r.status_code == 403

    def test_stats_as_admin(self, client, admin_headers):
        r = client.get('/api/admin/stats', headers=admin_headers)
        assert r.status_code == 200
        data = r.get_json()
        for key in ('total_users', 'active_users', 'total_parcels', 'total_analyses', 'total_documents'):
            assert key in data

    def test_list_users_as_admin(self, client, admin_headers):
        r = client.get('/api/admin/users', headers=admin_headers)
        assert r.status_code == 200
        assert isinstance(r.get_json(), list)
        assert len(r.get_json()) > 0

    def test_update_user_role(self, client, admin_headers, user_token):
        from flask_jwt_extended import decode_token
        import importlib.util, os
        spec = importlib.util.spec_from_file_location(
            "main_app",
            os.path.join(os.path.dirname(__file__), '..', 'app.py')
        )
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        flask_app = mod.app
        with flask_app.app_context():
            uid = decode_token(user_token)['sub']
        r = client.patch(f'/api/admin/users/{uid}',
                         json={'role': 'analyst'},
                         headers=admin_headers)
        assert r.status_code == 200
        assert r.get_json()['role'] == 'analyst'
        # Reset back
        client.patch(f'/api/admin/users/{uid}', json={'role': 'user'}, headers=admin_headers)

    def test_analyses_log_as_admin(self, client, admin_headers):
        r = client.get('/api/admin/analyses', headers=admin_headers)
        assert r.status_code == 200
        assert isinstance(r.get_json(), list)


# ── ML Modules Direct ─────────────────────────────────────────────────────────
class TestModules:
    def test_valuation_direct(self):
        from modules.valuation import predict_value
        result = predict_value({
            'area_sqft': 3000, 'city': 'Bangalore', 'zone': 'residential',
            'infrastructure': 'good', 'distance_highway_km': 4,
            'distance_city_center_km': 8, 'distance_water_km': 2,
            'ownership_changes': 1, 'years_held': 3,
            'legal_disputes': False, 'flood_zone': False
        })
        assert result['estimated_value'] > 0
        assert 0 <= result['confidence_pct'] <= 100
        assert 'rf_estimate' in result
        assert 'xgb_estimate' in result

    def test_risk_high_on_disputes(self):
        from modules.risk_analysis import analyze_risk
        from modules.valuation import predict_value
        data = {
            'area_sqft': 3000, 'city': 'Kolkata', 'zone': 'residential',
            'infrastructure': 'poor', 'asking_price': 9000000,
            'distance_highway_km': 10, 'distance_city_center_km': 20,
            'distance_water_km': 0.3, 'ownership_changes': 5,
            'years_held': 2, 'legal_disputes': True, 'flood_zone': True
        }
        risk = analyze_risk(data, predict_value(data))
        assert risk['risk_level'] in ('HIGH', 'CRITICAL')
        assert len(risk['breakdown']) == 6

    def test_fraud_signals(self):
        from modules.fraud_detection import detect_fraud
        data = {
            'area_sqft': 1000, 'asking_price': 50000,
            'zone': 'commercial', 'ownership_changes': 5,
            'years_held': 1, 'legal_disputes': True
        }
        fraud = detect_fraud(data, {'estimated_value': 5000000})
        assert fraud['fraud_detected'] is True
        assert fraud['signal_count'] >= 2

    def test_forecast_growth(self):
        from modules.forecasting import forecast_prices
        fc = forecast_prices({
            'city': 'Hyderabad', 'zone': 'commercial',
            'infrastructure': 'excellent', 'asking_price': 5000000, 'area_sqft': 1000
        })
        assert fc['series'][5]['total_value'] > fc['series'][0]['total_value']
        assert fc['annual_growth_rate_pct'] > 0
        assert fc['five_year_gain_pct'] > 0

    def test_legal_intel_parse(self, tmp_path):
        from modules.legal_intel import parse_document
        doc = tmp_path / 'test.txt'
        doc.write_text('Owner: Ravi Kumar\nArea: 3000 sqft\nSurvey No: 123/A')
        result = parse_document(str(doc), {'area_sqft': 3000, 'owner_name': 'Ravi Kumar'})
        assert result['status'] == 'parsed'
        assert 'integrity_score' in result
        assert 'raw_text' in result

    def test_legal_intel_missing_file(self):
        from modules.legal_intel import parse_document
        result = parse_document('/nonexistent/file.txt', {})
        assert result['status'] == 'file_not_found'

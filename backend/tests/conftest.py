import pytest
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import importlib.util
spec = importlib.util.spec_from_file_location(
    "main_app",
    os.path.join(os.path.dirname(__file__), '..', 'app.py')
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
flask_app = module.app
from app.database import Base, engine, SessionLocal
from app.models.user import User, UserRole


@pytest.fixture(scope='session', autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    flask_app.config['TESTING'] = True
    flask_app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
    with flask_app.test_client() as c:
        yield c


@pytest.fixture
def db():
    session = SessionLocal()
    yield session
    session.close()


@pytest.fixture
def sample_payload():
    return {
        'area_sqft': 5000,
        'city': 'Hyderabad',
        'state': 'Telangana',
        'zone': 'residential',
        'infrastructure': 'good',
        'asking_price': 5000000,
        'owner_name': 'Test Owner',
        'distance_highway_km': 5.0,
        'distance_city_center_km': 10.0,
        'distance_water_km': 3.0,
        'ownership_changes': 1,
        'years_held': 5,
        'legal_disputes': False,
        'flood_zone': False
    }


@pytest.fixture
def user_token(client):
    """Register a regular user and return JWT token."""
    r = client.post('/api/auth/register', json={
        'email': 'testuser@landiq.com',
        'password': 'test1234',
        'full_name': 'Test User'
    })
    if r.status_code == 409:
        r = client.post('/api/auth/login', json={
            'email': 'testuser@landiq.com',
            'password': 'test1234'
        })
    return r.get_json()['token']


@pytest.fixture
def admin_token(client, db):
    """Create an admin user and return JWT token."""
    email = 'admin@landiq.com'
    existing = db.query(User).filter_by(email=email).first()
    if not existing:
        u = User(email=email, full_name='Admin User', role=UserRole.admin)
        u.set_password('admin1234')
        db.add(u)
        db.commit()
    r = client.post('/api/auth/login', json={'email': email, 'password': 'admin1234'})
    return r.get_json()['token']


@pytest.fixture
def auth_headers(user_token):
    return {'Authorization': f'Bearer {user_token}'}


@pytest.fixture
def admin_headers(admin_token):
    return {'Authorization': f'Bearer {admin_token}'}


@pytest.fixture
def sample_parcel(client, auth_headers):
    """Create a parcel and return its data."""
    r = client.post('/api/parcels/', json={
        'survey_number': 'SRV-TEST-001',
        'state': 'Telangana',
        'district': 'Hyderabad',
        'city': 'Hyderabad',
        'pincode': '500001',
        'land_type': 'residential',
        'area_sqft': 5000,
        'quoted_price': 5000000,
        'owner_name': 'Test Owner',
    }, headers=auth_headers)
    return r.get_json()

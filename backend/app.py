from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from models.database import db
import os

# Load .env file if present (local dev)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)

# Config - reads from environment variables (works locally and on Railway)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'foreignedge-secret-dev-key')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'foreignedge-jwt-dev-key')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['GROQ_API_KEY'] = os.environ.get('GROQ_API_KEY', '')

# Database - Railway provides DATABASE_URL for Postgres, fallback to SQLite locally
database_url = os.environ.get('DATABASE_URL', 'sqlite:///foreignedge.db')
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)
app.config['SQLALCHEMY_DATABASE_URI'] = database_url

# CORS
allowed_origins = ["http://localhost:5173", "http://localhost:3000", "http://localhost:4173"]
frontend_url = os.environ.get('FRONTEND_URL')
if frontend_url:
    allowed_origins.append(frontend_url)
CORS(app, origins=allowed_origins, supports_credentials=True)

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

from routes.auth import auth_bp
from routes.universities import unis_bp
from routes.scholarships import scholarships_bp
from routes.accommodation import accommodation_bp
from routes.restaurants import restaurants_bp
from routes.airlines import airlines_bp
from routes.transport import transport_bp
from routes.profile import profile_bp
from routes.admin import admin_bp
from routes.calculators import calc_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(unis_bp, url_prefix='/api/universities')
app.register_blueprint(scholarships_bp, url_prefix='/api/scholarships')
app.register_blueprint(accommodation_bp, url_prefix='/api/accommodation')
app.register_blueprint(restaurants_bp, url_prefix='/api/restaurants')
app.register_blueprint(airlines_bp, url_prefix='/api/airlines')
app.register_blueprint(transport_bp, url_prefix='/api/transport')
app.register_blueprint(profile_bp, url_prefix='/api/profile')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(calc_bp, url_prefix='/api/calculators')

with app.app_context():
    db.create_all()
    from models.seed import seed_database
    seed_database()
    print("✅ ForeignEdge backend ready!")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.run(debug=debug, host='0.0.0.0', port=port)

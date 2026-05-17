from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(120))
    nationality = db.Column(db.String(80))
    phone = db.Column(db.String(30))
    avatar = db.Column(db.String(255), default='')
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    profile = db.relationship('StudentProfile', backref='user', uselist=False, lazy=True)

    def to_dict(self):
        return {
            'id': self.id, 'email': self.email, 'full_name': self.full_name,
            'nationality': self.nationality, 'phone': self.phone,
            'avatar': self.avatar, 'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat()
        }

class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    dob = db.Column(db.String(20))
    current_education = db.Column(db.String(100))
    gpa = db.Column(db.Float)
    gpa_scale = db.Column(db.String(10), default='4.0')
    field_of_interest = db.Column(db.String(200))
    target_degree = db.Column(db.String(50))
    target_countries = db.Column(db.String(500))
    budget_range = db.Column(db.String(50))
    english_test = db.Column(db.String(50))
    english_score = db.Column(db.String(20))
    gre_score = db.Column(db.String(20))
    gmat_score = db.Column(db.String(20))
    work_experience = db.Column(db.Integer, default=0)
    publications = db.Column(db.Integer, default=0)
    awards = db.Column(db.Text)
    statement_of_purpose = db.Column(db.Text)
    ai_evaluation = db.Column(db.Text)
    evaluation_score = db.Column(db.Integer)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'user_id': self.user_id, 'dob': self.dob,
            'current_education': self.current_education, 'gpa': self.gpa,
            'gpa_scale': self.gpa_scale, 'field_of_interest': self.field_of_interest,
            'target_degree': self.target_degree, 'target_countries': self.target_countries,
            'budget_range': self.budget_range, 'english_test': self.english_test,
            'english_score': self.english_score, 'gre_score': self.gre_score,
            'gmat_score': self.gmat_score, 'work_experience': self.work_experience,
            'publications': self.publications, 'awards': self.awards,
            'statement_of_purpose': self.statement_of_purpose,
            'ai_evaluation': self.ai_evaluation, 'evaluation_score': self.evaluation_score
        }

class University(db.Model):
    __tablename__ = 'universities'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    country = db.Column(db.String(100))
    country_code = db.Column(db.String(10))
    city = db.Column(db.String(100))
    ranking_qs = db.Column(db.Integer)
    ranking_the = db.Column(db.Integer)
    ranking_national = db.Column(db.Integer)
    established = db.Column(db.Integer)
    type = db.Column(db.String(50))           # Public / Private / Technical
    website = db.Column(db.String(255))
    apply_url = db.Column(db.String(255))
    description = db.Column(db.Text)
    about_long = db.Column(db.Text)           # Extended description from Groq
    logo = db.Column(db.String(255))
    image = db.Column(db.String(255))
    campus_images = db.Column(db.Text)        # JSON array of image URLs
    # Tuition
    tuition_min = db.Column(db.Integer)
    tuition_max = db.Column(db.Integer)
    tuition_currency = db.Column(db.String(10), default='USD')
    tuition_notes = db.Column(db.String(255))
    # Admissions
    acceptance_rate = db.Column(db.Float)
    student_count = db.Column(db.Integer)
    international_students = db.Column(db.Integer)
    international_percent = db.Column(db.Float)
    faculty_count = db.Column(db.Integer)
    student_faculty_ratio = db.Column(db.String(20))
    programs_count = db.Column(db.Integer)
    # Requirements
    application_deadline = db.Column(db.String(255))
    application_deadline_spring = db.Column(db.String(100))
    application_deadline_fall = db.Column(db.String(100))
    ielts_requirement = db.Column(db.Float)
    toefl_requirement = db.Column(db.Integer)
    duolingo_requirement = db.Column(db.Integer)
    gre_required = db.Column(db.Boolean, default=False)
    gmat_required = db.Column(db.Boolean, default=False)
    min_gpa = db.Column(db.Float)
    # Campus & Life
    campus_size = db.Column(db.String(50))
    campus_type = db.Column(db.String(50))    # Urban / Suburban / Rural
    housing_available = db.Column(db.Boolean, default=True)
    housing_cost_min = db.Column(db.Integer)
    housing_cost_max = db.Column(db.Integer)
    scholarships_available = db.Column(db.Boolean, default=True)
    # Extra
    notable_alumni = db.Column(db.Text)       # JSON array
    research_output = db.Column(db.String(50))
    nobel_laureates = db.Column(db.Integer, default=0)
    world_class_fields = db.Column(db.Text)   # JSON array of strong fields
    tags = db.Column(db.String(500))          # comma-separated tags
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    data_source = db.Column(db.String(50), default='manual')
    ai_enriched = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    programs = db.relationship('Program', backref='university', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        import json
        return {
            'id': self.id, 'name': self.name, 'country': self.country,
            'country_code': self.country_code, 'city': self.city,
            'ranking_qs': self.ranking_qs, 'ranking_the': self.ranking_the,
            'ranking_national': self.ranking_national,
            'established': self.established, 'type': self.type,
            'website': self.website, 'apply_url': self.apply_url,
            'description': self.description, 'about_long': self.about_long,
            'logo': self.logo, 'image': self.image,
            'campus_images': json.loads(self.campus_images) if self.campus_images else [],
            'tuition_min': self.tuition_min, 'tuition_max': self.tuition_max,
            'tuition_currency': self.tuition_currency, 'tuition_notes': self.tuition_notes,
            'acceptance_rate': self.acceptance_rate, 'student_count': self.student_count,
            'international_students': self.international_students,
            'international_percent': self.international_percent,
            'faculty_count': self.faculty_count,
            'student_faculty_ratio': self.student_faculty_ratio,
            'programs_count': self.programs_count,
            'application_deadline': self.application_deadline,
            'application_deadline_spring': self.application_deadline_spring,
            'application_deadline_fall': self.application_deadline_fall,
            'ielts_requirement': self.ielts_requirement,
            'toefl_requirement': self.toefl_requirement,
            'duolingo_requirement': self.duolingo_requirement,
            'gre_required': self.gre_required, 'gmat_required': self.gmat_required,
            'min_gpa': self.min_gpa,
            'campus_size': self.campus_size, 'campus_type': self.campus_type,
            'housing_available': self.housing_available,
            'housing_cost_min': self.housing_cost_min, 'housing_cost_max': self.housing_cost_max,
            'scholarships_available': self.scholarships_available,
            'notable_alumni': json.loads(self.notable_alumni) if self.notable_alumni else [],
            'research_output': self.research_output, 'nobel_laureates': self.nobel_laureates,
            'world_class_fields': json.loads(self.world_class_fields) if self.world_class_fields else [],
            'tags': self.tags.split(',') if self.tags else [],
            'latitude': self.latitude, 'longitude': self.longitude,
            'ai_enriched': self.ai_enriched,
        }

class Program(db.Model):
    __tablename__ = 'programs'
    id = db.Column(db.Integer, primary_key=True)
    university_id = db.Column(db.Integer, db.ForeignKey('universities.id'))
    name = db.Column(db.String(255))
    degree_level = db.Column(db.String(50))   # Bachelor / Master / PhD / MBA
    duration = db.Column(db.String(50))
    language = db.Column(db.String(50), default='English')
    tuition = db.Column(db.Integer)
    currency = db.Column(db.String(10), default='USD')
    field = db.Column(db.String(100))
    start_date = db.Column(db.String(100))
    application_deadline = db.Column(db.String(100))
    description = db.Column(db.Text)
    requirements = db.Column(db.Text)
    ielts_min = db.Column(db.Float)
    toefl_min = db.Column(db.Integer)
    gpa_min = db.Column(db.Float)
    credits = db.Column(db.Integer)
    mode = db.Column(db.String(50), default='On Campus')   # On Campus / Online / Hybrid
    scholarship_available = db.Column(db.Boolean, default=False)
    apply_url = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.id, 'university_id': self.university_id,
            'name': self.name, 'degree_level': self.degree_level,
            'duration': self.duration, 'language': self.language,
            'tuition': self.tuition, 'currency': self.currency,
            'field': self.field, 'start_date': self.start_date,
            'application_deadline': self.application_deadline,
            'description': self.description, 'requirements': self.requirements,
            'ielts_min': self.ielts_min, 'toefl_min': self.toefl_min,
            'gpa_min': self.gpa_min, 'credits': self.credits,
            'mode': self.mode, 'scholarship_available': self.scholarship_available,
            'apply_url': self.apply_url,
        }

class Scholarship(db.Model):
    __tablename__ = 'scholarships'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    provider = db.Column(db.String(255))
    country = db.Column(db.String(100))
    host_country = db.Column(db.String(100))
    degree_level = db.Column(db.String(100))
    field_of_study = db.Column(db.String(255))
    amount = db.Column(db.String(100))
    coverage = db.Column(db.Text)
    deadline = db.Column(db.String(100))
    eligibility = db.Column(db.Text)
    description = db.Column(db.Text)
    website = db.Column(db.String(255))
    logo = db.Column(db.String(255))
    type = db.Column(db.String(50))
    fully_funded = db.Column(db.Boolean, default=False)
    renewable = db.Column(db.Boolean, default=False)
    number_of_awards = db.Column(db.String(50))
    open_to_nationalities = db.Column(db.String(500))

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'provider': self.provider,
            'country': self.country, 'host_country': self.host_country,
            'degree_level': self.degree_level, 'field_of_study': self.field_of_study,
            'amount': self.amount, 'coverage': self.coverage,
            'deadline': self.deadline, 'eligibility': self.eligibility,
            'description': self.description, 'website': self.website,
            'logo': self.logo, 'type': self.type, 'fully_funded': self.fully_funded,
            'renewable': self.renewable, 'number_of_awards': self.number_of_awards,
            'open_to_nationalities': self.open_to_nationalities,
        }

class Accommodation(db.Model):
    __tablename__ = 'accommodations'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    type = db.Column(db.String(50))
    price_min = db.Column(db.Integer)
    price_max = db.Column(db.Integer)
    currency = db.Column(db.String(10), default='USD')
    description = db.Column(db.Text)
    amenities = db.Column(db.Text)
    website = db.Column(db.String(255))
    image = db.Column(db.String(255))
    rating = db.Column(db.Float)
    distance_to_center = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'city': self.city,
            'country': self.country, 'type': self.type,
            'price_min': self.price_min, 'price_max': self.price_max,
            'currency': self.currency, 'description': self.description,
            'amenities': self.amenities, 'website': self.website,
            'image': self.image, 'rating': self.rating,
            'distance_to_center': self.distance_to_center,
        }

class Restaurant(db.Model):
    __tablename__ = 'restaurants'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    category = db.Column(db.String(100))
    is_halal = db.Column(db.Boolean, default=False)
    price_range = db.Column(db.String(20))
    rating = db.Column(db.Float)
    address = db.Column(db.String(255))
    description = db.Column(db.Text)
    image = db.Column(db.String(255))
    website = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'city': self.city,
            'country': self.country, 'category': self.category,
            'is_halal': self.is_halal, 'price_range': self.price_range,
            'rating': self.rating, 'address': self.address,
            'description': self.description, 'image': self.image, 'website': self.website,
        }

class Airline(db.Model):
    __tablename__ = 'airlines'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    code = db.Column(db.String(10))
    country = db.Column(db.String(100))
    logo = db.Column(db.String(255))
    website = db.Column(db.String(255))
    student_discount = db.Column(db.Boolean, default=False)
    baggage_allowance = db.Column(db.String(100))
    hubs = db.Column(db.String(255))
    rating = db.Column(db.Float)
    description = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'code': self.code,
            'country': self.country, 'logo': self.logo, 'website': self.website,
            'student_discount': self.student_discount,
            'baggage_allowance': self.baggage_allowance, 'hubs': self.hubs,
            'rating': self.rating, 'description': self.description,
        }

class TransportApp(db.Model):
    __tablename__ = 'transport_apps'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    category = db.Column(db.String(100))
    countries = db.Column(db.String(500))
    description = db.Column(db.Text)
    logo = db.Column(db.String(255))
    website = db.Column(db.String(255))
    app_store = db.Column(db.String(255))
    play_store = db.Column(db.String(255))
    rating = db.Column(db.Float)
    free = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'category': self.category,
            'countries': self.countries, 'description': self.description,
            'logo': self.logo, 'website': self.website,
            'app_store': self.app_store, 'play_store': self.play_store,
            'rating': self.rating, 'free': self.free,
        }

class SavedItem(db.Model):
    __tablename__ = 'saved_items'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    item_type = db.Column(db.String(50))
    item_id = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'user_id': self.user_id, 'item_type': self.item_type, 'item_id': self.item_id}

class Application(db.Model):
    __tablename__ = 'applications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    university_name = db.Column(db.String(255))
    program = db.Column(db.String(255))
    country = db.Column(db.String(100))
    intake = db.Column(db.String(50))
    status = db.Column(db.String(50), default='Planning')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'user_id': self.user_id,
            'university_name': self.university_name, 'program': self.program,
            'country': self.country, 'intake': self.intake,
            'status': self.status, 'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }

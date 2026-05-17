from flask import Blueprint, request, jsonify
from models.database import db, Accommodation
from sqlalchemy import or_

accommodation_bp = Blueprint('accommodation', __name__)

@accommodation_bp.route('/', methods=['GET'])
def get_accommodations():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    country = request.args.get('country', '')
    city = request.args.get('city', '')
    type_ = request.args.get('type', '')
    student_only = request.args.get('student_only', '')

    q = Accommodation.query
    if country:
        q = q.filter(Accommodation.country == country)
    if city:
        q = q.filter(Accommodation.city.ilike(f'%{city}%'))
    if type_:
        q = q.filter(Accommodation.type == type_)
    if student_only == 'true':
        q = q.filter(Accommodation.student_only == True)
    max_price = request.args.get('max_price', type=int)
    if max_price:
        q = q.filter(Accommodation.price_min <= max_price)
    search = request.args.get('search', '')
    if search:
        q = q.filter(
            db.or_(
                Accommodation.name.ilike(f'%{search}%'),
                Accommodation.city.ilike(f'%{search}%'),
                Accommodation.description.ilike(f'%{search}%')
            )
        )

    paginated = q.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'accommodations': [a.to_dict() for a in paginated.items],
        'total': paginated.total,
        'pages': paginated.pages
    })

@accommodation_bp.route('/countries', methods=['GET'])
def get_countries():
    countries = db.session.query(Accommodation.country).distinct().all()
    return jsonify([c[0] for c in countries if c[0]])

@accommodation_bp.route('/cities', methods=['GET'])
def get_cities():
    country = request.args.get('country', '')
    q = db.session.query(Accommodation.city).distinct()
    if country:
        q = q.filter(Accommodation.country == country)
    cities = q.all()
    return jsonify([c[0] for c in cities if c[0]])

@accommodation_bp.route('/<int:id>', methods=['GET'])
def get_accommodation(id):
    a = Accommodation.query.get_or_404(id)
    return jsonify(a.to_dict())

@accommodation_bp.route('/', methods=['POST'])
def create_accommodation():
    data = request.json
    a = Accommodation(**data)
    db.session.add(a)
    db.session.commit()
    return jsonify(a.to_dict()), 201

@accommodation_bp.route('/<int:id>', methods=['DELETE'])
def delete_accommodation(id):
    a = Accommodation.query.get_or_404(id)
    db.session.delete(a)
    db.session.commit()
    return jsonify({'message': 'Deleted'})
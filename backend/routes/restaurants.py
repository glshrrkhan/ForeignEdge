from flask import Blueprint, request, jsonify
from models.database import db, Restaurant
from sqlalchemy import or_

restaurants_bp = Blueprint('restaurants', __name__)

@restaurants_bp.route('/', methods=['GET'])
def get_restaurants():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    country = request.args.get('country', '')
    city = request.args.get('city', '')
    category = request.args.get('category', '')
    is_halal = request.args.get('is_halal', '')

    q = Restaurant.query
    if country:
        q = q.filter(Restaurant.country == country)
    if city:
        q = q.filter(Restaurant.city.ilike(f'%{city}%'))
    if category:
        q = q.filter(Restaurant.category == category)
    if is_halal == 'true':
        q = q.filter(Restaurant.is_halal == True)

    paginated = q.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'restaurants': [r.to_dict() for r in paginated.items],
        'total': paginated.total,
        'pages': paginated.pages
    })

@restaurants_bp.route('/countries', methods=['GET'])
def get_countries():
    countries = db.session.query(Restaurant.country).distinct().all()
    return jsonify([c[0] for c in countries if c[0]])

@restaurants_bp.route('/<int:id>', methods=['GET'])
def get_restaurant(id):
    r = Restaurant.query.get_or_404(id)
    return jsonify(r.to_dict())

@restaurants_bp.route('/', methods=['POST'])
def create_restaurant():
    data = request.json
    r = Restaurant(**data)
    db.session.add(r)
    db.session.commit()
    return jsonify(r.to_dict()), 201

@restaurants_bp.route('/<int:id>', methods=['DELETE'])
def delete_restaurant(id):
    r = Restaurant.query.get_or_404(id)
    db.session.delete(r)
    db.session.commit()
    return jsonify({'message': 'Deleted'})

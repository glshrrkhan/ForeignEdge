from flask import Blueprint, request, jsonify
from models.database import db, University, Program
from sqlalchemy import or_

unis_bp = Blueprint('universities', __name__)

@unis_bp.route('/', methods=['GET'])
def get_universities():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    search = request.args.get('search', '')
    country = request.args.get('country', '')
    degree = request.args.get('degree', '')
    sort = request.args.get('sort', 'ranking_qs')
    
    q = University.query
    if search:
        q = q.filter(or_(University.name.ilike(f'%{search}%'), University.city.ilike(f'%{search}%')))
    if country:
        q = q.filter(University.country == country)
    if sort == 'ranking_qs':
        q = q.order_by(University.ranking_qs.asc().nullslast())
    elif sort == 'name':
        q = q.order_by(University.name.asc())
    elif sort == 'tuition_low':
        q = q.order_by(University.tuition_min.asc().nullslast())
    
    paginated = q.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'universities': [u.to_dict() for u in paginated.items],
        'total': paginated.total,
        'pages': paginated.pages,
        'current_page': page
    })

@unis_bp.route('/<int:id>', methods=['GET'])
def get_university(id):
    uni = University.query.get_or_404(id)
    data = uni.to_dict()
    data['programs'] = [p.to_dict() for p in uni.programs]
    return jsonify(data)

@unis_bp.route('/countries', methods=['GET'])
def get_countries():
    countries = db.session.query(University.country).distinct().all()
    return jsonify([c[0] for c in countries if c[0]])

@unis_bp.route('/stats', methods=['GET'])
def get_stats():
    total = University.query.count()
    countries = db.session.query(University.country).distinct().count()
    programs = Program.query.count()
    return jsonify({'total_universities': total, 'countries': countries, 'programs': programs})

@unis_bp.route('/', methods=['POST'])
def create_university():
    data = request.json
    uni = University(**data)
    db.session.add(uni)
    db.session.commit()
    return jsonify(uni.to_dict()), 201

@unis_bp.route('/<int:id>', methods=['PUT'])
def update_university(id):
    uni = University.query.get_or_404(id)
    data = request.json
    for k, v in data.items():
        if hasattr(uni, k):
            setattr(uni, k, v)
    db.session.commit()
    return jsonify(uni.to_dict())

@unis_bp.route('/<int:id>', methods=['DELETE'])
def delete_university(id):
    uni = University.query.get_or_404(id)
    db.session.delete(uni)
    db.session.commit()
    return jsonify({'message': 'Deleted'})

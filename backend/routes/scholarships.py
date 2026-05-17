from flask import Blueprint, request, jsonify
from models.database import db, Scholarship
from sqlalchemy import or_

scholarships_bp = Blueprint('scholarships', __name__)

@scholarships_bp.route('/', methods=['GET'])
def get_scholarships():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    search = request.args.get('search', '')
    country = request.args.get('country', '')
    degree = request.args.get('degree', '')
    fully_funded = request.args.get('fully_funded', '')

    q = Scholarship.query
    if search:
        q = q.filter(or_(Scholarship.name.ilike(f'%{search}%'), Scholarship.provider.ilike(f'%{search}%')))
    if country:
        q = q.filter(or_(Scholarship.host_country.ilike(f'%{country}%'), Scholarship.host_country == 'Global'))
    if degree:
        q = q.filter(Scholarship.degree_level.ilike(f'%{degree}%'))
    if fully_funded == 'true':
        q = q.filter(Scholarship.fully_funded == True)

    paginated = q.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'scholarships': [s.to_dict() for s in paginated.items],
        'total': paginated.total,
        'pages': paginated.pages
    })

@scholarships_bp.route('/<int:id>', methods=['GET'])
def get_scholarship(id):
    s = Scholarship.query.get_or_404(id)
    return jsonify(s.to_dict())

@scholarships_bp.route('/', methods=['POST'])
def create_scholarship():
    data = request.json
    s = Scholarship(**data)
    db.session.add(s)
    db.session.commit()
    return jsonify(s.to_dict()), 201

@scholarships_bp.route('/<int:id>', methods=['PUT'])
def update_scholarship(id):
    s = Scholarship.query.get_or_404(id)
    data = request.json
    for k, v in data.items():
        if hasattr(s, k):
            setattr(s, k, v)
    db.session.commit()
    return jsonify(s.to_dict())

@scholarships_bp.route('/<int:id>', methods=['DELETE'])
def delete_scholarship(id):
    s = Scholarship.query.get_or_404(id)
    db.session.delete(s)
    db.session.commit()
    return jsonify({'message': 'Deleted'})

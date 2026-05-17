from flask import Blueprint, request, jsonify
from models.database import db, TransportApp

transport_bp = Blueprint('transport', __name__)

@transport_bp.route('/', methods=['GET'])
def get_apps():
    country = request.args.get('country', '')
    category = request.args.get('category', '')
    q = TransportApp.query
    if country:
        q = q.filter(TransportApp.country.ilike(f'%{country}%'))
    if category:
        q = q.filter(TransportApp.category == category)
    return jsonify({'apps': [a.to_dict() for a in q.all()], 'total': q.count()})

@transport_bp.route('/categories', methods=['GET'])
def get_categories():
    cats = db.session.query(TransportApp.category).distinct().all()
    return jsonify([c[0] for c in cats if c[0]])

@transport_bp.route('/', methods=['POST'])
def create_app():
    data = request.json
    a = TransportApp(**data)
    db.session.add(a)
    db.session.commit()
    return jsonify(a.to_dict()), 201

@transport_bp.route('/<int:id>', methods=['DELETE'])
def delete_app(id):
    a = TransportApp.query.get_or_404(id)
    db.session.delete(a)
    db.session.commit()
    return jsonify({'message': 'Deleted'})

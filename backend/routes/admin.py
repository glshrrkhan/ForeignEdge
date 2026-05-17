from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.database import db, User, University, Scholarship, Accommodation, Restaurant, TransportApp, Application
from sqlalchemy import func

admin_bp = Blueprint('admin', __name__)

def require_admin():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    return user and user.is_admin

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    return jsonify({
        'users': User.query.count(),
        'universities': University.query.count(),
        'scholarships': Scholarship.query.count(),
        'accommodations': Accommodation.query.count(),
        'restaurants': Restaurant.query.count(),
        'apps': TransportApp.query.count(),
        'applications': Application.query.count(),
    })

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

@admin_bp.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Deleted'})

@admin_bp.route('/database/<table>', methods=['GET'])
@jwt_required()
def get_table(table):
    tables = {
        'users': User,
        'universities': University,
        'scholarships': Scholarship,
        'accommodations': Accommodation,
        'restaurants': Restaurant,
        'transport_apps': TransportApp,
    }
    model = tables.get(table)
    if not model:
        return jsonify({'error': 'Table not found'}), 404
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    paginated = model.query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'records': [r.to_dict() for r in paginated.items],
        'total': paginated.total,
        'pages': paginated.pages
    })

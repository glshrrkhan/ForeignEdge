from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.database import db, User, StudentProfile, SavedItem, Application
import json
import os

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    profile = StudentProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify(None), 200
    return jsonify(profile.to_dict())

@profile_bp.route('/', methods=['POST', 'PUT'])
@jwt_required()
def save_profile():
    user_id = int(get_jwt_identity())
    data = request.json
    profile = StudentProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        profile = StudentProfile(user_id=user_id)
        db.session.add(profile)
    for k, v in data.items():
        if hasattr(profile, k) and k not in ['id', 'user_id', 'ai_evaluation', 'evaluation_score']:
            setattr(profile, k, v)
    db.session.commit()
    return jsonify(profile.to_dict())

@profile_bp.route('/evaluate', methods=['POST'])
@jwt_required()
def evaluate_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    profile = StudentProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({'error': 'Profile not found'}), 404

    groq_key = os.environ.get('GROQ_API_KEY', '')
    
    profile_data = profile.to_dict()
    
    if groq_key:
        try:
            from groq import Groq
            client = Groq(api_key=groq_key)
            
            prompt = f"""You are an expert international education counselor. Analyze this student profile and provide comprehensive evaluation and recommendations.

Student Profile:
- Name: {user.full_name}
- Nationality: {user.nationality}
- Current Education: {profile_data.get('current_education', 'N/A')}
- GPA: {profile_data.get('gpa', 'N/A')} / {profile_data.get('gpa_scale', '4.0')}
- Field of Interest: {profile_data.get('field_of_interest', 'N/A')}
- Target Degree: {profile_data.get('target_degree', 'N/A')}
- Target Countries: {profile_data.get('target_countries', 'N/A')}
- Budget Range: {profile_data.get('budget_range', 'N/A')}
- English Test: {profile_data.get('english_test', 'N/A')} - Score: {profile_data.get('english_score', 'N/A')}
- GRE Score: {profile_data.get('gre_score', 'N/A')}
- Work Experience: {profile_data.get('work_experience', 0)} years
- Publications: {profile_data.get('publications', 0)}
- Awards: {profile_data.get('awards', 'None')}

Provide a detailed evaluation including:
1. **Profile Strength Score** (0-100): Overall competitiveness score
2. **Strengths**: What makes this profile strong
3. **Areas for Improvement**: What needs work
4. **University Recommendations**: Top 5 universities that match this profile with reasons
5. **Scholarship Opportunities**: 3-5 scholarships this student should apply for
6. **Preparation Timeline**: Month-by-month action plan
7. **Key Advice**: Most important 3 pieces of advice

Be specific, encouraging, and actionable. Format in clear sections."""

            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=2000
            )
            evaluation = response.choices[0].message.content
            
            # Extract score
            import re
            score_match = re.search(r'(\d{1,3})/100|Score[:\s]+(\d{1,3})', evaluation)
            score = int(score_match.group(1) or score_match.group(2)) if score_match else 72
            score = min(100, max(0, score))
            
        except Exception as e:
            evaluation = generate_mock_evaluation(user.full_name, profile_data)
            score = calculate_mock_score(profile_data)
    else:
        evaluation = generate_mock_evaluation(user.full_name, profile_data)
        score = calculate_mock_score(profile_data)
    
    profile.ai_evaluation = evaluation
    profile.evaluation_score = score
    db.session.commit()
    
    return jsonify({'evaluation': evaluation, 'score': score})

def calculate_mock_score(profile):
    score = 50
    if profile.get('gpa'):
        gpa = float(profile['gpa'])
        scale = float(profile.get('gpa_scale', 4.0))
        normalized = gpa / scale
        score += normalized * 20
    if profile.get('english_score'):
        score += 10
    if profile.get('work_experience', 0):
        score += min(int(profile.get('work_experience', 0)) * 3, 10)
    if profile.get('publications', 0):
        score += min(int(profile.get('publications', 0)) * 5, 10)
    return min(100, int(score))

def generate_mock_evaluation(name, profile):
    gpa = profile.get('gpa', 'N/A')
    field = profile.get('field_of_interest', 'your field')
    countries = profile.get('target_countries', 'your target countries')
    degree = profile.get('target_degree', 'graduate')
    
    return f"""## Profile Evaluation for {name}

### 📊 Profile Strength Score: {calculate_mock_score(profile)}/100

---

### ✅ Strengths
- Strong academic background with GPA of {gpa}
- Clear focus on {field} which has excellent career prospects
- Well-defined target countries: {countries}
- Motivated to pursue {degree} education abroad

### 🎯 Areas for Improvement
- Consider taking GRE/GMAT if not already done — most top programs require it
- Strengthen your Statement of Purpose with specific research interests
- Build more extracurricular activities and leadership experience
- Aim for internships or research experience in {field}

### 🏛️ Recommended Universities
1. **University of Toronto** (Canada) — Strong {field} program, diverse community, reasonable tuition
2. **TU Munich** (Germany) — Near-free tuition, excellent engineering/tech programs, highly ranked
3. **University of Edinburgh** (UK) — Prestigious, welcoming to international students
4. **National University of Singapore** — Top-ranked in Asia, excellent scholarships available
5. **University of Melbourne** (Australia) — World-class research, vibrant student life

### 🎓 Scholarship Opportunities
1. **DAAD Scholarship** — Germany, covers tuition + stipend, perfect for your profile
2. **Erasmus Mundus** — Europe, fully funded, excellent for {field}
3. **Commonwealth Scholarship** — UK, fully funded for eligible nationalities
4. **Korean Government Scholarship (GKS)** — Fully funded, very achievable with your profile
5. **Australia Awards** — Fully funded Australian government scholarship

### 📅 12-Month Action Plan
- **Months 1-2**: Take/retake English proficiency test, prepare GRE if needed
- **Months 3-4**: Research programs, contact professors, draft SOP
- **Months 5-6**: Apply for scholarships with early deadlines
- **Months 7-8**: Submit university applications
- **Months 9-10**: Follow up on applications, prepare financial documents
- **Months 11-12**: Accept offer, arrange accommodation and visa

### 💡 Key Advice
1. **Apply broadly** — aim for 8-12 universities across safety, match, and reach categories
2. **Scholarship deadlines are earlier** — many scholarships close 6-9 months before program start
3. **Connect with alumni** — LinkedIn and university forums are invaluable for authentic insights

*For a personalized Groq AI evaluation, add your GROQ_API_KEY to the backend .env file.*"""

@profile_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved():
    user_id = int(get_jwt_identity())
    saved = SavedItem.query.filter_by(user_id=user_id).all()
    return jsonify([s.to_dict() for s in saved])

@profile_bp.route('/saved', methods=['POST'])
@jwt_required()
def save_item():
    user_id = int(get_jwt_identity())
    data = request.json
    existing = SavedItem.query.filter_by(user_id=user_id, item_type=data['item_type'], item_id=data['item_id']).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({'saved': False})
    item = SavedItem(user_id=user_id, item_type=data['item_type'], item_id=data['item_id'])
    db.session.add(item)
    db.session.commit()
    return jsonify({'saved': True, 'item': item.to_dict()})

@profile_bp.route('/applications', methods=['GET'])
@jwt_required()
def get_applications():
    user_id = int(get_jwt_identity())
    apps = Application.query.filter_by(user_id=user_id).all()
    return jsonify([a.to_dict() for a in apps])

@profile_bp.route('/applications', methods=['POST'])
@jwt_required()
def add_application():
    user_id = int(get_jwt_identity())
    data = request.json
    app = Application(user_id=user_id, **data)
    db.session.add(app)
    db.session.commit()
    return jsonify(app.to_dict()), 201

@profile_bp.route('/applications/<int:app_id>', methods=['DELETE'])
@jwt_required()
def delete_application(app_id):
    user_id = int(get_jwt_identity())
    app = Application.query.filter_by(id=app_id, user_id=user_id).first_or_404()
    db.session.delete(app)
    db.session.commit()
    return jsonify({'deleted': True})

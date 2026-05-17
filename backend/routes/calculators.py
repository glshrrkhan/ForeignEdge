from flask import Blueprint, request, jsonify

calc_bp = Blueprint('calculators', __name__)

@calc_bp.route('/cost-of-living', methods=['POST'])
def cost_of_living():
    data = request.json
    country = data.get('country', 'UK')
    city = data.get('city', 'London')
    lifestyle = data.get('lifestyle', 'moderate')
    
    base_costs = {
        'USA': {'budget': 1800, 'moderate': 2800, 'comfortable': 4200},
        'UK': {'budget': 1500, 'moderate': 2200, 'comfortable': 3500},
        'Germany': {'budget': 1000, 'moderate': 1600, 'comfortable': 2500},
        'Canada': {'budget': 1600, 'moderate': 2400, 'comfortable': 3800},
        'Australia': {'budget': 1700, 'moderate': 2600, 'comfortable': 4000},
        'Netherlands': {'budget': 1200, 'moderate': 1800, 'comfortable': 2800},
        'Japan': {'budget': 900, 'moderate': 1400, 'comfortable': 2200},
        'South Korea': {'budget': 800, 'moderate': 1300, 'comfortable': 2000},
        'Singapore': {'budget': 1500, 'moderate': 2200, 'comfortable': 3500},
        'Switzerland': {'budget': 2000, 'moderate': 3000, 'comfortable': 4500},
    }
    
    cost = base_costs.get(country, base_costs['UK']).get(lifestyle, 2000)
    
    breakdown = {
        'rent': int(cost * 0.45),
        'food': int(cost * 0.20),
        'transport': int(cost * 0.10),
        'utilities': int(cost * 0.08),
        'books_supplies': int(cost * 0.07),
        'entertainment': int(cost * 0.06),
        'miscellaneous': int(cost * 0.04),
    }
    
    return jsonify({
        'country': country,
        'city': city,
        'lifestyle': lifestyle,
        'monthly_total': cost,
        'annual_total': cost * 12,
        'breakdown': breakdown,
        'currency': 'USD'
    })

@calc_bp.route('/gpa-converter', methods=['POST'])
def gpa_converter():
    data = request.json
    gpa = float(data.get('gpa', 0))
    from_scale = data.get('from_scale', '4.0')
    
    conversions = {}
    
    if from_scale == '4.0':
        normalized = gpa / 4.0
    elif from_scale == '5.0':
        normalized = gpa / 5.0
    elif from_scale == '10.0':
        normalized = gpa / 10.0
    elif from_scale == '100':
        normalized = gpa / 100.0
    else:
        normalized = gpa / 4.0
    
    conversions = {
        '4.0_scale': round(normalized * 4.0, 2),
        '5.0_scale': round(normalized * 5.0, 2),
        '10.0_scale': round(normalized * 10.0, 2),
        '100_scale': round(normalized * 100, 1),
        'letter_grade': get_letter_grade(normalized),
        'classification': get_classification(normalized),
        'percentage': round(normalized * 100, 1)
    }
    
    return jsonify(conversions)

def get_letter_grade(normalized):
    if normalized >= 0.93: return 'A+'
    elif normalized >= 0.87: return 'A'
    elif normalized >= 0.83: return 'A-'
    elif normalized >= 0.80: return 'B+'
    elif normalized >= 0.77: return 'B'
    elif normalized >= 0.73: return 'B-'
    elif normalized >= 0.70: return 'C+'
    elif normalized >= 0.67: return 'C'
    else: return 'D/F'

def get_classification(normalized):
    if normalized >= 0.85: return 'First Class / Distinction'
    elif normalized >= 0.70: return 'Upper Second (2:1) / Merit'
    elif normalized >= 0.55: return 'Lower Second (2:2) / Pass'
    else: return 'Third Class / Below Standard'

@calc_bp.route('/scholarship-eligibility', methods=['POST'])
def scholarship_eligibility():
    data = request.json
    gpa_normalized = float(data.get('gpa', 0)) / float(data.get('gpa_scale', 4.0))
    nationality = data.get('nationality', '')
    degree = data.get('target_degree', 'Master')
    english_score = data.get('english_score', 0)
    
    eligible = []
    
    scholarships = [
        {'name': 'Fulbright', 'min_gpa': 0.85, 'degrees': ['Master', 'PhD'], 'description': 'US Government flagship scholarship'},
        {'name': 'Chevening', 'min_gpa': 0.75, 'degrees': ['Master'], 'description': 'UK Government scholarship for future leaders'},
        {'name': 'DAAD', 'min_gpa': 0.75, 'degrees': ['Bachelor', 'Master', 'PhD'], 'description': 'German academic exchange scholarship'},
        {'name': 'Erasmus Mundus', 'min_gpa': 0.75, 'degrees': ['Master', 'PhD'], 'description': 'European Commission joint degree scholarship'},
        {'name': 'Commonwealth Scholarship', 'min_gpa': 0.80, 'degrees': ['Master', 'PhD'], 'description': 'UK Commonwealth funded scholarship'},
        {'name': 'Gates Cambridge', 'min_gpa': 0.90, 'degrees': ['Master', 'PhD'], 'description': 'Highly competitive Gates Foundation scholarship'},
        {'name': 'Korea GKS', 'min_gpa': 0.70, 'degrees': ['Bachelor', 'Master', 'PhD'], 'description': 'Korean Government fully-funded scholarship'},
        {'name': 'MEXT Japan', 'min_gpa': 0.70, 'degrees': ['Bachelor', 'Master', 'PhD'], 'description': 'Japanese Government scholarship'},
        {'name': 'CSC China', 'min_gpa': 0.70, 'degrees': ['Bachelor', 'Master', 'PhD'], 'description': 'Chinese Government scholarship'},
        {'name': 'Swiss Government Excellence', 'min_gpa': 0.80, 'degrees': ['Master', 'PhD'], 'description': 'Swiss Government excellence scholarship'},
    ]
    
    for s in scholarships:
        if gpa_normalized >= s['min_gpa'] and degree in s['degrees']:
            eligible.append({**s, 'match_score': round(gpa_normalized / s['min_gpa'] * 80, 0)})
    
    return jsonify({
        'eligible_scholarships': eligible,
        'total_eligible': len(eligible),
        'profile_strength': round(gpa_normalized * 100, 1)
    })

@calc_bp.route('/visa-requirements', methods=['POST'])
def visa_requirements():
    data = request.json
    nationality = data.get('nationality', 'Pakistani')
    destination = data.get('destination', 'UK')
    
    requirements = {
        'UK': {
            'visa_type': 'Student Visa (Tier 4)',
            'processing_time': '3-8 weeks',
            'fee': '£363',
            'documents': ['Acceptance letter from UKVI-approved institution', 'Proof of English proficiency', 'Financial evidence (£1,015/month for living)', 'Valid passport', 'Tuberculosis test results (for some nationalities)', 'ATAS certificate (for some courses)', 'Biometric residence permit fee'],
            'website': 'https://www.gov.uk/student-visa'
        },
        'USA': {
            'visa_type': 'F-1 Student Visa',
            'processing_time': '2-8 weeks',
            'fee': '$160 SEVIS + $185 Visa',
            'documents': ['Form I-20 from university', 'SEVIS fee payment', 'DS-160 application', 'Financial proof (12 months expenses)', 'Strong ties to home country', 'Academic transcripts', 'English proficiency scores'],
            'website': 'https://travel.state.gov/content/travel/en/us-visas/study/'
        },
        'Germany': {
            'visa_type': 'National Visa (Type D) for Studies',
            'processing_time': '4-12 weeks',
            'fee': '€75',
            'documents': ['University admission letter', 'Blocked account (€10,332/year)', 'Health insurance', 'Academic certificates (translated & notarized)', 'Biometric photos', 'German language proficiency or English program proof'],
            'website': 'https://www.make-it-in-germany.com/en/visa'
        },
        'Canada': {
            'visa_type': 'Study Permit',
            'processing_time': '4-16 weeks',
            'fee': 'CAD $150',
            'documents': ['Letter of Acceptance', 'Proof of financial support (CAD $10,000+)', 'Biometrics', 'Medical exam (some nationalities)', 'Police clearance certificate', 'Statement of purpose'],
            'website': 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html'
        },
        'Australia': {
            'visa_type': 'Student Visa (Subclass 500)',
            'processing_time': '4-6 weeks',
            'fee': 'AUD $710',
            'documents': ['Confirmation of Enrolment (CoE)', 'Overseas Student Health Cover (OSHC)', 'Financial capacity evidence', 'English proficiency test results', 'Health examination', 'Character requirements'],
            'website': 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500'
        }
    }
    
    result = requirements.get(destination, {
        'visa_type': 'Student Visa',
        'processing_time': '4-12 weeks',
        'fee': 'Varies',
        'documents': ['Valid passport', 'University admission letter', 'Financial proof', 'Health insurance', 'Language proficiency'],
        'website': 'Check official embassy website'
    })
    
    return jsonify({
        'nationality': nationality,
        'destination': destination,
        **result
    })

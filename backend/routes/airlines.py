from flask import Blueprint, request, jsonify
from models.database import db, Airline
import random

airlines_bp = Blueprint('airlines', __name__)

@airlines_bp.route('/', methods=['GET'])
def get_airlines():
    q = Airline.query
    student_only = request.args.get('student_discount', '')
    if student_only == 'true':
        q = q.filter(Airline.student_discount == True)
    return jsonify([a.to_dict() for a in q.all()])

@airlines_bp.route('/search', methods=['GET'])
def search_flights():
    origin = request.args.get('origin', 'Lahore')
    destination = request.args.get('destination', 'London')
    date = request.args.get('date', '2025-09-01')
    passengers = request.args.get('passengers', 1, type=int)
    
    airlines = Airline.query.all()
    flights = []
    for i, airline in enumerate(airlines[:8]):
        base_price = random.randint(400, 2500)
        flights.append({
            'id': f'FL{i+100}',
            'airline': airline.to_dict(),
            'origin': origin,
            'destination': destination,
            'departure': f'{date}T{random.randint(6,22):02d}:{random.choice(["00","30"])}:00',
            'arrival': f'{date}T{(random.randint(6,22)+random.randint(6,18))%24:02d}:{random.choice(["00","30"])}:00',
            'duration': f'{random.randint(5,16)}h {random.randint(0,55)}m',
            'stops': random.randint(0, 2),
            'price': base_price * passengers,
            'class': 'Economy',
            'seats_available': random.randint(3, 50),
            'baggage': '23kg included' if airline.iata_code in ['EK', 'QR', 'TK', 'SQ'] else 'Cabin only'
        })
    flights.sort(key=lambda x: x['price'])
    return jsonify({'flights': flights, 'total': len(flights)})

@airlines_bp.route('/<int:id>', methods=['GET'])
def get_airline(id):
    a = Airline.query.get_or_404(id)
    return jsonify(a.to_dict())

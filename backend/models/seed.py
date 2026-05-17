import json, os, random
from models.database import db, University, Program, Scholarship, Accommodation, Restaurant, Airline, TransportApp, User
from flask_bcrypt import generate_password_hash

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'universities_data.json')

def seed_database():
    if User.query.first():
        return  # Already seeded

    print("🌱 Seeding database...")

    # ── Users ──────────────────────────────────────────────
    admin = User(email='admin@foreignedge.com',
                 password_hash=generate_password_hash('admin123').decode('utf-8'),
                 full_name='ForeignEdge Admin', nationality='International', is_admin=True)
    student = User(email='student@demo.com',
                   password_hash=generate_password_hash('student123').decode('utf-8'),
                   full_name='Demo Student', nationality='Pakistani', is_admin=False)
    db.session.add_all([admin, student])
    db.session.flush()

    # ── Universities from fetched data or curated fallback ──
    unis_added = 0
    if os.path.exists(DATA_FILE):
        print(f"  Loading universities from {DATA_FILE}...")
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            unis_data = json.load(f)
        for ud in unis_data:
            try:
                u = University(
                    name=ud.get('name',''),
                    country=ud.get('country',''),
                    country_code=ud.get('country_code',''),
                    city=ud.get('city',''),
                    ranking_qs=ud.get('ranking_qs'),
                    ranking_the=ud.get('ranking_the'),
                    established=ud.get('established'),
                    type=ud.get('type','Public'),
                    website=ud.get('website',''),
                    description=ud.get('description',''),
                    about_long=ud.get('about_long',''),
                    image=ud.get('image',''),
                    logo=ud.get('logo',''),
                    tuition_min=ud.get('tuition_min',0),
                    tuition_max=ud.get('tuition_max',0),
                    tuition_currency=ud.get('tuition_currency','USD'),
                    acceptance_rate=ud.get('acceptance_rate'),
                    student_count=ud.get('student_count'),
                    international_percent=ud.get('international_percent'),
                    faculty_count=ud.get('faculty_count'),
                    ielts_requirement=ud.get('ielts_requirement',6.0),
                    toefl_requirement=ud.get('toefl_requirement',80),
                    min_gpa=ud.get('min_gpa',2.8),
                    gre_required=ud.get('gre_required',False),
                    campus_type=ud.get('campus_type','Urban'),
                    research_output=ud.get('research_output','High'),
                    nobel_laureates=ud.get('nobel_laureates',0),
                    world_class_fields=json.dumps(ud.get('world_class_fields',[])),
                    notable_alumni=json.dumps(ud.get('notable_alumni',[])),
                    tags=','.join(ud.get('tags',[])),
                    latitude=ud.get('latitude'),
                    longitude=ud.get('longitude'),
                    scholarships_available=True,
                    housing_available=True,
                    data_source='openalex',
                    ai_enriched=bool(ud.get('about_long','')),
                )
                db.session.add(u)
                db.session.flush()
                for pd in ud.get('programs', []):
                    p = Program(
                        university_id=u.id,
                        name=pd.get('name',''),
                        degree_level=pd.get('degree_level','Master'),
                        duration=pd.get('duration','2 years'),
                        field=pd.get('field',''),
                        language=pd.get('language','English'),
                        tuition=pd.get('tuition',0),
                        currency=ud.get('tuition_currency','USD'),
                        description=pd.get('description',''),
                        ielts_min=pd.get('ielts_min',6.0),
                        gpa_min=pd.get('gpa_min',3.0),
                        mode=pd.get('mode','On Campus'),
                        scholarship_available=pd.get('scholarship_available',False),
                    )
                    db.session.add(p)
                unis_added += 1
            except Exception as e:
                print(f"  Skip {ud.get('name','?')}: {e}")
                db.session.rollback()
                continue
    else:
        print("  ⚠️  universities_data.json not found — using built-in curated list")
        print("  Run: python fetch_universities.py  to get real data")
        seed_curated_universities()
        unis_added = University.query.count()

    db.session.commit()
    print(f"  ✅ {unis_added} universities added")

    # ── Scholarships ────────────────────────────────────────
    scholarships = [
        dict(name='Fulbright Scholarship', provider='US Department of State', country='Pakistan', host_country='United States', degree_level='Master,PhD', field_of_study='All Fields', amount='Full Funding', coverage='Tuition, living stipend, airfare, health insurance', deadline='May 15', eligibility='Pakistani citizens with 4-year bachelor degree, 2 years work experience, strong English', description='The Fulbright Program is the flagship international educational exchange program sponsored by the U.S. government. It provides funding for Pakistani students to study in the United States.', website='https://www.usefpakistan.org', fully_funded=True, renewable=False, number_of_awards='~200 per year', open_to_nationalities='Pakistani'),
        dict(name='Chevening Scholarship', provider='UK Foreign Commonwealth & Development Office', country='Pakistan', host_country='United Kingdom', degree_level='Master', field_of_study='All Fields', amount='Full Funding', coverage='Tuition, living allowance, travel, visa', deadline='November 2', eligibility='2 years work experience, strong leadership, Pakistani citizen', description='Chevening is the UK government global scholarship programme. It offers full funding for one-year master\'s degrees at any UK university.', website='https://www.chevening.org', fully_funded=True, renewable=False, number_of_awards='~1,500 globally', open_to_nationalities='All nationalities'),
        dict(name='DAAD Scholarship', provider='German Academic Exchange Service', country='All', host_country='Germany', degree_level='Master,PhD,Research', field_of_study='All Fields', amount='€934/month + extras', coverage='Monthly stipend, health insurance, travel allowance, tuition', deadline='October 15', eligibility='Bachelor degree, good grades, language skills (German/English)', description='DAAD offers scholarships for international students to study or conduct research in Germany. Germany has no tuition fees at public universities.', website='https://www.daad.de', fully_funded=True, renewable=True, number_of_awards='100,000+ per year', open_to_nationalities='All nationalities'),
        dict(name='Gates Cambridge Scholarship', provider='Gates Cambridge Trust', country='All', host_country='United Kingdom', degree_level='Master,PhD', field_of_study='All Fields', amount='Full Funding', coverage='Full tuition, maintenance allowance, travel, family allowance', deadline='December 5', eligibility='Outstanding academic record, commitment to improving lives of others', description='Gates Cambridge Scholarships are prestigious awards for outstanding applicants from outside the UK to pursue postgraduate study at Cambridge.', website='https://www.gatescambridge.org', fully_funded=True, renewable=True, number_of_awards='~80 per year', open_to_nationalities='All non-UK nationalities'),
        dict(name='Commonwealth Scholarship', provider='Commonwealth Scholarship Commission', country='Commonwealth', host_country='United Kingdom', degree_level='Master,PhD,Split-site', field_of_study='Development-related', amount='Full Funding', coverage='Airfare, tuition, stipend, thesis grant', deadline='December 16', eligibility='Commonwealth citizen, first-class degree, plan to benefit home country', description='Commonwealth Scholarships are offered by the UK government for students from Commonwealth countries to study at UK universities.', website='https://cscuk.fcdo.gov.uk', fully_funded=True, renewable=False, number_of_awards='~800 per year', open_to_nationalities='Commonwealth countries'),
        dict(name='Australia Awards Scholarship', provider='Australian Government', country='Developing countries', host_country='Australia', degree_level='Bachelor,Master,PhD', field_of_study='Priority Development Areas', amount='Full Funding', coverage='Tuition, living expenses, travel, health cover', deadline='April 30', eligibility='Citizens of eligible countries, 2 years work experience for PG', description='Australia Awards Scholarships offer opportunities for people from Indo-Pacific region and beyond to undertake full-time study at Australian universities.', website='https://www.dfat.gov.au/people-to-people/australia-awards', fully_funded=True, renewable=False, number_of_awards='3,000+ per year', open_to_nationalities='Indo-Pacific and African countries'),
        dict(name='Erasmus+ Scholarship', provider='European Commission', country='All', host_country='Europe', degree_level='Bachelor,Master,PhD', field_of_study='All Fields', amount='€850-1200/month', coverage='Monthly allowance, tuition waiver, travel support', deadline='Varies by university', eligibility='Currently enrolled in higher education, nominated by home institution', description='Erasmus+ is the EU programme for education, training, youth and sport. It supports students to study or intern abroad across European and partner countries.', website='https://erasmus-plus.ec.europa.eu', fully_funded=False, renewable=False, number_of_awards='Millions per year', open_to_nationalities='All nationalities'),
        dict(name='HEC Overseas Scholarship', provider='Higher Education Commission Pakistan', country='Pakistan', host_country='Multiple', degree_level='Master,PhD', field_of_study='STEM, Social Sciences', amount='Full Funding', coverage='Tuition, stipend, airfare, accommodation', deadline='September 30', eligibility='Pakistani citizens, first division in last degree, under 35 years', description='HEC Overseas Scholarships provide opportunities for Pakistani students to pursue higher education at top universities worldwide in priority fields.', website='https://www.hec.gov.pk', fully_funded=True, renewable=True, number_of_awards='500+ per year', open_to_nationalities='Pakistani'),
        dict(name='Swedish Institute Scholarship', provider='Swedish Institute', country='All', host_country='Sweden', degree_level='Master', field_of_study='All Fields', amount='Full Funding', coverage='Monthly grant SEK 11,000, travel, insurance', deadline='February 10', eligibility='Citizen of eligible country, 3 years work experience, leadership', description='The Swedish Institute Scholarships for Global Professionals (SISGP) target future global leaders who want to pursue a Master\'s in Sweden.', website='https://si.se/en/apply/scholarships/', fully_funded=True, renewable=False, number_of_awards='350 per year', open_to_nationalities='Selected countries'),
        dict(name='NUS Research Scholarship', provider='National University of Singapore', country='All', host_country='Singapore', degree_level='PhD,Master by Research', field_of_study='Research fields', amount='SGD 2,000/month', coverage='Monthly stipend, tuition fees, medical insurance', deadline='December 31', eligibility='Good bachelor degree, research interest, strong recommendations', description='NUS Research Scholarship provides financial support for outstanding students to pursue research postgraduate programmes at NUS.', website='https://www.nus.edu.sg/registrar/prospective-students/graduate', fully_funded=True, renewable=True, number_of_awards='Multiple per cohort', open_to_nationalities='All nationalities'),
        dict(name='Aga Khan Foundation Scholarship', provider='Aga Khan Foundation', country='Developing countries', host_country='Multiple', degree_level='Master', field_of_study='All Fields', amount='50% grant + 50% loan', coverage='Tuition, living costs (partial grant, partial loan)', deadline='March 31', eligibility='Citizens of developing countries, demonstrated financial need, community commitment', description='AKF International Scholarship Programme provides opportunities for outstanding students from developing countries who have no other means of financing their studies.', website='https://www.akdn.org/our-agencies/aga-khan-foundation/scholarships', fully_funded=False, renewable=False, number_of_awards='Limited per year', open_to_nationalities='Developing countries'),
        dict(name='KAIST Scholarship', provider='Korea Advanced Institute of Science and Technology', country='All', host_country='South Korea', degree_level='Master,PhD', field_of_study='Science, Technology, Engineering', amount='Full + stipend', coverage='Full tuition, KRW 350,000/month stipend, dormitory', deadline='September 5', eligibility='Bachelor degree in STEM, strong grades, English proficiency', description='KAIST offers scholarships to international students for graduate programs in science, technology, engineering and mathematics fields.', website='https://www.kaist.ac.kr', fully_funded=True, renewable=True, number_of_awards='Multiple', open_to_nationalities='All non-Korean nationalities'),
        dict(name='ETH Zurich Excellence Scholarship', provider='ETH Zurich', country='All', host_country='Switzerland', degree_level='Master', field_of_study='Engineering, Natural Sciences, Architecture', amount='CHF 12,000/year', coverage='Tuition waiver + CHF 12,000 annual stipend', deadline='December 15', eligibility='Top 10% of graduating class, admitted to ETH Master\'s program', description='The Excellence Scholarship & Opportunity Programme (ESOP) supports outstanding students admitted to a Master\'s degree programme at ETH Zurich.', website='https://ethz.ch/en/studies/financial/scholarships/excellencescholarship.html', fully_funded=False, renewable=True, number_of_awards='~100 per year', open_to_nationalities='All nationalities'),
        dict(name='Turkiye Burslari Scholarship', provider='Republic of Turkey', country='All', host_country='Turkey', degree_level='Bachelor,Master,PhD,Turkish Language', field_of_study='All Fields', amount='Full Funding', coverage='Tuition, monthly stipend, accommodation, health insurance, flight', deadline='February 20', eligibility='International students, min 70% grade for UG or 75% for PG', description='Türkiye Scholarships is a competitive government scholarship program run by the Presidency for Turks Abroad and Related Communities for international students.', website='https://www.turkiyeburslari.gov.tr', fully_funded=True, renewable=True, number_of_awards='5,000+ per year', open_to_nationalities='All nationalities'),
        dict(name='Global Korea Scholarship (GKS)', provider='Korean Government / NIIED', country='All', host_country='South Korea', degree_level='Bachelor,Master,PhD', field_of_study='All Fields', amount='Full Funding', coverage='Airfare, tuition, monthly allowance, Korean language training, medical insurance', deadline='March (varies by country)', eligibility='Under 25 (UG) or under 40 (PG), GPA above 2.64/4.0', description='The Global Korea Scholarship (GKS) is funded by the Korean government to promote international exchange and mutual friendship by offering scholarships to international students.', website='https://www.studyinkorea.go.kr', fully_funded=True, renewable=True, number_of_awards='~5,000 per year', open_to_nationalities='Selected countries'),
    ]
    for s in scholarships:
        db.session.add(Scholarship(**s))

    # ── Accommodation ───────────────────────────────────────────────────────
    import os as _os
    accom_file = _os.path.join(_os.path.dirname(__file__), 'accommodation_data.json')
    if _os.path.exists(accom_file):
        with open(accom_file, encoding='utf-8') as _f:
            accom_list = json.load(_f)
        for a in accom_list:
            db.session.add(Accommodation(
                name=a.get('name',''),
                city=a.get('city',''),
                country=a.get('country',''),
                type=a.get('type',''),
                price_min=a.get('price_min',0),
                price_max=a.get('price_max',0),
                currency=a.get('currency','USD'),
                description=a.get('description',''),
                amenities=a.get('amenities',''),
                website=a.get('website',''),
                image=a.get('image',''),
                rating=a.get('rating',4.0),
                distance_to_center=a.get('distance_to_center',''),
            ))

        # ── Restaurants ─────────────────────────────────────────
    restaurants = [
        dict(name='Dishoom', city='London', country='United Kingdom', category='Indian/Pakistani', is_halal=True, price_range='$$', rating=4.7, address='12 Upper St Martin\'s Lane, London WC2H 9FB', description='Award-winning Bombay-style café serving halal Indian and Pakistani cuisine. Famous for their black daal and chicken tikka.', website='https://www.dishoom.com'),
        dict(name='Roti King', city='London', country='United Kingdom', category='Malaysian', is_halal=True, price_range='$', rating=4.6, address='40 Doric Way, London NW1 1LH', description='Legendary Malaysian canteen famous for their roti canai and curry. Halal and very affordable.', website='https://www.rotikingrestaurant.com'),
        dict(name='Masjid-ul-Haram Restaurant', city='Berlin', country='Germany', category='Arabic/Turkish', is_halal=True, price_range='$', rating=4.3, address='Potsdamer Str. 76, 10785 Berlin', description='Popular halal restaurant near Berlin\'s city center serving Middle Eastern and Turkish cuisine.', website=''),
        dict(name='Al Basha Lebanese Restaurant', city='Melbourne', country='Australia', category='Lebanese', is_halal=True, price_range='$$', rating=4.5, address='218 Sydney Rd, Brunswick VIC 3056', description='Authentic Lebanese cuisine with halal-certified meat. Famous for their shawarma and mixed grill platters.', website=''),
        dict(name='Seoul Mates Korean BBQ', city='Sydney', country='Australia', category='Korean', is_halal=False, price_range='$$', rating=4.4, address='Level 1, 368 Sussex St, Sydney NSW 2000', description='Popular Korean BBQ restaurant with a wide selection of meats and authentic Korean side dishes.', website=''),
        dict(name='Zamzam Restaurant', city='Toronto', country='Canada', category='Pakistani/Indian', is_halal=True, price_range='$', rating=4.6, address='2462 Islington Ave, Etobicoke, ON', description='Family-run halal restaurant serving authentic Pakistani and Indian home-style cooking. Very popular with students.', website=''),
        dict(name='Nando\'s', city='Amsterdam', country='Netherlands', category='Portuguese Chicken', is_halal=True, price_range='$$', rating=4.2, address='Kalverstraat 92, 1012 PH Amsterdam', description='International chain known for flame-grilled peri-peri chicken. Halal certified across Europe.', website='https://www.nandos.com'),
        dict(name='Malay Village Restaurant', city='Singapore', country='Singapore', category='Malay', is_halal=True, price_range='$', rating=4.5, address='39 Geylang Serai, Singapore 402039', description='Traditional Malay cuisine in the heart of the Geylang Serai cultural district. Authentic and halal.', website=''),
        dict(name='Islamabad Restaurant', city='Stockholm', country='Sweden', category='Pakistani', is_halal=True, price_range='$', rating=4.3, address='Götgatan 74, 118 30 Stockholm', description='Long-established Pakistani restaurant in Stockholm serving biryani, karahi, and traditional dishes.', website=''),
        dict(name='Pizza Express', city='London', country='United Kingdom', category='Italian', is_halal=False, price_range='$$', rating=4.1, address='Multiple locations across London', description='Classic Italian pizzeria chain popular with students. Affordable and reliable quality.', website='https://www.pizzaexpress.com'),
        dict(name='Bamiyan Afghan Restaurant', city='Paris', country='France', category='Afghan', is_halal=True, price_range='$$', rating=4.4, address='17 Rue de la Villette, 75019 Paris', description='Authentic Afghan restaurant serving traditional dishes like mantu, kabuli pulao, and kebabs.', website=''),
        dict(name='Sprout Cafe', city='Melbourne', country='Australia', category='Vegetarian/Vegan', is_halal=False, price_range='$', rating=4.5, address='350 Collins St, Melbourne VIC 3000', description='Popular student-friendly vegan café with budget meal deals and nutritious options.', website=''),
    ]
    for r in restaurants:
        db.session.add(Restaurant(**r))

    # ── Airlines ────────────────────────────────────────────
    airlines = [
        dict(name='Emirates', code='EK', country='UAE', logo='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/200px-Emirates_logo.svg.png', website='https://www.emirates.com', student_discount=False, baggage_allowance='30kg checked + 7kg cabin', hubs='Dubai International (DXB)', rating=4.7, description='World-class airline based in Dubai, offering flights to 150+ destinations with exceptional service.'),
        dict(name='Qatar Airways', code='QR', country='Qatar', logo='https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/200px-Qatar_Airways_Logo.svg.png', website='https://www.qatarairways.com', student_discount=False, baggage_allowance='30kg checked + 7kg cabin', hubs='Hamad International Airport (DOH)', rating=4.8, description='5-star airline connecting Karachi, Lahore, Islamabad to destinations worldwide through Doha hub.'),
        dict(name='Turkish Airlines', code='TK', country='Turkey', logo='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Turkish_Airlines_logo_2019_compact.svg/200px-Turkish_Airlines_logo_2019_compact.svg.png', website='https://www.turkishairlines.com', student_discount=True, baggage_allowance='30kg checked + 8kg cabin', hubs='Istanbul Airport (IST)', rating=4.5, description='Flies to more countries than any other airline. Student discount program "Youth Fares" available.'),
        dict(name='British Airways', code='BA', country='United Kingdom', logo='https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/British_Airways_Logo.svg/200px-British_Airways_Logo.svg.png', website='https://www.britishairways.com', student_discount=False, baggage_allowance='23kg checked + 12kg cabin', hubs='London Heathrow (LHR)', rating=4.3, description='UK\'s flag carrier with extensive global network and frequent service to Pakistan and South Asia.'),
        dict(name='Lufthansa', code='LH', country='Germany', logo='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lufthansa_Logo_2018.svg/200px-Lufthansa_Logo_2018.svg.png', website='https://www.lufthansa.com', student_discount=True, baggage_allowance='23kg checked + 8kg cabin', hubs='Frankfurt (FRA), Munich (MUC)', rating=4.4, description='Germany\'s flagship airline with excellent connections to European universities. Student fares available.'),
        dict(name='Air Canada', code='AC', country='Canada', logo='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Air_Canada_Logo.svg/200px-Air_Canada_Logo.svg.png', website='https://www.aircanada.com', student_discount=True, baggage_allowance='23kg checked + 10kg cabin', hubs='Toronto Pearson (YYZ), Montreal (YUL)', rating=4.2, description='Canada\'s national carrier with student travel offers through StudentUniverse and STA Travel partnerships.'),
        dict(name='Singapore Airlines', code='SQ', country='Singapore', logo='https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/200px-Singapore_Airlines_Logo_2.svg.png', website='https://www.singaporeair.com', student_discount=False, baggage_allowance='30kg checked + 7kg cabin', hubs='Singapore Changi (SIN)', rating=4.9, description='Consistently rated world\'s best airline. Key hub for students traveling to Singapore, Australia, and beyond.'),
        dict(name='PIA Pakistan International Airlines', code='PK', country='Pakistan', logo='https://upload.wikimedia.org/wikipedia/en/thumb/c/c9/PIA_logo.png/200px-PIA_logo.png', website='https://www.piac.com.pk', student_discount=True, baggage_allowance='30kg checked + 7kg cabin', hubs='Karachi (KHI), Lahore (LHE), Islamabad (ISB)', rating=3.2, description='Pakistan\'s national airline connecting major Pakistani cities to global destinations. Student discounts available.'),
        dict(name='Etihad Airways', code='EY', country='UAE', logo='https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Etihad_Airways_logo.svg/200px-Etihad_Airways_logo.svg.png', website='https://www.etihad.com', student_discount=False, baggage_allowance='30kg checked + 7kg cabin', hubs='Abu Dhabi (AUH)', rating=4.5, description='UAE national airline with excellent connectivity from Pakistan to global study destinations.'),
        dict(name='Malaysia Airlines', code='MH', country='Malaysia', logo='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Malaysia_Airlines_Logo.svg/200px-Malaysia_Airlines_Logo.svg.png', website='https://www.malaysiaairlines.com', student_discount=True, baggage_allowance='25kg checked + 7kg cabin', hubs='Kuala Lumpur (KUL)', rating=4.2, description='Good option for students heading to Malaysia, Australia, and Southeast Asia with student fare deals.'),
        dict(name='KLM Royal Dutch Airlines', code='KL', country='Netherlands', logo='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/KLM_logo.svg/200px-KLM_logo.svg.png', website='https://www.klm.com', student_discount=False, baggage_allowance='23kg checked + 12kg cabin', hubs='Amsterdam Schiphol (AMS)', rating=4.3, description='Dutch national airline with excellent European connections and hub at Amsterdam for onwards travel.'),
        dict(name='AirAsia', code='AK', country='Malaysia', logo='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/AirAsia_2020_logo.svg/200px-AirAsia_2020_logo.svg.png', website='https://www.airasia.com', student_discount=False, baggage_allowance='15kg checked (add-on) + 7kg cabin', hubs='Kuala Lumpur (KUL)', rating=3.8, description='Budget airline popular with students for affordable travel across Southeast Asia.'),
    ]
    for a in airlines:
        db.session.add(Airline(**a))

    # ── Transport Apps ──────────────────────────────────────
    apps = [
        dict(name='Bolt', category='Ride Hailing', countries='UK, Germany, France, Netherlands, Sweden, Finland, Estonia, Poland, Turkey', description='Affordable ride-hailing app available across Europe. Often cheaper than Uber for students.', website='https://bolt.eu', rating=4.3, free=True),
        dict(name='Uber', category='Ride Hailing', countries='Worldwide - 70+ countries', description='The global standard for ride-hailing. Available in most study destinations worldwide.', website='https://www.uber.com', rating=4.4, free=True),
        dict(name='Grab', category='Ride Hailing', countries='Singapore, Malaysia, Thailand, Philippines, Vietnam, Indonesia', description='Southeast Asia\'s super app for transport, food delivery and payments. Essential in Singapore and Malaysia.', website='https://grab.com', rating=4.4, free=True),
        dict(name='Citymapper', category='Public Transport', countries='UK, Germany, France, Spain, Australia, Canada, USA, Singapore', description='Best urban navigation app for students using public transport. Real-time updates and multi-modal routing.', website='https://citymapper.com', rating=4.7, free=True),
        dict(name='Deliveroo', category='Food Delivery', countries='UK, Ireland, France, Belgium, Netherlands, Italy, Singapore, UAE', description='Fast food delivery from restaurants including halal options. Popular with students for late-night meals.', website='https://deliveroo.com', rating=4.2, free=True),
        dict(name='UberEats', category='Food Delivery', countries='Worldwide - 45+ countries', description='Food delivery from thousands of restaurants worldwide. Student discounts occasionally available.', website='https://ubereats.com', rating=4.2, free=True),
        dict(name='Just Eat', category='Food Delivery', countries='UK, Ireland, Australia, Canada, France, Spain', description='One of Europe\'s largest food delivery platforms with wide halal restaurant selection.', website='https://www.just-eat.co.uk', rating=4.0, free=True),
        dict(name='Revolut', category='Banking & Finance', countries='Europe, USA, Australia, Singapore, Japan, 40+ countries', description='Best banking app for students abroad. Fee-free currency exchange, international transfers, budgeting tools.', website='https://www.revolut.com', rating=4.6, free=True),
        dict(name='Wise (TransferWise)', category='Banking & Finance', countries='Worldwide - 80+ countries', description='Low-cost international money transfers. Great for receiving money from family back home.', website='https://wise.com', rating=4.7, free=True),
        dict(name='N26', category='Banking & Finance', countries='Germany, Austria, France, Spain, Italy, Netherlands, and more EU', description='German online bank popular with students in Europe. No account fees, free card, instant notifications.', website='https://n26.com', rating=4.4, free=True),
        dict(name='LinkedIn', category='Jobs & Career', countries='Worldwide', description='Essential professional networking platform for internships and graduate jobs. Build your profile during studies.', website='https://www.linkedin.com', rating=4.5, free=True),
        dict(name='Indeed', category='Jobs & Career', countries='Worldwide - 60+ countries', description='Largest job search engine. Filter for student, part-time, and graduate roles in your study destination.', website='https://www.indeed.com', rating=4.3, free=True),
        dict(name='StudentUniverse', category='Student Travel', countries='Worldwide', description='Exclusive student flight deals and travel discounts. Requires valid student ID verification.', website='https://www.studentuniverse.com', rating=4.3, free=True),
        dict(name='Duolingo', category='Language Learning', countries='Worldwide', description='Best free language learning app for German, French, Dutch, Korean and more. Essential before studying abroad.', website='https://www.duolingo.com', rating=4.7, free=True),
        dict(name='WhatsApp', category='Communication', countries='Worldwide', description='Free messaging and calling app essential for staying in touch with family while studying abroad.', website='https://www.whatsapp.com', rating=4.6, free=True),
    ]
    for a in apps:
        db.session.add(TransportApp(**a))

    db.session.commit()
    print("✅ Database seeded successfully!")


def seed_curated_universities():
    """Large curated dataset of real universities used as fallback when fetch_universities.py hasn't been run"""
    import json
    unis = [
        # USA
        {'name': 'Massachusetts Institute of Technology', 'country': 'United States', 'country_code': 'US', 'city': 'Cambridge, MA', 'ranking_qs': 1, 'established': 1861, 'type': 'Private', 'website': 'https://www.mit.edu', 'description': 'World\'s leading technical university known for engineering, science, and technology.', 'tuition_min': 57000, 'tuition_max': 59000, 'tuition_currency': 'USD', 'student_count': 11520, 'acceptance_rate': 4.0, 'ielts_requirement': 7.0, 'toefl_requirement': 100, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 97, 'world_class_fields': json.dumps(['Engineering', 'Computer Science', 'Physics', 'Economics', 'Biology']), 'tags': 'Technical,Private,Research,Top 10', 'international_percent': 33.0},
        {'name': 'Harvard University', 'country': 'United States', 'country_code': 'US', 'city': 'Cambridge, MA', 'ranking_qs': 4, 'established': 1636, 'type': 'Private', 'website': 'https://www.harvard.edu', 'description': 'America\'s oldest university renowned for law, medicine, business and the liberal arts.', 'tuition_min': 56000, 'tuition_max': 58000, 'tuition_currency': 'USD', 'student_count': 23000, 'acceptance_rate': 3.4, 'ielts_requirement': 7.0, 'toefl_requirement': 100, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 161, 'world_class_fields': json.dumps(['Law', 'Medicine', 'Business', 'Government', 'Economics']), 'tags': 'Ivy League,Private,Research,Top 10', 'international_percent': 25.0},
        {'name': 'Stanford University', 'country': 'United States', 'country_code': 'US', 'city': 'Stanford, CA', 'ranking_qs': 5, 'established': 1885, 'type': 'Private', 'website': 'https://www.stanford.edu', 'description': 'Silicon Valley\'s elite research university, a cradle of entrepreneurship and tech innovation.', 'tuition_min': 56000, 'tuition_max': 58000, 'tuition_currency': 'USD', 'student_count': 17000, 'acceptance_rate': 3.9, 'ielts_requirement': 7.0, 'toefl_requirement': 100, 'campus_type': 'Suburban', 'research_output': 'Very High', 'nobel_laureates': 84, 'world_class_fields': json.dumps(['Computer Science', 'Engineering', 'Business', 'Medicine', 'Law']), 'tags': 'Private,Research,Silicon Valley,Top 10', 'international_percent': 24.0},
        {'name': 'University of California, Berkeley', 'country': 'United States', 'country_code': 'US', 'city': 'Berkeley, CA', 'ranking_qs': 10, 'established': 1868, 'type': 'Public', 'website': 'https://www.berkeley.edu', 'description': 'Top public research university in the US, known for academic excellence and vibrant campus culture.', 'tuition_min': 14000, 'tuition_max': 44000, 'tuition_currency': 'USD', 'student_count': 45000, 'acceptance_rate': 14.0, 'ielts_requirement': 6.5, 'toefl_requirement': 90, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 107, 'world_class_fields': json.dumps(['Computer Science', 'Chemistry', 'Engineering', 'Economics', 'Political Science']), 'tags': 'Public,Research,Top 10,UC System', 'international_percent': 18.0},
        {'name': 'Columbia University', 'country': 'United States', 'country_code': 'US', 'city': 'New York, NY', 'ranking_qs': 12, 'established': 1754, 'type': 'Private', 'website': 'https://www.columbia.edu', 'description': 'Ivy League university in Manhattan, offering unparalleled access to New York\'s global industries.', 'tuition_min': 61000, 'tuition_max': 65000, 'tuition_currency': 'USD', 'student_count': 34000, 'acceptance_rate': 3.9, 'ielts_requirement': 7.0, 'toefl_requirement': 100, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 96, 'world_class_fields': json.dumps(['Journalism', 'Law', 'Medicine', 'Business', 'International Relations']), 'tags': 'Ivy League,Private,New York,Top 15', 'international_percent': 35.0},
        # UK
        {'name': 'University of Oxford', 'country': 'United Kingdom', 'country_code': 'GB', 'city': 'Oxford', 'ranking_qs': 3, 'established': 1096, 'type': 'Public', 'website': 'https://www.ox.ac.uk', 'description': 'World\'s oldest English-speaking university with outstanding tutorial-based education system.', 'tuition_min': 26000, 'tuition_max': 39000, 'tuition_currency': 'GBP', 'student_count': 24000, 'acceptance_rate': 17.0, 'ielts_requirement': 7.0, 'toefl_requirement': 110, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 72, 'world_class_fields': json.dumps(['Philosophy', 'Law', 'Medicine', 'Politics', 'Economics']), 'tags': 'Ancient,Public,Research,Top 5', 'international_percent': 47.0},
        {'name': 'University of Cambridge', 'country': 'United Kingdom', 'country_code': 'GB', 'city': 'Cambridge', 'ranking_qs': 2, 'established': 1209, 'type': 'Public', 'website': 'https://www.cam.ac.uk', 'description': 'Collegiate research university renowned for producing Nobel Laureates and world-changing discoveries.', 'tuition_min': 24000, 'tuition_max': 58000, 'tuition_currency': 'GBP', 'student_count': 23000, 'acceptance_rate': 21.0, 'ielts_requirement': 7.5, 'toefl_requirement': 110, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 121, 'world_class_fields': json.dumps(['Mathematics', 'Natural Sciences', 'Engineering', 'Medicine', 'Economics']), 'tags': 'Ancient,Public,Research,Top 5', 'international_percent': 39.0},
        {'name': 'Imperial College London', 'country': 'United Kingdom', 'country_code': 'GB', 'city': 'London', 'ranking_qs': 8, 'established': 1907, 'type': 'Public', 'website': 'https://www.imperial.ac.uk', 'description': 'World-leading science, engineering, medicine and business university in the heart of London.', 'tuition_min': 30000, 'tuition_max': 42000, 'tuition_currency': 'GBP', 'student_count': 19000, 'acceptance_rate': 14.0, 'ielts_requirement': 6.5, 'toefl_requirement': 92, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 15, 'world_class_fields': json.dumps(['Engineering', 'Medicine', 'Physics', 'Computing', 'Business']), 'tags': 'Technical,Public,London,Top 10', 'international_percent': 59.0},
        {'name': 'University College London (UCL)', 'country': 'United Kingdom', 'country_code': 'GB', 'city': 'London', 'ranking_qs': 9, 'established': 1826, 'type': 'Public', 'website': 'https://www.ucl.ac.uk', 'description': 'London\'s leading multidisciplinary university, known for global outlook and research excellence.', 'tuition_min': 22000, 'tuition_max': 38000, 'tuition_currency': 'GBP', 'student_count': 43000, 'acceptance_rate': 63.0, 'ielts_requirement': 6.5, 'toefl_requirement': 92, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 30, 'world_class_fields': json.dumps(['Architecture', 'Medicine', 'Law', 'Education', 'Economics']), 'tags': 'Public,London,Research,Top 10', 'international_percent': 52.0},
        # Germany
        {'name': 'Technical University of Munich (TUM)', 'country': 'Germany', 'country_code': 'DE', 'city': 'Munich', 'ranking_qs': 37, 'established': 1868, 'type': 'Technical', 'website': 'https://www.tum.de', 'description': 'Germany\'s top technical university, ranked among Europe\'s best for engineering and natural sciences.', 'tuition_min': 0, 'tuition_max': 3000, 'tuition_currency': 'EUR', 'student_count': 50000, 'acceptance_rate': 8.0, 'ielts_requirement': 6.5, 'toefl_requirement': 88, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 18, 'world_class_fields': json.dumps(['Engineering', 'Computer Science', 'Natural Sciences', 'Medicine', 'Architecture']), 'tags': 'Technical,Public,Low Tuition,Germany', 'international_percent': 34.0},
        {'name': 'Ludwig Maximilian University of Munich (LMU)', 'country': 'Germany', 'country_code': 'DE', 'city': 'Munich', 'ranking_qs': 54, 'established': 1472, 'type': 'Public', 'website': 'https://www.lmu.de', 'description': 'Bavaria\'s oldest university and one of Europe\'s most prestigious, known for research excellence.', 'tuition_min': 0, 'tuition_max': 150, 'tuition_currency': 'EUR', 'student_count': 52000, 'acceptance_rate': 15.0, 'ielts_requirement': 6.0, 'toefl_requirement': 83, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 42, 'world_class_fields': json.dumps(['Medicine', 'Law', 'Philosophy', 'Natural Sciences', 'Economics']), 'tags': 'Public,Ancient,Low Tuition,Germany', 'international_percent': 16.0},
        {'name': 'Heidelberg University', 'country': 'Germany', 'country_code': 'DE', 'city': 'Heidelberg', 'ranking_qs': 87, 'established': 1386, 'type': 'Public', 'website': 'https://www.uni-heidelberg.de', 'description': 'Germany\'s oldest university, a center for medicine, natural sciences and humanities research.', 'tuition_min': 0, 'tuition_max': 180, 'tuition_currency': 'EUR', 'student_count': 29000, 'acceptance_rate': 20.0, 'ielts_requirement': 6.0, 'toefl_requirement': 83, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 56, 'world_class_fields': json.dumps(['Medicine', 'Natural Sciences', 'Humanities', 'Law', 'Economics']), 'tags': 'Ancient,Public,Free Tuition,Germany', 'international_percent': 21.0},
        {'name': 'RWTH Aachen University', 'country': 'Germany', 'country_code': 'DE', 'city': 'Aachen', 'ranking_qs': 106, 'established': 1870, 'type': 'Technical', 'website': 'https://www.rwth-aachen.de', 'description': 'Germany\'s largest technical university, world-renowned for engineering education and industry partnerships.', 'tuition_min': 0, 'tuition_max': 300, 'tuition_currency': 'EUR', 'student_count': 48000, 'acceptance_rate': 18.0, 'ielts_requirement': 6.0, 'toefl_requirement': 83, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 8, 'world_class_fields': json.dumps(['Mechanical Engineering', 'Electrical Engineering', 'Computer Science', 'Chemical Engineering', 'Architecture']), 'tags': 'Technical,Public,Free Tuition,Germany', 'international_percent': 25.0},
        # Canada
        {'name': 'University of Toronto', 'country': 'Canada', 'country_code': 'CA', 'city': 'Toronto, ON', 'ranking_qs': 25, 'established': 1827, 'type': 'Public', 'website': 'https://www.utoronto.ca', 'description': 'Canada\'s leading research university with a diverse, global student community in downtown Toronto.', 'tuition_min': 30000, 'tuition_max': 58000, 'tuition_currency': 'CAD', 'student_count': 97000, 'acceptance_rate': 43.0, 'ielts_requirement': 6.5, 'toefl_requirement': 89, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 10, 'world_class_fields': json.dumps(['Computer Science', 'Medicine', 'Engineering', 'Business', 'Law']), 'tags': 'Public,Research,Canada,Top 30', 'international_percent': 24.0},
        {'name': 'McGill University', 'country': 'Canada', 'country_code': 'CA', 'city': 'Montreal, QC', 'ranking_qs': 30, 'established': 1821, 'type': 'Public', 'website': 'https://www.mcgill.ca', 'description': 'Bilingual research university known as the Harvard of Canada, located in vibrant Montreal.', 'tuition_min': 21000, 'tuition_max': 45000, 'tuition_currency': 'CAD', 'student_count': 40000, 'acceptance_rate': 46.0, 'ielts_requirement': 6.5, 'toefl_requirement': 86, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 12, 'world_class_fields': json.dumps(['Medicine', 'Law', 'Music', 'Engineering', 'Management']), 'tags': 'Public,Research,Canada,Bilingual', 'international_percent': 30.0},
        {'name': 'University of British Columbia', 'country': 'Canada', 'country_code': 'CA', 'city': 'Vancouver, BC', 'ranking_qs': 34, 'established': 1908, 'type': 'Public', 'website': 'https://www.ubc.ca', 'description': 'World-class research university on Canada\'s stunning west coast, strong in sustainability and innovation.', 'tuition_min': 29000, 'tuition_max': 50000, 'tuition_currency': 'CAD', 'student_count': 68000, 'acceptance_rate': 46.0, 'ielts_requirement': 6.5, 'toefl_requirement': 90, 'campus_type': 'Suburban', 'research_output': 'Very High', 'nobel_laureates': 8, 'world_class_fields': json.dumps(['Forestry', 'Medicine', 'Engineering', 'Computer Science', 'Business']), 'tags': 'Public,Research,Canada,Vancouver', 'international_percent': 29.0},
        # Australia
        {'name': 'University of Melbourne', 'country': 'Australia', 'country_code': 'AU', 'city': 'Melbourne', 'ranking_qs': 14, 'established': 1853, 'type': 'Public', 'website': 'https://www.unimelb.edu.au', 'description': 'Australia\'s top-ranked university, consistently in the global top 15 across multiple rankings.', 'tuition_min': 33000, 'tuition_max': 48000, 'tuition_currency': 'AUD', 'student_count': 55000, 'acceptance_rate': 70.0, 'ielts_requirement': 6.5, 'toefl_requirement': 79, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 5, 'world_class_fields': json.dumps(['Medicine', 'Law', 'Education', 'Engineering', 'Business']), 'tags': 'Public,Research,Australia,Top 20', 'international_percent': 45.0},
        {'name': 'Australian National University (ANU)', 'country': 'Australia', 'country_code': 'AU', 'city': 'Canberra', 'ranking_qs': 30, 'established': 1946, 'type': 'Public', 'website': 'https://www.anu.edu.au', 'description': 'Australia\'s national university and top research institution, located in the nation\'s capital.', 'tuition_min': 30000, 'tuition_max': 47000, 'tuition_currency': 'AUD', 'student_count': 25000, 'acceptance_rate': 35.0, 'ielts_requirement': 6.5, 'toefl_requirement': 80, 'campus_type': 'Suburban', 'research_output': 'Very High', 'nobel_laureates': 6, 'world_class_fields': json.dumps(['Political Science', 'International Relations', 'Physics', 'Engineering', 'Law']), 'tags': 'Public,Research,Australia,National', 'international_percent': 38.0},
        # Singapore
        {'name': 'National University of Singapore (NUS)', 'country': 'Singapore', 'country_code': 'SG', 'city': 'Singapore', 'ranking_qs': 8, 'established': 1905, 'type': 'Public', 'website': 'https://www.nus.edu.sg', 'description': 'Asia\'s top university, consistently ranked in the global top 10 for its excellence across all disciplines.', 'tuition_min': 17000, 'tuition_max': 30000, 'tuition_currency': 'SGD', 'student_count': 40000, 'acceptance_rate': 5.0, 'ielts_requirement': 6.5, 'toefl_requirement': 85, 'campus_type': 'Suburban', 'research_output': 'Very High', 'nobel_laureates': 2, 'world_class_fields': json.dumps(['Computer Science', 'Engineering', 'Business', 'Medicine', 'Law']), 'tags': 'Public,Research,Asia,Top 10', 'international_percent': 35.0},
        {'name': 'Nanyang Technological University (NTU)', 'country': 'Singapore', 'country_code': 'SG', 'city': 'Singapore', 'ranking_qs': 26, 'established': 1981, 'type': 'Public', 'website': 'https://www.ntu.edu.sg', 'description': 'Young and dynamic global university ranked among Asia\'s best, strong in engineering and business.', 'tuition_min': 17000, 'tuition_max': 30000, 'tuition_currency': 'SGD', 'student_count': 33000, 'acceptance_rate': 10.0, 'ielts_requirement': 6.0, 'toefl_requirement': 85, 'campus_type': 'Suburban', 'research_output': 'Very High', 'nobel_laureates': 1, 'world_class_fields': json.dumps(['Engineering', 'Business', 'Art & Design', 'Computer Science', 'Materials Science']), 'tags': 'Technical,Public,Asia,Singapore', 'international_percent': 33.0},
        # Switzerland
        {'name': 'ETH Zurich', 'country': 'Switzerland', 'country_code': 'CH', 'city': 'Zurich', 'ranking_qs': 7, 'established': 1855, 'type': 'Technical', 'website': 'https://www.ethz.ch', 'description': 'Europe\'s MIT - world leader in science, technology, engineering and mathematics education and research.', 'tuition_min': 730, 'tuition_max': 1460, 'tuition_currency': 'CHF', 'student_count': 23000, 'acceptance_rate': 27.0, 'ielts_requirement': 7.0, 'toefl_requirement': 100, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 22, 'world_class_fields': json.dumps(['Engineering', 'Architecture', 'Computer Science', 'Physics', 'Mathematics']), 'tags': 'Technical,Public,Low Tuition,Switzerland,Top 10', 'international_percent': 40.0},
        # Malaysia
        {'name': 'Universiti Malaya (UM)', 'country': 'Malaysia', 'country_code': 'MY', 'city': 'Kuala Lumpur', 'ranking_qs': 65, 'established': 1905, 'type': 'Public', 'website': 'https://www.um.edu.my', 'description': 'Malaysia\'s oldest and highest-ranked university, known for medicine, engineering and social sciences.', 'tuition_min': 4000, 'tuition_max': 12000, 'tuition_currency': 'MYR', 'student_count': 22000, 'acceptance_rate': 15.0, 'ielts_requirement': 6.0, 'toefl_requirement': 80, 'campus_type': 'Urban', 'research_output': 'High', 'nobel_laureates': 0, 'world_class_fields': json.dumps(['Medicine', 'Engineering', 'Computer Science', 'Business', 'Law']), 'tags': 'Public,Research,Malaysia,Affordable', 'international_percent': 20.0},
        {'name': 'Universiti Putra Malaysia (UPM)', 'country': 'Malaysia', 'country_code': 'MY', 'city': 'Serdang', 'ranking_qs': 129, 'established': 1971, 'type': 'Public', 'website': 'https://www.upm.edu.my', 'description': 'A top Malaysian research university known for agriculture, science and technology programs.', 'tuition_min': 3000, 'tuition_max': 10000, 'tuition_currency': 'MYR', 'student_count': 30000, 'acceptance_rate': 20.0, 'ielts_requirement': 5.5, 'toefl_requirement': 75, 'campus_type': 'Suburban', 'research_output': 'High', 'nobel_laureates': 0, 'world_class_fields': json.dumps(['Agriculture', 'Engineering', 'Medicine', 'Science', 'Economics']), 'tags': 'Public,Research,Malaysia,Affordable', 'international_percent': 15.0},
        # South Korea
        {'name': 'Seoul National University (SNU)', 'country': 'South Korea', 'country_code': 'KR', 'city': 'Seoul', 'ranking_qs': 31, 'established': 1946, 'type': 'Public', 'website': 'https://en.snu.ac.kr', 'description': 'South Korea\'s most prestigious university, known as the Harvard of Korea.', 'tuition_min': 4000, 'tuition_max': 8000, 'tuition_currency': 'USD', 'student_count': 28000, 'acceptance_rate': 15.0, 'ielts_requirement': 6.0, 'toefl_requirement': 83, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 1, 'world_class_fields': json.dumps(['Engineering', 'Business', 'Medicine', 'Law', 'Economics']), 'tags': 'Public,Research,Korea,Top 35', 'international_percent': 8.0},
        {'name': 'KAIST (Korea Advanced Institute of Science & Technology)', 'country': 'South Korea', 'country_code': 'KR', 'city': 'Daejeon', 'ranking_qs': 65, 'established': 1971, 'type': 'Technical', 'website': 'https://www.kaist.ac.kr', 'description': 'South Korea\'s top science and technology university, offering full scholarships to international graduate students.', 'tuition_min': 4500, 'tuition_max': 9000, 'tuition_currency': 'USD', 'student_count': 11000, 'acceptance_rate': 12.0, 'ielts_requirement': 0.0, 'toefl_requirement': 0, 'campus_type': 'Suburban', 'research_output': 'Very High', 'nobel_laureates': 0, 'world_class_fields': json.dumps(['Engineering', 'Computer Science', 'Physics', 'Chemistry', 'Business']), 'tags': 'Technical,Public,Scholarship,Korea', 'international_percent': 10.0},
        # Turkey
        {'name': 'Middle East Technical University (METU)', 'country': 'Turkey', 'country_code': 'TR', 'city': 'Ankara', 'ranking_qs': 397, 'established': 1956, 'type': 'Technical', 'website': 'https://www.metu.edu.tr', 'description': 'Turkey\'s most internationally recognized university, with English-medium engineering and science programs.', 'tuition_min': 400, 'tuition_max': 1200, 'tuition_currency': 'USD', 'student_count': 30000, 'acceptance_rate': 4.0, 'ielts_requirement': 6.0, 'toefl_requirement': 79, 'campus_type': 'Suburban', 'research_output': 'High', 'nobel_laureates': 0, 'world_class_fields': json.dumps(['Engineering', 'Architecture', 'Computer Science', 'Economics', 'Education']), 'tags': 'Technical,Public,English,Turkey,Affordable', 'international_percent': 5.0},
        {'name': 'Bogazici University', 'country': 'Turkey', 'country_code': 'TR', 'city': 'Istanbul', 'ranking_qs': 451, 'established': 1863, 'type': 'Public', 'website': 'https://www.boun.edu.tr', 'description': 'Turkey\'s elite English-medium public university on the European shores of the Bosphorus in Istanbul.', 'tuition_min': 300, 'tuition_max': 800, 'tuition_currency': 'USD', 'student_count': 15000, 'acceptance_rate': 3.0, 'ielts_requirement': 6.0, 'toefl_requirement': 79, 'campus_type': 'Urban', 'research_output': 'High', 'nobel_laureates': 0, 'world_class_fields': json.dumps(['Engineering', 'Social Sciences', 'Natural Sciences', 'Business', 'Education']), 'tags': 'Public,English,Turkey,Affordable,Istanbul', 'international_percent': 4.0},
        # Netherlands
        {'name': 'Delft University of Technology', 'country': 'Netherlands', 'country_code': 'NL', 'city': 'Delft', 'ranking_qs': 47, 'established': 1842, 'type': 'Technical', 'website': 'https://www.tudelft.nl', 'description': 'Europe\'s top technical university, world-renowned for engineering, aerospace and architecture.', 'tuition_min': 6000, 'tuition_max': 20000, 'tuition_currency': 'EUR', 'student_count': 26000, 'acceptance_rate': 45.0, 'ielts_requirement': 6.5, 'toefl_requirement': 90, 'campus_type': 'Suburban', 'research_output': 'Very High', 'nobel_laureates': 4, 'world_class_fields': json.dumps(['Aerospace Engineering', 'Civil Engineering', 'Architecture', 'Computer Science', 'Industrial Design']), 'tags': 'Technical,Public,Netherlands,English', 'international_percent': 32.0},
        {'name': 'University of Amsterdam', 'country': 'Netherlands', 'country_code': 'NL', 'city': 'Amsterdam', 'ranking_qs': 55, 'established': 1632, 'type': 'Public', 'website': 'https://www.uva.nl', 'description': 'The Netherlands\' largest and most internationally oriented university in Europe\'s most vibrant city.', 'tuition_min': 2314, 'tuition_max': 15000, 'tuition_currency': 'EUR', 'student_count': 37000, 'acceptance_rate': 54.0, 'ielts_requirement': 6.5, 'toefl_requirement': 92, 'campus_type': 'Urban', 'research_output': 'Very High', 'nobel_laureates': 12, 'world_class_fields': json.dumps(['Social Sciences', 'Humanities', 'Law', 'Economics', 'Medicine']), 'tags': 'Public,Research,Netherlands,English', 'international_percent': 30.0},
        # Pakistan
        {'name': 'Lahore University of Management Sciences (LUMS)', 'country': 'Pakistan', 'country_code': 'PK', 'city': 'Lahore', 'ranking_qs': 601, 'established': 1984, 'type': 'Private', 'website': 'https://www.lums.edu.pk', 'description': 'Pakistan\'s premier private university known for business, social sciences, law and STEM programs.', 'tuition_min': 600000, 'tuition_max': 1200000, 'tuition_currency': 'PKR', 'student_count': 5000, 'acceptance_rate': 7.0, 'ielts_requirement': 6.5, 'toefl_requirement': 85, 'campus_type': 'Suburban', 'research_output': 'High', 'nobel_laureates': 0, 'world_class_fields': json.dumps(['Business', 'Computer Science', 'Law', 'Social Sciences', 'Engineering']), 'tags': 'Private,Pakistan,Research,Elite', 'international_percent': 2.0},
        {'name': 'NUST (National University of Sciences and Technology)', 'country': 'Pakistan', 'country_code': 'PK', 'city': 'Islamabad', 'ranking_qs': 500, 'established': 1991, 'type': 'Public', 'website': 'https://www.nust.edu.pk', 'description': 'Pakistan\'s top engineering and technology university with strong research and industry partnerships.', 'tuition_min': 200000, 'tuition_max': 600000, 'tuition_currency': 'PKR', 'student_count': 15000, 'acceptance_rate': 5.0, 'ielts_requirement': 6.0, 'toefl_requirement': 79, 'campus_type': 'Suburban', 'research_output': 'High', 'nobel_laureates': 0, 'world_class_fields': json.dumps(['Engineering', 'Computer Science', 'Military Sciences', 'Architecture', 'Natural Sciences']), 'tags': 'Technical,Public,Pakistan,Islamabad', 'international_percent': 1.0},
    ]

    programs_by_type = {
        'engineering': [
            ('Computer Science', 'Bachelor', '4 years'), ('Computer Science', 'Master', '2 years'),
            ('Computer Science', 'PhD', '4 years'), ('Electrical Engineering', 'Bachelor', '4 years'),
            ('Electrical Engineering', 'Master', '2 years'), ('Mechanical Engineering', 'Bachelor', '4 years'),
            ('Mechanical Engineering', 'Master', '2 years'), ('Data Science & AI', 'Master', '2 years'),
            ('Cybersecurity', 'Master', '2 years'), ('Software Engineering', 'Bachelor', '4 years'),
        ],
        'general': [
            ('Business Administration', 'Bachelor', '3 years'), ('MBA', 'MBA', '2 years'),
            ('Economics', 'Bachelor', '3 years'), ('Economics', 'Master', '2 years'),
            ('Law', 'Bachelor', '3 years'), ('Psychology', 'Bachelor', '3 years'),
            ('International Relations', 'Master', '2 years'), ('Public Policy', 'Master', '2 years'),
            ('Finance', 'Master', '1 year'), ('Marketing', 'Master', '1 year'),
        ],
    }

    for u in unis:
        fields_json = u.pop('world_class_fields')
        tags_str = u.pop('tags')
        uni = University(
            world_class_fields=fields_json,
            notable_alumni=json.dumps([]),
            tags=tags_str,
            housing_available=True,
            scholarships_available=True,
            data_source='curated',
            ai_enriched=False,
            **u
        )
        db.session.add(uni)
        db.session.flush()

        prog_type = 'engineering' if u.get('type') == 'Technical' else 'general'
        for pname, plevel, pdur in programs_by_type[prog_type]:
            t_min = u.get('tuition_min', 0)
            p = Program(
                university_id=uni.id,
                name=pname,
                degree_level=plevel,
                duration=pdur,
                field=pname.split(' ')[0],
                language='English',
                tuition=t_min + 2000 if t_min > 0 else 0,
                currency=u.get('tuition_currency', 'USD'),
                description=f'{plevel} program in {pname} at {u["name"]}.',
                ielts_min=u.get('ielts_requirement', 6.0),
                gpa_min=3.0,
                mode='On Campus',
                scholarship_available=True,
            )
            db.session.add(p)
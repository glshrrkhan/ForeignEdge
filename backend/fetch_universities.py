#!/usr/bin/env python3
"""
ForeignEdge University Fetcher v4
Uses Groq AI to generate 1000+ real universities across 13 countries.
Run once: python fetch_universities.py
"""

import requests, json, time, os, sys

try:
    from dotenv import load_dotenv
    load_dotenv()
except: pass

GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')
OUTPUT_FILE  = os.path.join(os.path.dirname(__file__), 'universities_data.json')
GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions'

if not GROQ_API_KEY:
    print("❌ No GROQ_API_KEY found in backend/.env")
    print("   Add: GROQ_API_KEY=your_key_here")
    sys.exit(1)

# Target: how many universities per country
COUNTRIES = [
    ('DE', 'Germany',        'EUR', (0,    3000),  120),
    ('FR', 'France',         'EUR', (200,  15000),  80),
    ('IT', 'Italy',          'EUR', (1000, 12000),  80),
    ('ES', 'Spain',          'EUR', (1000, 14000),  70),
    ('SE', 'Sweden',         'SEK', (0,    18000),  40),
    ('FI', 'Finland',        'EUR', (0,    15000),  30),
    ('AT', 'Austria',        'EUR', (1500, 14000),  30),
    ('AU', 'Australia',      'AUD', (18000,42000),  50),
    ('NZ', 'New Zealand',    'NZD', (18000,35000),  20),
    ('GB', 'United Kingdom', 'GBP', (12000,38000), 130),
    ('US', 'United States',  'USD', (10000,58000), 250),
    ('HU', 'Hungary',        'EUR', (1500, 8000),   30),
    ('NO', 'Norway',         'NOK', (0,    15000),  25),
]
# Total target: ~955 → rounds to 1000+

BATCH = 10   # universities per Groq call (keeps tokens manageable)

def groq_batch(country_name, country_code, currency, tmin, tmax, already_done, batch_num, batch_size):
    """Ask Groq to generate a batch of real universities for a country"""

    done_names = ', '.join(already_done[-30:]) if already_done else 'none yet'

    prompt = f"""Generate {batch_size} REAL universities from {country_name} (batch {batch_num}).
DO NOT repeat these already listed: {done_names}

Return ONLY a valid JSON array, no markdown, no backticks:
[
  {{
    "name": "Full official university name in English",
    "city": "City name",
    "ranking_qs": <integer world ranking or null if unranked>,
    "established": <founding year integer>,
    "type": "<Public|Private|Technical>",
    "website": "https://actual-website.edu",
    "description": "2 sentence factual overview",
    "about_long": "3 paragraphs covering: 1) history and founding, 2) academic strengths and notable research, 3) campus life and international student experience",
    "student_count": <integer>,
    "international_percent": <float percentage>,
    "faculty_count": <integer>,
    "acceptance_rate": <float percentage>,
    "ielts_requirement": <float like 6.5>,
    "toefl_requirement": <integer like 90>,
    "min_gpa": <float like 3.0>,
    "gre_required": <true|false>,
    "campus_type": "<Urban|Suburban|Rural>",
    "research_output": "<Very High|High|Medium|Low>",
    "nobel_laureates": <integer>,
    "world_class_fields": ["field1", "field2", "field3"],
    "notable_alumni": ["Name - Achievement", "Name - Achievement"],
    "application_deadline_fall": "January 15",
    "application_deadline_spring": "September 1",
    "housing_cost_min": <monthly integer in {currency}>,
    "housing_cost_max": <monthly integer in {currency}>,
    "tuition_min": {tmin},
    "tuition_max": {tmax},
    "tuition_currency": "{currency}",
    "tags": ["Public", "Research University"],
    "programs": [
      {{
        "name": "Program name",
        "degree_level": "<Bachelor|Master|PhD|MBA>",
        "duration": "2 years",
        "field": "Field name",
        "language": "<English|German|French|etc>",
        "tuition": <annual tuition integer>,
        "description": "1 sentence program description",
        "ielts_min": 6.5,
        "gpa_min": 3.0,
        "mode": "On Campus",
        "scholarship_available": <true|false>
      }}
    ]
  }}
]

Requirements:
- All universities must be REAL institutions that actually exist in {country_name}
- Include a mix of top-ranked and lesser-known real universities
- Each university must have 6-10 programs across Bachelor/Master/PhD levels
- Programs should reflect what that specific university is actually known for
- For German/Nordic universities: tuition_min should be 0 or very low (state-funded)
- Websites must be real URLs"""

    for attempt in range(4):
        try:
            r = requests.post(GROQ_URL,
                headers={'Authorization': f'Bearer {GROQ_API_KEY}',
                         'Content-Type': 'application/json'},
                json={'model': 'llama-3.3-70b-versatile',
                      'messages': [{'role': 'user', 'content': prompt}],
                      'temperature': 0.4,
                      'max_tokens': 4000},
                timeout=60)

            if r.status_code == 200:
                text = r.json()['choices'][0]['message']['content'].strip()
                # Strip markdown
                if '```' in text:
                    parts = text.split('```')
                    for part in parts:
                        p = part.strip()
                        if p.startswith('json'): p = p[4:].strip()
                        if p.startswith('['): 
                            text = p
                            break
                # Find JSON array
                start = text.find('[')
                end   = text.rfind(']') + 1
                if start >= 0 and end > start:
                    text = text[start:end]
                data = json.loads(text)
                if isinstance(data, list) and len(data) > 0:
                    return data
                print(f" [empty response]", end='', flush=True)

            elif r.status_code == 429:
                wait = 65 * (attempt + 1)
                print(f"\n  [Rate limit] waiting {wait}s...", flush=True)
                time.sleep(wait)
            else:
                print(f" [HTTP {r.status_code}]", end='', flush=True)
                time.sleep(5)

        except json.JSONDecodeError as e:
            print(f" [JSON err on attempt {attempt+1}]", end='', flush=True)
            time.sleep(3)
        except Exception as e:
            print(f" [err: {str(e)[:40]}]", end='', flush=True)
            time.sleep(5)

    return []

def main():
    print('='*60)
    print('  ForeignEdge University Fetcher v4 — Groq Powered')
    print('='*60)
    print(f'\n✅ Groq key found')

    # Load existing (resume support)
    existing = {}
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, encoding='utf-8') as f:
                old = json.load(f)
            existing = {u['name']: u for u in old if u.get('name')}
            print(f'📂 Resuming — {len(existing)} already done, skipping those\n')
        except:
            print('📂 Starting fresh\n')
    else:
        print('📂 Starting fresh\n')

    all_unis = list(existing.values())
    total_target = sum(t for *_, t in COUNTRIES)
    print(f'🎯 Target: ~{total_target} universities across {len(COUNTRIES)} countries\n')

    for country_code, country_name, currency, (tmin, tmax), target in COUNTRIES:
        country_existing = [u['name'] for u in all_unis if u.get('country_code') == country_code]
        remaining = target - len(country_existing)

        if remaining <= 0:
            print(f'✅ {country_name}: already have {len(country_existing)}/{target}, skipping')
            continue

        print(f'\n🌍 {country_name} — need {remaining} more (have {len(country_existing)}/{target})')

        done_this_country = list(country_existing)
        batch_num = len(country_existing) // BATCH + 1
        fetched = 0

        while fetched < remaining:
            this_batch = min(BATCH, remaining - fetched)
            print(f'  Batch {batch_num} ({this_batch} unis)...', end='', flush=True)

            unis = groq_batch(country_name, country_code, currency, tmin, tmax,
                              done_this_country, batch_num, this_batch)

            added = 0
            for u in unis:
                name = u.get('name', '').strip()
                if not name:
                    continue
                # Skip duplicates
                if name in {x['name'] for x in all_unis}:
                    continue
                # Ensure required fields
                u['country']        = country_name
                u['country_code']   = country_code
                u['tuition_min']    = u.get('tuition_min', tmin)
                u['tuition_max']    = u.get('tuition_max', tmax)
                u['tuition_currency'] = currency
                u['data_source']    = 'groq'
                u['image']          = u.get('image', '')
                u['logo']           = u.get('logo', '')
                u['latitude']       = u.get('latitude')
                u['longitude']      = u.get('longitude')

                all_unis.append(u)
                done_this_country.append(name)
                added += 1

            fetched += added
            print(f' got {added} ✓ (total {len(all_unis)})', flush=True)

            # Save after every batch
            with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
                json.dump(all_unis, f, ensure_ascii=False, indent=2)

            batch_num += 1
            time.sleep(3)  # be nice to Groq rate limits

        print(f'  ✅ {country_name} done — {len([u for u in all_unis if u.get("country_code")==country_code])} universities')

    print(f'\n{"="*60}')
    print(f'✅ DONE! {len(all_unis)} universities saved to:')
    print(f'   {OUTPUT_FILE}')
    print(f'\nNow restart:  python app.py')
    print('='*60)

if __name__ == '__main__':
    main()

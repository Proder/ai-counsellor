import requests
import os

API_KEY = os.getenv("COLLEGE_SCORECARD_API_KEY")
BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools.json"

MOCK_DATA = [
    # DREAM - USA
    {"id": 1, "school.name": "Stanford University", "school.city": "Stanford", "school.state": "CA", "latest.cost.tuition.out_of_state": 65000, "latest.admissions.admission_rate.overall": 0.04},
    {"id": 2, "school.name": "Massachusetts Institute of Technology (MIT)", "school.city": "Cambridge", "school.state": "MA", "latest.cost.tuition.out_of_state": 62000, "latest.admissions.admission_rate.overall": 0.04},
    {"id": 3, "school.name": "Harvard University", "school.city": "Cambridge", "school.state": "MA", "latest.cost.tuition.out_of_state": 60000, "latest.admissions.admission_rate.overall": 0.03},
    {"id": 21, "school.name": "Wharton School (UPenn)", "school.city": "Philadelphia", "school.state": "PA", "latest.cost.tuition.out_of_state": 85000, "latest.admissions.admission_rate.overall": 0.08},
    {"id": 22, "school.name": "Columbia University", "school.city": "New York", "school.state": "NY", "latest.cost.tuition.out_of_state": 68000, "latest.admissions.admission_rate.overall": 0.06},
    
    # TARGET/DREAM Business
    {"id": 23, "school.name": "NYU Stern School of Business", "school.city": "New York", "school.state": "NY", "latest.cost.tuition.out_of_state": 63000, "latest.admissions.admission_rate.overall": 0.12},
    {"id": 24, "school.name": "Chicago Booth School of Business", "school.city": "Chicago", "school.state": "IL", "latest.cost.tuition.out_of_state": 78000, "latest.admissions.admission_rate.overall": 0.13},
    {"id": 25, "school.name": "UC Berkeley (Haas)", "school.city": "Berkeley", "school.state": "CA", "latest.cost.tuition.out_of_state": 45000, "latest.admissions.admission_rate.overall": 0.14},
    
    # UK / EUROPE
    {"id": 5, "school.name": "Imperial College London", "school.city": "London", "school.state": "UK", "latest.cost.tuition.out_of_state": 40000, "latest.admissions.admission_rate.overall": 0.15},
    {"id": 26, "school.name": "University of Oxford", "school.city": "Oxford", "school.state": "UK", "latest.cost.tuition.out_of_state": 45000, "latest.admissions.admission_rate.overall": 0.17},
    {"id": 27, "school.name": "University of Cambridge", "school.city": "Cambridge", "school.state": "UK", "latest.cost.tuition.out_of_state": 46000, "latest.admissions.admission_rate.overall": 0.20},
    {"id": 28, "school.name": "INSEAD", "school.city": "Fontainebleau", "school.state": "FR", "latest.cost.tuition.out_of_state": 95000, "latest.admissions.admission_rate.overall": 0.30},
    {"id": 29, "school.name": "ETH Zurich", "school.city": "Zurich", "school.state": "CH", "latest.cost.tuition.out_of_state": 2000, "latest.admissions.admission_rate.overall": 0.25},
    
    # CANADA
    {"id": 4, "school.name": "University of Toronto", "school.city": "Toronto", "school.state": "ON", "latest.cost.tuition.out_of_state": 45000, "latest.admissions.admission_rate.overall": 0.43},
    {"id": 30, "school.name": "McGill University", "school.city": "Montreal", "school.state": "QC", "latest.cost.tuition.out_of_state": 42000, "latest.admissions.admission_rate.overall": 0.46},
    {"id": 31, "school.name": "University of British Columbia (UBC)", "school.city": "Vancouver", "school.state": "BC", "latest.cost.tuition.out_of_state": 40000, "latest.admissions.admission_rate.overall": 0.50},
    
    # SAFE / TARGET USA
    {"id": 32, "school.name": "University of Michigan", "school.city": "Ann Arbor", "school.state": "MI", "latest.cost.tuition.out_of_state": 55000, "latest.admissions.admission_rate.overall": 0.23},
    {"id": 33, "school.name": "UT Austin (McCombs)", "school.city": "Austin", "school.state": "TX", "latest.cost.tuition.out_of_state": 42000, "latest.admissions.admission_rate.overall": 0.32},
    {"id": 34, "school.name": "Georgia Tech", "school.city": "Atlanta", "school.state": "GA", "latest.cost.tuition.out_of_state": 33000, "latest.admissions.admission_rate.overall": 0.21},
    {"id": 35, "school.name": "Purdue University", "school.city": "West Lafayette", "school.state": "IN", "latest.cost.tuition.out_of_state": 28000, "latest.admissions.admission_rate.overall": 0.60},
    {"id": 36, "school.name": "University of Illinois (UIUC)", "school.city": "Urbana", "school.state": "IL", "latest.cost.tuition.out_of_state": 35000, "latest.admissions.admission_rate.overall": 0.59},
]

def search_universities(query: str):
    if API_KEY and query:
        # Scorecard API works best with 'school.search' for general queries
        params = {
            "api_key": API_KEY,
            "school.search": query,
            "fields": "id,school.name,school.city,school.state,latest.cost.tuition.out_of_state,latest.admissions.admission_rate.overall",
            "per_page": 15, # Get more to allow filtering
            "sort": "latest.admissions.admission_rate.overall:asc"
        }
        
        try:
            response = requests.get(BASE_URL, params=params, timeout=10)
            if response.status_code == 200:
                results = response.json().get("results", [])
                if results:
                    # Clean up results (ensure no None values where frontend expects types)
                    for r in results:
                        if r.get("latest.cost.tuition.out_of_state") is None:
                            r["latest.cost.tuition.out_of_state"] = "N/A"
                        if r.get("latest.admissions.admission_rate.overall") is None:
                            r["latest.admissions.admission_rate.overall"] = 0.0
                    return results
            else:
                print(f"University API Error Status: {response.status_code}")
                
        except Exception as e:
            print(f"University API Network Error: {e}")

    # Fallback/Mock Mode
    if not query:
        return MOCK_DATA[:6]
    
    query_lower = query.lower()
    # Search in name and city
    filtered = [u for u in MOCK_DATA if query_lower in u["school.name"].lower() or query_lower in u["school.city"].lower()]
    
    # If we found specific mock matches, return those!
    if filtered:
        return filtered
        
    # ONLY if absolute zero matches found anywhere, return a small diverse set
    return [MOCK_DATA[0], MOCK_DATA[5], MOCK_DATA[13], MOCK_DATA[17]]

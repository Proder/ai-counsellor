import requests
import os

API_KEY = os.getenv("COLLEGE_SCORECARD_API_KEY")
BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools.json"

MOCK_DATA = [
    {"id": 1, "school.name": "Stanford University", "school.city": "Stanford", "school.state": "CA", "latest.cost.tuition.out_of_state": 65000, "latest.admissions.admission_rate.overall": 0.04},
    {"id": 2, "school.name": "Massachusetts Institute of Technology (MIT)", "school.city": "Cambridge", "school.state": "MA", "latest.cost.tuition.out_of_state": 62000, "latest.admissions.admission_rate.overall": 0.04},
    {"id": 3, "school.name": "Harvard University", "school.city": "Cambridge", "school.state": "MA", "latest.cost.tuition.out_of_state": 60000, "latest.admissions.admission_rate.overall": 0.03},
    {"id": 4, "school.name": "University of Toronto", "school.city": "Toronto", "school.state": "ON", "latest.cost.tuition.out_of_state": 45000, "latest.admissions.admission_rate.overall": 0.43},
    {"id": 5, "school.name": "Imperial College London", "school.city": "London", "school.state": "UK", "latest.cost.tuition.out_of_state": 40000, "latest.admissions.admission_rate.overall": 0.15},
]

def search_universities(query: str):
    if API_KEY:
        params = {
            "api_key": API_KEY,
            "school.name": query, # Note: For fuzzy use school.name~query but Scorecard API varies
            "fields": "id,school.name,school.city,school.state,latest.cost.tuition.out_of_state,latest.admissions.admission_rate.overall",
            "per_page": 10
        }
        
        try:
            response = requests.get(BASE_URL, params=params, timeout=5)
            if response.status_code == 200:
                results = response.json().get("results", [])
                if results:
                    return results
        except Exception as e:
            print(f"University API Error: {e}")

    # Fallback to Mock Data if API fails or no key or no results
    if not query:
        return MOCK_DATA
    
    # Simple local search in mock data
    query_lower = query.lower()
    filtered = [u for u in MOCK_DATA if query_lower in u["school.name"].lower()]
    return filtered if filtered else MOCK_DATA[:3]

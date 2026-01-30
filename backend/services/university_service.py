import requests
import os
from .universities_data import MOCK_DATA

API_KEY = os.getenv("COLLEGE_SCORECARD_API_KEY")
BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools.json"

def search_universities(query: str):
    results = []
    
    # 1. Try Live API for USA
    if API_KEY and query:
        params = {
            "api_key": API_KEY,
            "school.search": query,
            "fields": "id,school.name,school.city,school.state,latest.cost.tuition.out_of_state,latest.admissions.admission_rate.overall,school.school_url",
            "per_page": 10,
            "sort": "latest.admissions.admission_rate.overall:asc"
        }
        
        try:
            response = requests.get(BASE_URL, params=params, timeout=5)
            if response.status_code == 200:
                api_results = response.json().get("results", [])
                for r in api_results:
                    # Normalizing keys
                    r["school.country"] = "USA"
                    if r.get("latest.cost.tuition.out_of_state") is None:
                        r["latest.cost.tuition.out_of_state"] = "N/A"
                    if r.get("latest.admissions.admission_rate.overall") is None:
                        r["latest.admissions.admission_rate.overall"] = 0.0
                    
                    # Fix URL if missing http
                    website = r.get("school.school_url")
                    if website and not website.startswith("http"):
                        r["website"] = f"https://{website}"
                    else:
                        r["website"] = website
                        
                    results.append(r)
        except Exception as e:
            print(f"API Error: {e}")

    # 2. Search in Mock/Comprehensive Database (matches query)
    if query:
        query_lower = query.lower()
        mock_matches = [
            u for u in MOCK_DATA 
            if query_lower in u["school.name"].lower() or 
               query_lower in u.get("school.city", "").lower() or
               query_lower in u.get("school.country", "").lower()
        ]
        # Append mock matches that aren't already in results (by name)
        existing_names = {r["school.name"] for r in results}
        for m in mock_matches:
            if m["school.name"] not in existing_names:
                results.append(m)
    
    # 3. If no query, return some generic ones
    if not query:
        return MOCK_DATA[:8]
        
    return results

def get_ai_recommendations(profile: dict):
    """
    Returns universities grouped by Dream, Target, Safe based on a simple heuristic.
    In a real app, this would use the profile's GPA/Test Scores.
    """
    
    # Heuristic based on admission rate (assuming a "good" student profile for now)
    # Dream: < 15%
    # Target: 15% - 40%
    # Safe: > 40%
    
    recommendations = {
        "Dream": [],
        "Target": [],
        "Safe": []
    }
    
    # Mix from our comprehensive data
    for uni in MOCK_DATA:
        rate = uni.get("latest.admissions.admission_rate.overall", 0.5)
        
        if rate < 0.15:
            recommendations["Dream"].append(uni)
        elif 0.15 <= rate <= 0.45:
            recommendations["Target"].append(uni)
        else:
            recommendations["Safe"].append(uni)
            
    # Limit results per category for the UI
    recommendations["Dream"] = recommendations["Dream"][:4]
    recommendations["Target"] = recommendations["Target"][:4]
    recommendations["Safe"] = recommendations["Safe"][:4]
    
    return recommendations


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from google import genai

# Configure API key (Vercel provides env vars directly)

# Pydantic models
class RecommendationRequest(BaseModel):
    query: str

class LocationInsight(BaseModel):
    city: str
    area: str
    score: float
    details: str
    estimated_monthly_revenue: Optional[str] = None
    estimated_startup_cost: Optional[str] = None
    target_customers: Optional[str] = None

class CityRecommendation(BaseModel):
    city: str
    country: str
    score: float
    latitude: float
    longitude: float
    summary: str
    areas: List[LocationInsight]

class RecommendationResponse(BaseModel):
    recommendations: List[CityRecommendation]

class MapClickRequest(BaseModel):
    latitude: float
    longitude: float
    business_type: str = "general business"

# AI functions
def get_recommendations_from_ai(query: str) -> List[dict]:
    # Configure API key inside function for serverless
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise Exception("GOOGLE_API_KEY environment variable not set")
    
    client = genai.Client(api_key=api_key)
    model_id = "gemini-2.0-flash-exp"
    prompt = f"""You are a business location consultant. Analyze this query: "{query}"
    
    Provide 3-8 cities worldwide that are best for this business opportunity.
    For EACH city, you MUST provide 4-6 specific neighborhoods/areas.
    
    Example areas for major cities:
    - Islamabad: F-6, F-7, F-8, Blue Area, Saddar, Bahria Town, DHA
    - Dubai: Downtown Dubai, Business Bay, Jumeirah, Dubai Marina, DIFC
    - London: Shoreditch, Camden, Soho, Notting Hill, Canary Wharf
    
    For each area provide: demographics, foot traffic, competition level, average rent.
    Include estimated_monthly_revenue and estimated_startup_cost for each area.
    
    Return ONLY valid JSON array with this exact structure:
    [{{
        "city": "City Name",
        "country": "Country",
        "score": 0.95,
        "latitude": 00.00,
        "longitude": 00.00,
        "summary": "Why this city",
        "areas": [
            {{
                "city": "City Name",
                "area": "Specific Neighborhood Name",
                "score": 0.92,
                "details": "Detailed analysis",
                "estimated_monthly_revenue": "$5,000 - $8,000",
                "estimated_startup_cost": "$20,000 - $30,000",
                "target_customers": "Young professionals"
            }}
        ]
    }}]"""
    
    response = client.models.generate_content(model=model_id, contents=prompt)
    import json
    json_str = response.text.strip()
    if json_str.startswith('```json'):
        json_str = json_str[7:]
    if json_str.startswith('```'):
        json_str = json_str[3:]
    if json_str.endswith('```'):
        json_str = json_str[:-3]
    return json.loads(json_str.strip())

def get_location_insights(lat: float, lng: float, business_type: str) -> dict:
    # Configure API key inside function for serverless
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise Exception("GOOGLE_API_KEY environment variable not set")
    
    client = genai.Client(api_key=api_key)
    model_id = "gemini-2.0-flash-exp"
    prompt = f"""Analyze location at {lat}, {lng} for {business_type}.
    
    Provide hyper-local insights within 200-500m radius:
    - Exact neighborhood/area name
    - Street-level demographics
    - Nearby landmarks with distances
    - Parking and transport at this exact spot
    - Commercial rent for this specific area
    - Competitor count within walking distance
    
    Include estimated_monthly_revenue, estimated_startup_cost, target_customers.
    
    Return ONLY valid JSON:
    {{
        "city": "City",
        "area": "Micro-neighborhood (e.g., F-7 Markaz)",
        "score": 0.85,
        "details": "Block-by-block analysis",
        "estimated_monthly_revenue": "$X - $Y",
        "estimated_startup_cost": "$X - $Y",
        "target_customers": "Demographics"
    }}"""
    
    response = client.models.generate_content(model=model_id, contents=prompt)
    import json
    json_str = response.text.strip()
    if json_str.startswith('```json'):
        json_str = json_str[7:]
    if json_str.startswith('```'):
        json_str = json_str[3:]
    if json_str.endswith('```'):
        json_str = json_str[:-3]
    return json.loads(json_str.strip())

app = FastAPI(title="Geo Market Match API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Geo Market Match API is running"}

@app.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest):
    try:
        results = get_recommendations_from_ai(request.query)
        return {"recommendations": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/map-insight")
def get_map_insight(request: MapClickRequest):
    try:
        insight = get_location_insights(
            request.latitude, 
            request.longitude, 
            request.business_type
        )
        return insight
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Vercel serverless handler
from mangum import Mangum
handler = Mangum(app)

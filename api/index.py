from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import requests
from mangum import Mangum

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

# AI functions using REST API
def call_gemini_api(prompt: str) -> str:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise Exception("GOOGLE_API_KEY not set")
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    
    response = requests.post(url, json=data, timeout=30)
    response.raise_for_status()
    return response.json()["candidates"][0]["content"]["parts"][0]["text"]

def get_recommendations_from_ai(query: str) -> List[dict]:
    prompt = f"""Analyze: "{query}"

Provide 3-5 cities for this business. For each city, include 3-4 neighborhoods.

Return ONLY valid JSON:
[{{
    "city": "City",
    "country": "Country",
    "score": 0.9,
    "latitude": 0.0,
    "longitude": 0.0,
    "summary": "Why this city",
    "areas": [{{
        "city": "City",
        "area": "Neighborhood",
        "score": 0.85,
        "details": "Analysis",
        "estimated_monthly_revenue": "$5K-$10K",
        "estimated_startup_cost": "$20K-$40K",
        "target_customers": "Demographics"
    }}]
}}]"""
    
    response_text = call_gemini_api(prompt)
    json_str = response_text.strip()
    if json_str.startswith('```json'):
        json_str = json_str[7:]
    if json_str.startswith('```'):
        json_str = json_str[3:]
    if json_str.endswith('```'):
        json_str = json_str[:-3]
    return json.loads(json_str.strip())

def get_location_insights(lat: float, lng: float, business_type: str) -> dict:
    prompt = f"""Analyze location: {lat}, {lng} for {business_type}.

Return ONLY valid JSON:
{{
    "city": "City",
    "area": "Neighborhood",
    "score": 0.8,
    "details": "Analysis",
    "estimated_monthly_revenue": "$X-$Y",
    "estimated_startup_cost": "$X-$Y",
    "target_customers": "Demographics"
}}"""
    
    response_text = call_gemini_api(prompt)
    json_str = response_text.strip()
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
    return {
        "message": "Geo Market Match API",
        "status": "running",
        "api_key_set": bool(os.getenv("GOOGLE_API_KEY"))
    }

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

# Vercel handler
handler = Mangum(app, lifespan="off")

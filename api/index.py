from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from schemas import RecommendationRequest, RecommendationResponse, MapClickRequest
from ai_client import get_recommendations_from_ai, get_location_insights

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

@app.get("/api")
def api_root():
    return {"message": "Geo Market Match API is running"}

@app.post("/api/recommend", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest):
    try:
        results = get_recommendations_from_ai(request.query)
        return {"recommendations": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/map-insight")
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

from pydantic import BaseModel
from typing import List, Optional

class RecommendationRequest(BaseModel):
    query: str  # Natural language query from user

class MapClickRequest(BaseModel):
    latitude: float
    longitude: float
    business_type: str

class LocationInsight(BaseModel):
    location_name: str
    insights: str
    opportunities: List[str]
    challenges: List[str]
    recommendation_score: float
    estimated_monthly_revenue: Optional[str] = None
    estimated_startup_cost: Optional[str] = None
    target_customers: Optional[str] = None

class AreaInsight(BaseModel):
    area_name: str
    latitude: float
    longitude: float
    score: float
    characteristics: str

class CityRecommendation(BaseModel):
    city: str
    country: str
    latitude: float
    longitude: float
    score: float
    reason: str
    areas: Optional[List[AreaInsight]] = []

class RecommendationResponse(BaseModel):
    recommendations: List[CityRecommendation]

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import RecommendationRequest, RecommendationResponse, MapClickRequest
from ai_client import get_recommendations_from_ai, get_location_insights

app = FastAPI(title="Geo Market Match API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo purposes, allow all
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

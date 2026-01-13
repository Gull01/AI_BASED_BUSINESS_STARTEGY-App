import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from schemas import CityRecommendation, LocationInsight

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

def get_location_insights(latitude: float, longitude: float, business_type: str):
    """Get AI insights for a clicked location on the map"""
    if not API_KEY:
        print("WARNING: No API Key found. Cannot analyze custom locations without API key.")
        return LocationInsight(
            location_name="Selected Location",
            insights=f"This area could be suitable for a {business_type} business based on general market conditions.",
            opportunities=["High foot traffic potential", "Growing market", "Good infrastructure"],
            challenges=["Competition analysis needed", "Local regulations to consider"],
            recommendation_score=0.75
        )

    prompt = f"""
    You are a hyper-local market research expert specializing in neighborhood-level business analysis with street-by-street knowledge of markets worldwide.
    
    EXACT COORDINATES: Latitude {latitude}, Longitude {longitude}
    Business Type: "{business_type}"
    
    CRITICAL INSTRUCTIONS:
    1. Use the EXACT coordinates to identify the PRECISE local area (specific neighborhood, district, or street)
    2. DO NOT provide generic city-wide analysis - focus on THIS SPECIFIC LOCATION within a 500m radius
    3. Identify the micro-neighborhood, local district, or area name (e.g., "F-7 Markaz", "Blue Area", "Bahria Town Phase 4")
    4. Analyze what makes THIS EXACT SPOT unique within the broader city
    
    HYPER-LOCAL ANALYSIS REQUIRED:
    - Specific street/block characteristics (residential vs commercial density)
    - Immediate surrounding businesses within 200-500m radius
    - Foot traffic patterns for THIS EXACT BLOCK (morning, afternoon, evening, weekend)
    - Nearby landmarks, metro stations, shopping centers, offices within walking distance
    - Local demographics of people who LIVE OR WORK in this immediate area
    - Parking availability and public transport access at THIS SPOT
    - Commercial rent prices for THIS SPECIFIC NEIGHBORHOOD ($/sqft/month)
    - Direct competitors at THIS LOCATION (count and names if known)
    - Visibility and accessibility from main roads
    - Local customer spending habits in THIS AREA
    - Safety, cleanliness, and ambiance of THIS IMMEDIATE VICINITY
    - Nearby residential complexes, offices, or institutions that drive foot traffic HERE
    
    EXAMPLES OF HYPER-LOCAL INSIGHTS:
    - "This location in F-7 Markaz is in the heart of the commercial zone, 200m from the main intersection"
    - "Blue Area business district - this spot is near commercial towers with 5,000+ office workers within 300m"
    - "Bahria Town Phase 4 - residential area with family-oriented demographics, evening foot traffic from nearby parks"
    
    Return ONLY valid JSON. No markdown, no code blocks.
    
    JSON Format:
    {{
        "location_name": "Exact Micro-Location (Specific Neighborhood/District, City) - e.g., 'F-7 Markaz, Islamabad' or 'Blue Area Business District, Islamabad'",
        "insights": "5-6 sentences with HYPER-LOCAL, SPECIFIC insights about THIS EXACT SPOT. Mention surrounding streets, nearby landmarks, what's within 200-500m, local foot traffic at THIS location, why THIS EXACT SPOT works or doesn't work. Be as specific as possible about THIS PRECISE LOCATION.",
        "opportunities": ["Hyper-local opportunity 1 with specific distance/data (e.g., '300m from metro station with 10k daily commuters')", "Opportunity 2 specific to THIS block", "Opportunity 3 with local context", "Opportunity 4 with nearby landmark reference"],
        "challenges": ["Hyper-local challenge 1 for THIS spot (e.g., 'Limited parking on this street during business hours')", "Challenge 2 specific to immediate area", "Challenge 3 with local context"],
        "recommendation_score": float_0_to_1,
        "estimated_monthly_revenue": "$X,000-$Y,000 based on THIS LOCATION'S foot traffic and local spending power",
        "estimated_startup_cost": "$X,000-$Y,000 including rent for THIS SPECIFIC AREA",
        "target_customers": "Very specific profile: age, income, profession, lifestyle of people who FREQUENT THIS EXACT LOCATION (not the entire city)"
    }}
    
    CRITICAL: Analyze the EXACT COORDINATES at neighborhood/street level, NOT the entire city. Be hyper-specific about THIS LOCATION.
    """
    
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    try:
        response = model.generate_content(prompt)
        text_response = response.text
        
        # Clean up
        text_response = text_response.replace("```json", "").replace("```", "").strip()
        
        data = json.loads(text_response)
        return LocationInsight(**data)
    except Exception as e:
        print(f"Location insight error: {e}")
        print("Check your API key and ensure the coordinates are valid.")
        return LocationInsight(
            location_name="Selected Location",
            insights=f"Unable to analyze this specific location for {business_type}.",
            opportunities=["Market research recommended"],
            challenges=["Limited data available"],
            recommendation_score=0.5
        )

def get_fallback_data(country=None):
    from schemas import AreaInsight
    
    all_data = [
        CityRecommendation(
            city="London",
            country="United Kingdom",
            latitude=51.5074,
            longitude=-0.1278,
            score=0.95,
            reason="High income, dense urban population, strong tourism, and established market.",
            areas=[
                AreaInsight(area_name="Shoreditch", latitude=51.5255, longitude=-0.0754, score=0.92, characteristics="Trendy, young professionals, high foot traffic"),
                AreaInsight(area_name="Covent Garden", latitude=51.5117, longitude=-0.1234, score=0.88, characteristics="Tourist hotspot, premium retail area")
            ]
        ),
        CityRecommendation(
            city="New York",
            country="USA",
            latitude=40.7128,
            longitude=-74.0060,
            score=0.92,
            reason="Global financial hub with immense diverse consumer base.",
            areas=[
                AreaInsight(area_name="Manhattan", latitude=40.7831, longitude=-73.9712, score=0.95, characteristics="High density, affluent, business district"),
                AreaInsight(area_name="Brooklyn", latitude=40.6782, longitude=-73.9442, score=0.87, characteristics="Hip, creative class, growing market")
            ]
        ),
        CityRecommendation(
            city="Tokyo",
            country="Japan",
            latitude=35.6762,
            longitude=139.6503,
            score=0.89,
            reason="Extremely high density and efficient public transit infrastructure.",
            areas=[
                AreaInsight(area_name="Shibuya", latitude=35.6595, longitude=139.7004, score=0.93, characteristics="Young demographic, tech-savvy, high spending"),
                AreaInsight(area_name="Shinjuku", latitude=35.6896, longitude=139.7006, score=0.90, characteristics="Business hub, massive foot traffic")
            ]
        ),
        CityRecommendation(
            city="Singapore",
            country="Singapore",
            latitude=1.3521,
            longitude=103.8198,
            score=0.85,
            reason="Business-friendly environment and gateway to Asian markets.",
            areas=[]
        ),
        CityRecommendation(
            city="Berlin",
            country="Germany",
            latitude=52.5200,
            longitude=13.4050,
            score=0.82,
            reason="Growing startup ecosystem and relatively affordable central European hub.",
            areas=[]
        )
    ]
    
    if country and country != "Global":
        return [city for city in all_data if city.country.lower() == country.lower()]
    return all_data

def get_recommendations_from_ai(user_query: str):
    if not API_KEY:
        print("WARNING: No API Key found. Please set GOOGLE_API_KEY in .env file.")
        print("Returning sample data only. The AI cannot process your custom query without an API key.")
        return get_fallback_data()

    prompt = f"""
    You are an expert business consultant and market analyst with deep knowledge of global markets, local economies, and business opportunities.
    
    User Query: "{user_query}"
    
    CRITICAL INSTRUCTIONS:
    1. Carefully analyze what SPECIFIC location the user is asking about (city, country, region)
    2. Identify what type of business or industry they're interested in
    3. If they mention a specific city like "Islamabad", "Dubai", "Toronto", etc., focus ONLY on that location
    4. Provide REAL, SPECIFIC, and ACTIONABLE insights about that exact location
    5. MANDATORY: For EVERY city you recommend, you MUST provide at least 4-6 specific neighborhoods/areas with detailed characteristics
    
    For the location(s) you recommend, research and provide:
    - Current economic conditions and market trends
    - Demographics and target customer profiles (age, income, lifestyle)
    - Competition landscape and market saturation
    - Local regulations and business environment
    - Infrastructure and accessibility (roads, public transport, parking)
    - Cultural factors affecting the business
    - Real estate costs and operational expenses (rent per sq ft, utilities)
    - MANDATORY: 4-6 specific, well-known neighborhoods/areas within EACH city
    
    NEIGHBORHOOD REQUIREMENTS:
    - Each city MUST have 4-6 neighborhoods in the "areas" array
    - Use REAL, well-known neighborhood names (e.g., for Islamabad: F-6, F-7, Blue Area, Saddar, Bahria Town, DHA)
    - Each neighborhood must have precise latitude/longitude coordinates
    - Provide detailed characteristics: foot traffic, demographics, rent costs, competition, target customers
    - Score each neighborhood based on business viability (0.0-1.0)
    
    Return 3-8 cities that EXACTLY match the user's requirements.
    If user asks about ONE specific city, return ONLY that city with comprehensive neighborhood analysis.
    
    IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no explanations.
    
    JSON Format:
    [
      {{
        "city": "Exact City Name",
        "country": "Country Name",
        "latitude": precise_latitude_float,
        "longitude": precise_longitude_float,
        "score": float_0_to_1,
        "reason": "3-4 sentences with SPECIFIC market data, demographics, and concrete opportunities for this exact business type in this exact city. Mention key districts and market conditions.",
        "areas": [
          {{
            "area_name": "Specific Neighborhood Name (e.g., F-7 Markaz, Blue Area, Bahria Town)",
            "latitude": precise_neighborhood_latitude,
            "longitude": precise_neighborhood_longitude,
            "score": float_0_to_1,
            "characteristics": "Detailed 2-3 sentence description: exact demographics (age, income level), daily foot traffic estimate, existing competition count, average commercial rent ($/sqft), primary target customers, accessibility (parking/public transport), why this specific area is ideal or challenging for this business type"
          }},
          {{"MUST have 4-6 neighborhoods per city"}}
        ]
      }}
    ]
    
    CRITICAL: If user asks about "Islamabad" specifically, you MUST return Islamabad with areas like: F-6, F-7, F-8, Blue Area, Saddar, Bahria Town, DHA, etc.
    If user asks about "Dubai", include: Dubai Marina, Downtown Dubai, Jumeirah, Business Bay, etc.
    If user asks about "Toronto", include: Downtown, Yorkville, Distillery District, King West, etc.
    """

    model = genai.GenerativeModel('gemini-2.5-flash')

    try:
        response = model.generate_content(prompt)
        text_response = response.text
        
        # Clean up potential markdown formatting
        text_response = text_response.replace("```json", "").replace("```", "").strip()
        
        data = json.loads(text_response)
        
        recommendations = []
        for item in data:
            # Handle areas if present
            if 'areas' not in item or item['areas'] is None:
                item['areas'] = []
            recommendations.append(CityRecommendation(**item))
            
        return recommendations
    except Exception as e:
        print(f"AI Error: {e}")
        print(f"Response was: {text_response if 'text_response' in locals() else 'No response'}")
        print("Returning sample data instead. Check your API key and internet connection.")
        return get_fallback_data()

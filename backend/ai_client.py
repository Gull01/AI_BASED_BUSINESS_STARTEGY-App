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
    You are a hyper-local market research expert with street-level knowledge of every major city worldwide.
    
    EXACT COORDINATES: {latitude}, {longitude}
    Business Type: {business_type}
    
    STEP 1: IDENTIFY THE EXACT LOCATION
    - Use the GPS coordinates to determine: Country, City, District/Neighborhood, Street/Block
    - Be SPECIFIC: Don't say "Islamabad" - say "F-7 Markaz, Islamabad" or "Blue Area, Islamabad"
    - Don't say "Dubai" - say "Dubai Marina, Dubai" or "Downtown Dubai, Dubai"
    
    STEP 2: ANALYZE WITHIN 300-500 METER RADIUS
    Research and provide REAL information about:
    - Exact neighborhood name and what it's known for
    - Type of area: residential, commercial, mixed-use, office district, tourist zone
    - Nearby landmarks within 500m: malls, metro stations, parks, mosques, schools
    - Existing businesses within 300m (count competitors, complementary businesses)
    - Foot traffic patterns: peak hours, weekday vs weekend, seasonal variations
    - Demographics: who lives/works/visits THIS specific area (age, income, occupation)
    - Parking: street parking, paid lots, accessibility
    - Public transport: nearest stations, bus stops (with distances)
    - Commercial rent range for THIS neighborhood ($/sqft/month)
    - Visibility: main road, side street, corner location advantages
    
    STEP 3: BUSINESS VIABILITY FOR THIS SPOT
    - Why THIS EXACT location works or doesn't work for {business_type}
    - Direct competitors within 500m (estimate count and impact)
    - Target customers who PASS BY THIS SPOT daily
    - Revenue potential based on THIS location's foot traffic
    - Startup costs specific to THIS area's rent and setup requirements
    
    SCORING GUIDELINES:
    - 0.85-0.95: Prime location, high foot traffic, low competition, excellent visibility
    - 0.70-0.84: Good location, moderate traffic, some competition, decent accessibility  
    - 0.50-0.69: Average location, needs marketing, higher competition or accessibility issues
    - Below 0.50: Poor location, very high competition or low traffic
    
    Return ONLY valid JSON (no markdown, no code blocks):
    
    {{
        "location_name": "Specific Neighborhood/District, City (e.g., 'F-7 Markaz, Islamabad' or 'Dubai Marina, Dubai')",
        "insights": "5-6 sentences describing THIS EXACT SPOT: (1) What's at this exact location now, (2) Surrounding businesses within 300m, (3) Who walks by here daily, (4) Peak traffic times, (5) Why it works/doesn't work for {business_type}, (6) Unique advantages or challenges of THIS SPOT.",
        "opportunities": [
            "Specific opportunity with data: 'Adjacent to XYZ Mall with 15,000 daily visitors'",
            "Measurable advantage: 'Within 200m of Metro Station serving 8,000 commuters/day'",
            "Target market insight: '5,000+ office workers within 300m radius'",
            "Growth factor: 'New residential complex opening 2026 will add 2,000 families'"
        ],
        "challenges": [
            "Specific challenge: 'High rent at $45-55/sqft due to prime location'",
            "Competition data: '12 similar businesses within 500m radius'",
            "Accessibility issue: 'Limited parking, mostly street parking after 6pm'"
        ],
        "recommendation_score": 0.50_to_0.95,
        "estimated_monthly_revenue": "$X,000-$Y,000 (based on foot traffic of N customers/day at $Z average spend)",
        "estimated_startup_cost": "$X,000-$Y,000 (rent for THIS area: $X/sqft × N sqft, plus equipment/inventory/permits)",
        "target_customers": "Specific profile: Age range (e.g., 25-40), Income level ($40-70k), Occupation (office workers, residents, tourists), Why they're in THIS area (work nearby, live in adjacent apartments, visit mall/landmark)"
    }}
    
    CRITICAL: Analyze THIS EXACT GPS LOCATION, not the entire city. Be hyper-specific about THIS spot.
    """
    
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    try:
        response = model.generate_content(prompt)
        text_response = response.text
        
        # Clean up
        text_response = text_response.replace("```json", "").replace("```", "").strip()
        
        data = json.loads(text_response)
        return LocationInsight(**data)
    except json.JSONDecodeError as e:
        print(f"Location insight JSON error: {e}")
        print(f"Response: {text_response[:500] if 'text_response' in locals() else 'No response'}")
        raise Exception(f"Failed to analyze location at ({latitude}, {longitude})")
    except Exception as e:
        print(f"Location insight error: {e}")
        raise Exception(f"Unable to analyze location: {str(e)}")

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
    You are an expert business consultant and market analyst with deep knowledge of global markets, local economies, and business opportunities worldwide.
    
    User Query: "{user_query}"
    
    TASK ANALYSIS:
    1. Extract the EXACT location mentioned (if any): city, country, or region
    2. Identify the business type/industry being asked about
    3. Determine if user wants multiple city options OR analysis of ONE specific location
    
    RESPONSE RULES:
    - If user mentions a SPECIFIC CITY (e.g., "Dubai", "Islamabad", "Toronto"): Return ONLY that city with 5-7 neighborhoods
    - If user asks for "best cities" or multiple options: Return 5-8 diverse cities worldwide with 4-5 neighborhoods each
    - If location is vague (e.g., "in Asia"): Return 5-8 cities from that region
    - NEVER default to London unless the user asks about UK/Europe
    
    NEIGHBORHOOD REQUIREMENTS (CRITICAL):
    Each city MUST include 5-7 REAL, well-known neighborhoods with:
    - Actual neighborhood names used by locals (research carefully)
    - Precise GPS coordinates (latitude, longitude)
    - Specific characteristics: demographics, foot traffic, rent costs, competition level
    - Business viability score (0.65-0.95 range for realistic scoring)
    
    REAL NEIGHBORHOOD EXAMPLES:
    - Islamabad: F-6 Markaz, F-7 Markaz, F-8 Markaz, Blue Area, Saddar, Bahria Town Phase 4, DHA Phase 1
    - Dubai: Dubai Marina, Downtown Dubai, JBR, Business Bay, Jumeirah, DIFC, City Walk
    - Toronto: Yorkville, Distillery District, King West, Queen West, Bloor-Yonge, Financial District
    - New York: SoHo, Williamsburg, Upper East Side, Midtown, East Village
    - Singapore: Orchard Road, Marina Bay, Clarke Quay, Bugis, Chinatown
    
    MARKET ANALYSIS REQUIREMENTS:
    - Real estate costs in local currency and USD equivalent
    - Estimated daily foot traffic numbers
    - Competition density (number of similar businesses in area)
    - Target customer demographics (age, income bracket, occupation)
    - Best performing hours/days
    - Seasonal trends
    - Required licenses and permits
    
    OUTPUT FORMAT:
    Return ONLY valid JSON array (no markdown, no code blocks, no extra text).
    
    [
      {{
        "city": "Exact City Name",
        "country": "Full Country Name",
        "latitude": precise_float,
        "longitude": precise_float,
        "score": 0.70_to_0.95,
        "reason": "4-5 sentences with: (1) Why this city fits the business type, (2) Current market conditions with data, (3) Target customer demographics, (4) Growth potential, (5) Competitive advantages. Include specific numbers (population, income levels, market size).",
        "areas": [
          {{
            "area_name": "Real Neighborhood Name",
            "latitude": precise_float,
            "longitude": precise_float,
            "score": 0.65_to_0.95,
            "characteristics": "MUST include: (1) Primary demographics (age 25-45, income $50-80k), (2) Foot traffic estimate (5,000-8,000 daily), (3) Rent cost ($30-50/sqft/month), (4) Competition count (15-20 similar businesses), (5) Best features (near metro, high visibility), (6) Target customers (young professionals, families). 3-4 sentences minimum."
          }}
        ]
      }}
    ]
    
    QUALITY CHECKS:
    - Each city has 5-7 neighborhoods minimum
    - Scores are realistic (not all 0.95, vary between 0.65-0.95)
    - Reasons contain specific data and numbers
    - Characteristics mention concrete details
    - If user asked about specific city, ONLY return that city
    - Coordinates are accurate for each location
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
        
        # If we got recommendations, return them
        if recommendations:
            return recommendations
        else:
            raise ValueError("No recommendations generated")
            
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print(f"Response was: {text_response[:500] if 'text_response' in locals() else 'No response'}")
        # Try one more time with a simpler prompt
        try:
            simple_prompt = f"Provide 5 best cities worldwide for: {user_query}. Return only JSON array with city, country, latitude, longitude, score (0-1), reason (2 sentences), and areas array with 5 neighborhoods each. No markdown."
            response = model.generate_content(simple_prompt)
            text_response = response.text.replace("```json", "").replace("```", "").strip()
            data = json.loads(text_response)
            return [CityRecommendation(**item) for item in data]
        except:
            raise Exception("AI failed to generate proper response")
    except Exception as e:
        print(f"AI Error: {e}")
        raise Exception(f"Failed to get AI recommendations: {str(e)}")

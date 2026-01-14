from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Import AI functions
from ai_client import get_recommendations_from_ai, get_location_insights

app = Flask(__name__)
CORS(app)

# Set API key from environment
# API key is set in PythonAnywhere WSGI file

@app.route('/')
def read_root():
    return jsonify({"message": "Geo Market Match API is running"})

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    try:
        data = request.json
        query = data.get('query')
        if not query:
            return jsonify({"error": "Query is required"}), 400
        
        results = get_recommendations_from_ai(query)
        # Convert Pydantic models to dict
        recommendations = [rec.dict() if hasattr(rec, 'dict') else rec for rec in results]
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/map-insight', methods=['POST'])
def get_map_insight():
    try:
        data = request.json
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        business_type = data.get('business_type')
        
        if latitude is None or longitude is None or not business_type:
            return jsonify({"error": "latitude, longitude, and business_type are required"}), 400
        
        result = get_location_insights(latitude, longitude, business_type)
        # Convert Pydantic model to dict
        result_dict = result.dict() if hasattr(result, 'dict') else result
        return jsonify(result_dict)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)

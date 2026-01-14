from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.parse

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = {"message": "API is running", "status": "ok"}
        self.wfile.write(json.dumps(response).encode())
        return
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            request_data = json.loads(post_data.decode('utf-8'))
            
            if self.path == '/recommend':
                result = self.handle_recommend(request_data)
            elif self.path == '/map-insight':
                result = self.handle_map_insight(request_data)
            else:
                result = {"error": "Not found"}
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error = {"error": str(e)}
            self.wfile.write(json.dumps(error).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def call_gemini(self, prompt):
        api_key = os.environ.get('GOOGLE_API_KEY')
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
        
        data = json.dumps({
            "contents": [{"parts": [{"text": prompt}]}]
        }).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        response = urllib.request.urlopen(req, timeout=30)
        result = json.loads(response.read().decode('utf-8'))
        return result["candidates"][0]["content"]["parts"][0]["text"]
    
    def handle_recommend(self, data):
        query = data.get('query', '')
        prompt = f"""Analyze: "{query}". Provide 3-5 cities for this business with 3-4 neighborhoods each.
Return ONLY valid JSON:
[{{"city":"City","country":"Country","score":0.9,"latitude":0.0,"longitude":0.0,"summary":"Why",
"areas":[{{"city":"City","area":"Area","score":0.85,"details":"Details",
"estimated_monthly_revenue":"$5K-$10K","estimated_startup_cost":"$20K-$40K","target_customers":"Demographics"}}]}}]"""
        
        response_text = self.call_gemini(prompt)
        json_str = response_text.strip()
        if json_str.startswith('```json'):
            json_str = json_str[7:]
        if json_str.startswith('```'):
            json_str = json_str[3:]
        if json_str.endswith('```'):
            json_str = json_str[:-3]
        
        recommendations = json.loads(json_str.strip())
        return {"recommendations": recommendations}
    
    def handle_map_insight(self, data):
        lat = data.get('latitude', 0)
        lng = data.get('longitude', 0)
        business_type = data.get('business_type', 'business')
        
        prompt = f"""Analyze {lat}, {lng} for {business_type}.
Return ONLY valid JSON:
{{"city":"City","area":"Area","score":0.8,"details":"Analysis",
"estimated_monthly_revenue":"$X-$Y","estimated_startup_cost":"$X-$Y","target_customers":"Demographics"}}"""
        
        response_text = self.call_gemini(prompt)
        json_str = response_text.strip()
        if json_str.startswith('```json'):
            json_str = json_str[7:]
        if json_str.startswith('```'):
            json_str = json_str[3:]
        if json_str.endswith('```'):
            json_str = json_str[:-3]
        
        return json.loads(json_str.strip())

import requests
import time

print("🧪 Testing both endpoints...\n")

# Test 1: Recommend endpoint (what frontend uses for search)
print("1️⃣ Testing /recommend (search query)...")
start = time.time()
try:
    response = requests.post(
        "https://gull001.pythonanywhere.com/recommend",
        json={"query": "restaurant in New York"},
        timeout=90
    )
    elapsed = time.time() - start
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Status: 200 (took {elapsed:.1f}s)")
        print(f"   Cities: {[r['city'] for r in data['recommendations']]}")
    else:
        print(f"   ❌ Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
except requests.Timeout:
    print(f"   ❌ TIMEOUT after 90 seconds")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 2: Map insight endpoint
print("\n2️⃣ Testing /map-insight (map click)...")
start = time.time()
try:
    response = requests.post(
        "https://gull001.pythonanywhere.com/map-insight",
        json={
            "latitude": 25.2048,
            "longitude": 55.2708,
            "business_type": "cafe"
        },
        timeout=90
    )
    elapsed = time.time() - start
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Status: 200 (took {elapsed:.1f}s)")
        print(f"   Location: {data['location_name']}")
        print(f"   Score: {data['recommendation_score']}")
    else:
        print(f"   ❌ Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
except requests.Timeout:
    print(f"   ❌ TIMEOUT after 90 seconds")
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n3️⃣ Checking if timeout is the issue...")
print("   PythonAnywhere free tier has 30-second worker timeout")
print("   If AI takes >30s, the request fails")

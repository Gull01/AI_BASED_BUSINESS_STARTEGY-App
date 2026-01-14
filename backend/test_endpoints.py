import requests
import json

print("🧪 Testing backend API endpoints...\n")

BASE_URL = "https://gull001.pythonanywhere.com"

# Test root endpoint
print("1️⃣ Testing root endpoint...")
try:
    response = requests.get(f"{BASE_URL}/", timeout=10)
    print(f"   ✅ Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test /recommend endpoint
print("\n2️⃣ Testing /recommend endpoint...")
try:
    response = requests.post(
        f"{BASE_URL}/recommend",
        json={"query": "coffee shop in Dubai"},
        timeout=60
    )
    print(f"   ✅ Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Response: {json.dumps(data, indent=2)[:500]}...")
    else:
        print(f"   Response: {response.text[:300]}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test /map-insight endpoint
print("\n3️⃣ Testing /map-insight endpoint...")
try:
    response = requests.post(
        f"{BASE_URL}/map-insight",
        json={
            "latitude": 25.2048,
            "longitude": 55.2708,
            "business_type": "coffee shop"
        },
        timeout=60
    )
    print(f"   ✅ Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Response: {json.dumps(data, indent=2)[:500]}...")
    else:
        print(f"   Response: {response.text[:300]}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "="*60)
print("If all tests pass, the issue might be:")
print("1. Frontend API URL not updated correctly")
print("2. CORS issue")
print("3. Frontend cache")

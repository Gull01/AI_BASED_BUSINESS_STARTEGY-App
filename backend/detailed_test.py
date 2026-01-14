import requests
import time

print("🔍 Detailed endpoint testing...\n")

# Test map insight multiple times
print("Testing /map-insight 3 times...")
for i in range(3):
    try:
        response = requests.post(
            "https://gull001.pythonanywhere.com/map-insight",
            json={"latitude": 25.2048, "longitude": 55.2708, "business_type": "cafe"},
            timeout=60
        )
        if response.status_code == 200:
            print(f"  {i+1}. ✅ Success - {response.json()['location_name']}")
        else:
            print(f"  {i+1}. ❌ Status {response.status_code}: {response.text[:100]}")
    except Exception as e:
        print(f"  {i+1}. ❌ {e}")
    time.sleep(2)

# Test recommend multiple times
print("\nTesting /recommend 3 times...")
for i in range(3):
    try:
        response = requests.post(
            "https://gull001.pythonanywhere.com/recommend",
            json={"query": "cafe in Dubai"},
            timeout=60
        )
        if response.status_code == 200:
            cities = [r['city'] for r in response.json()['recommendations']]
            print(f"  {i+1}. ✅ Success - Cities: {cities}")
        else:
            print(f"  {i+1}. ❌ Status {response.status_code}: {response.text[:100]}")
    except Exception as e:
        print(f"  {i+1}. ❌ {e}")
    time.sleep(2)

import requests

USERNAME = "gull001"
API_TOKEN = "6b1e9f8a832689b290c4a5030fbb655debefb236"
BASE_URL = f"https://www.pythonanywhere.com/api/v0/user/{USERNAME}"
headers = {"Authorization": f"Token {API_TOKEN}"}

print("🚀 Uploading improved AI client...\n")

# Upload improved ai_client.py
with open("ai_client.py", "rb") as f:
    content = f.read()

response = requests.post(
    f"{BASE_URL}/files/path/home/gull001/ai_client.py",
    headers=headers,
    files={"content": content}
)

if response.status_code in [200, 201]:
    print("✅ ai_client.py updated")
else:
    print(f"⚠️  Upload: {response.status_code}")

# Reload
print("\n🔄 Reloading web app...")
response = requests.post(
    f"{BASE_URL}/webapps/gull001.pythonanywhere.com/reload/",
    headers=headers
)

if response.status_code == 200:
    print("✅ Reloaded!")
elif response.status_code == 409:
    print("⏳ Reloading in progress...")
else:
    print(f"⚠️  {response.status_code}")

print("\n⏳ Waiting 5 seconds...")
import time
time.sleep(5)

# Test with a query that should NOT return London
print("\n🧪 Test 1: Coffee shop in Dubai...")
try:
    response = requests.post(
        "https://gull001.pythonanywhere.com/recommend",
        json={"query": "coffee shop in Dubai"},
        timeout=60
    )
    if response.status_code == 200:
        data = response.json()
        cities = [rec['city'] for rec in data['recommendations']]
        print(f"✅ Got cities: {', '.join(cities)}")
        if 'Dubai' in cities:
            print("✅ Correctly returned Dubai!")
        if 'London' in cities and len(cities) == 1:
            print("⚠️  Still returning London - check prompts")
    else:
        print(f"❌ Status: {response.status_code}")
        print(response.text[:300])
except Exception as e:
    print(f"❌ {e}")

# Test map click
print("\n🧪 Test 2: Map click in Islamabad (F-7)...")
try:
    response = requests.post(
        "https://gull001.pythonanywhere.com/map-insight",
        json={
            "latitude": 33.7181,
            "longitude": 73.0535,
            "business_type": "restaurant"
        },
        timeout=60
    )
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Location: {data['location_name']}")
        print(f"Score: {data['recommendation_score']}")
    else:
        print(f"❌ Status: {response.status_code}")
        print(response.text[:300])
except Exception as e:
    print(f"❌ {e}")

print("\n✅ Improvements deployed!")
print("\n🎉 Your improved app:")
print("   Frontend: https://gis-business-strategy-tool.vercel.app")
print("   Backend: https://gull001.pythonanywhere.com")

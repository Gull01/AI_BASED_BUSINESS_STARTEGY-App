import requests

USERNAME = "gull001"
API_TOKEN = "6b1e9f8a832689b290c4a5030fbb655debefb236"
BASE_URL = f"https://www.pythonanywhere.com/api/v0/user/{USERNAME}"
headers = {"Authorization": f"Token {API_TOKEN}"}

print("🔄 Uploading fixed flask_app.py...\n")

# Upload updated flask_app.py
with open("flask_app.py", "rb") as f:
    flask_content = f.read()

response = requests.post(
    f"{BASE_URL}/files/path/home/gull001/flask_app.py",
    headers=headers,
    files={"content": flask_content}
)

if response.status_code in [200, 201]:
    print("✅ flask_app.py updated")
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
else:
    print(f"⚠️  {response.status_code}")

print("\n⏳ Waiting 5 seconds...")
import time
time.sleep(5)

# Test /recommend
print("\n🧪 Testing /recommend endpoint...")
try:
    response = requests.post(
        "https://gull001.pythonanywhere.com/recommend",
        json={"query": "coffee shop in Dubai"},
        timeout=60
    )
    if response.status_code == 200:
        print(f"✅ SUCCESS! Got {len(response.json()['recommendations'])} recommendations")
        print("\n🎉 Backend is fully working!")
        print("   Frontend: https://gis-business-strategy-tool.vercel.app")
        print("   Backend: https://gull001.pythonanywhere.com")
    else:
        print(f"⚠️  Status: {response.status_code}")
        print(f"Response: {response.text[:300]}")
except Exception as e:
    print(f"❌ {e}")

import os
import requests

USERNAME = "gull001"
PA_API_TOKEN = os.environ["PYTHONANYWHERE_API_TOKEN"]
BASE_URL = f"https://www.pythonanywhere.com/api/v0/user/{USERNAME}"
headers = {"Authorization": f"Token {PA_API_TOKEN}"}

print("🔑 Google API Key Update Tool\n")
print("Your current API key was reported as leaked and blocked by Google.")
print("\nTo get a new key:")
print("1. Go to: https://aistudio.google.com/apikey")
print("2. Click 'Create API key'")
print("3. Copy the new key")
print()

new_api_key = input("Enter your NEW Google API key: ").strip()

if not new_api_key or len(new_api_key) < 30:
    print("❌ Invalid API key")
    exit(1)

print("\n📝 Updating WSGI configuration with new API key...")

wsgi_config = f"""import sys
import os

# Add project directory
path = '/home/gull001'
if path not in sys.path:
    sys.path.append(path)

# Set NEW API key
os.environ['GOOGLE_API_KEY'] = '{new_api_key}'

# Import Flask app (Flask is natively WSGI)
from flask_app import app as application
"""

response = requests.post(
    f"{BASE_URL}/files/path/var/www/gull001_pythonanywhere_com_wsgi.py",
    headers=headers,
    files={"content": wsgi_config}
)

if response.status_code in [200, 201]:
    print("✅ WSGI file updated with new API key")
else:
    print(f"⚠️  {response.status_code}")

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

print("\n⏳ Waiting 5 seconds for reload...")
import time
time.sleep(5)

# Test
print("\n🧪 Testing with new API key...")
try:
    response = requests.post(
        "https://gull001.pythonanywhere.com/recommend",
        json={"query": "coffee shop in Dubai"},
        timeout=60
    )
    if response.status_code == 200:
        data = response.json()
        cities = [rec['city'] for rec in data['recommendations']]
        print(f"\n🎉 SUCCESS! Got cities: {', '.join(cities)}")
        print("\n✅ New API key is working!")
    else:
        print(f"⚠️  Status: {response.status_code}")
        print(response.text[:300])
except Exception as e:
    print(f"❌ {e}")

print("\n✨ Your app is ready:")
print("   Frontend: https://gis-business-strategy-tool.vercel.app")
print("   Backend: https://gull001.pythonanywhere.com")

import requests

USERNAME = "gull001"
API_TOKEN = "6b1e9f8a832689b290c4a5030fbb655debefb236"
BASE_URL = f"https://www.pythonanywhere.com/api/v0/user/{USERNAME}"
headers = {"Authorization": f"Token {API_TOKEN}"}

print("🚀 Deploying Flask version...\n")

# Step 1: Upload flask_app.py
print("📤 Uploading flask_app.py...")
with open("flask_app.py", "rb") as f:
    flask_content = f.read()

response = requests.post(
    f"{BASE_URL}/files/path/home/gull001/flask_app.py",
    headers=headers,
    files={"content": flask_content}
)

if response.status_code in [200, 201]:
    print("✅ flask_app.py uploaded")
else:
    print(f"⚠️  Upload: {response.status_code}")

# Step 2: Update WSGI to use Flask
print("\n📝 Updating WSGI for Flask...")
wsgi_config = """import sys
import os

# Add project directory
path = '/home/gull001'
if path not in sys.path:
    sys.path.append(path)

# Set API key
os.environ['GOOGLE_API_KEY'] = 'AIzaSyC_y-iqtBamMmsv07dGKefauyZ5FGyVQr0'

# Import Flask app (Flask is natively WSGI)
from flask_app import app as application
"""

response = requests.post(
    f"{BASE_URL}/files/path/var/www/gull001_pythonanywhere_com_wsgi.py",
    headers=headers,
    files={"content": wsgi_config}
)

if response.status_code in [200, 201]:
    print("✅ WSGI file updated for Flask")
else:
    print(f"⚠️  WSGI: {response.status_code}")

# Step 3: Reload
print("\n🔄 Reloading web app...")
response = requests.post(
    f"{BASE_URL}/webapps/gull001.pythonanywhere.com/reload/",
    headers=headers
)

if response.status_code == 200:
    print("✅ Reloaded!")
else:
    print(f"⚠️  Reload: {response.status_code}")

print("\n⏳ Waiting 5 seconds...")
import time
time.sleep(5)

# Test
print("\n🧪 Testing...")
try:
    response = requests.get("https://gull001.pythonanywhere.com/", timeout=30)
    if response.status_code == 200:
        print(f"\n🎉 SUCCESS! {response.json()}")
        print("\n✨ Your app is fully live:")
        print("   Frontend: https://gis-business-strategy-tool.vercel.app")
        print("   Backend: https://gull001.pythonanywhere.com")
    else:
        print(f"Status: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")
    print("\n💡 Install Flask: Go to Bash console and run:")
    print("   pip3.10 install --user flask flask-cors")

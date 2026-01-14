import requests
import time

# PythonAnywhere API setup
USERNAME = "gull001"
API_TOKEN = input("Enter your PythonAnywhere API token: ").strip()

if not API_TOKEN:
    print("❌ API token required!")
    exit(1)

BASE_URL = f"https://www.pythonanywhere.com/api/v0/user/{USERNAME}"
headers = {"Authorization": f"Token {API_TOKEN}"}

print("🔧 Setting up PythonAnywhere backend...\n")

# Step 1: Update WSGI file
print("📝 Updating WSGI configuration...")
wsgi_config = """import sys
import os

path = '/home/gull001'
if path not in sys.path:
    sys.path.append(path)

os.environ['GOOGLE_API_KEY'] = 'AIzaSyC_y-iqtBamMmsv07dGKefauyZ5FGyVQr0'

# Import the ASGI app and wrap it for WSGI
from main import app as fastapi_app

# Use a2wsgi to convert FastAPI (ASGI) to WSGI
from a2wsgi import ASGIMiddleware
application = ASGIMiddleware(fastapi_app)
"""

response = requests.put(
    f"{BASE_URL}/files/path/var/www/gull001_pythonanywhere_com_wsgi.py",
    headers=headers,
    files={"content": wsgi_config}
)

if response.status_code == 200:
    print("✅ WSGI file updated")
else:
    print(f"⚠️  WSGI update: {response.status_code} - {response.text}")

# Step 2: Reload web app
print("\n🔄 Reloading web app...")
response = requests.post(
    f"{BASE_URL}/webapps/gull001.pythonanywhere.com/reload/",
    headers=headers
)

if response.status_code == 200:
    print("✅ Web app reloaded!")
    print("\n🎉 Backend is at: https://gull001.pythonanywhere.com")
    print("\n⚠️  Note: You still need to install a2wsgi package:")
    print("   1. Go to PythonAnywhere Bash console")
    print("   2. Run: pip3.10 install --user a2wsgi")
    print("   3. Click 'Reload' on your web app")
else:
    print(f"⚠️  Reload failed: {response.status_code} - {response.text}")

print("\n✨ Setup complete!")

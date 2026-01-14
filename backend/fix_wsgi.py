import requests

USERNAME = "gull001"
API_TOKEN = "6b1e9f8a832689b290c4a5030fbb655debefb236"

BASE_URL = f"https://www.pythonanywhere.com/api/v0/user/{USERNAME}"
headers = {"Authorization": f"Token {API_TOKEN}"}

print("🔧 Updating WSGI configuration...\n")

# Correct WSGI configuration
wsgi_config = """import sys
import os

# Add your project directory to the sys.path
path = '/home/gull001'
if path not in sys.path:
    sys.path.append(path)

# Set environment variables
os.environ['GOOGLE_API_KEY'] = 'AIzaSyC_y-iqtBamMmsv07dGKefauyZ5FGyVQr0'

# Import FastAPI app and wrap with a2wsgi
from main import app as fastapi_app
from a2wsgi import ASGIMiddleware

# This is the WSGI application that uWSGI will use
application = ASGIMiddleware(fastapi_app)
"""

# Upload WSGI file
response = requests.post(
    f"{BASE_URL}/files/path/var/www/gull001_pythonanywhere_com_wsgi.py",
    headers=headers,
    files={"content": wsgi_config}
)

if response.status_code == 200:
    print("✅ WSGI file uploaded successfully")
elif response.status_code == 201:
    print("✅ WSGI file created successfully")
else:
    print(f"⚠️  Response: {response.status_code}")
    print(response.text)

# Reload web app
print("\n🔄 Reloading web app...")
response = requests.post(
    f"{BASE_URL}/webapps/gull001.pythonanywhere.com/reload/",
    headers=headers
)

if response.status_code == 200:
    print("✅ Web app reloaded!")
    print("\n🎉 Backend should now be live at: https://gull001.pythonanywhere.com")
    print("\nTesting in 3 seconds...")
    
    import time
    time.sleep(3)
    
    # Test the endpoint
    try:
        test_response = requests.get("https://gull001.pythonanywhere.com/", timeout=10)
        if test_response.status_code == 200:
            print(f"\n✅ SUCCESS! Backend is working: {test_response.json()}")
        else:
            print(f"\n⚠️  Got response code: {test_response.status_code}")
    except Exception as e:
        print(f"\n⚠️  Test failed: {e}")
else:
    print(f"⚠️  Reload failed: {response.status_code}")

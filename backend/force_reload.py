import requests
import time

USERNAME = "gull001"
API_TOKEN = "6b1e9f8a832689b290c4a5030fbb655debefb236"
BASE_URL = f"https://www.pythonanywhere.com/api/v0/user/{USERNAME}"
headers = {"Authorization": f"Token {API_TOKEN}"}

print("🔄 Forcing web app reload...\n")

# Try to reload
for attempt in range(3):
    response = requests.post(
        f"{BASE_URL}/webapps/gull001.pythonanywhere.com/reload/",
        headers=headers
    )
    
    if response.status_code == 200:
        print(f"✅ Reload successful on attempt {attempt + 1}")
        break
    elif response.status_code == 409:
        print(f"⏳ Attempt {attempt + 1}: App is reloading, waiting...")
        time.sleep(5)
    else:
        print(f"⚠️  Attempt {attempt + 1}: {response.status_code} - {response.text}")
        time.sleep(3)

print("\n⏳ Waiting 10 seconds for app to fully load...")
time.sleep(10)

# Test the backend
print("\n🧪 Testing backend...")
try:
    response = requests.get("https://gull001.pythonanywhere.com/", timeout=15)
    if response.status_code == 200:
        print(f"✅ SUCCESS! Backend is working!")
        print(f"Response: {response.json()}")
    else:
        print(f"⚠️  Got status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n💡 If you see 'Something went wrong', check:")
    print("   1. Go to https://www.pythonanywhere.com/user/gull001/webapps/")
    print("   2. Click the 'Reload' button manually")
    print("   3. Wait 30 seconds")
    print("   4. Run this script again")

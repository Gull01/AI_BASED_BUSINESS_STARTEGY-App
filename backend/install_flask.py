import requests
import time

USERNAME = "gull001"
API_TOKEN = "6b1e9f8a832689b290c4a5030fbb655debefb236"
BASE_URL = f"https://www.pythonanywhere.com/api/v0/user/{USERNAME}"
headers = {"Authorization": f"Token {API_TOKEN}"}

print("📦 Installing Flask via API...\n")

# Get list of consoles
response = requests.get(f"{BASE_URL}/consoles/", headers=headers)
if response.status_code == 200:
    consoles = response.json()
    print(f"Found {len(consoles)} existing consoles")
    
    # Try to use an existing console or create a shared one
    console_id = None
    for console in consoles:
        if console.get('name'):
            console_id = console['id']
            print(f"Using console: {console_id}")
            break
    
    if console_id:
        # Send command to install Flask
        print("\n📤 Sending install command...")
        install_cmd = "pip3.10 install --user flask flask-cors\n"
        
        response = requests.post(
            f"{BASE_URL}/consoles/{console_id}/send_input/",
            headers=headers,
            json={"input": install_cmd}
        )
        
        if response.status_code == 200:
            print("✅ Command sent!")
            print("⏳ Waiting 10 seconds for installation...")
            time.sleep(10)
        else:
            print(f"⚠️  Send command: {response.status_code} - {response.text}")
else:
    print(f"⚠️  Get consoles: {response.status_code}")
    print("\n💡 Creating new console and installing Flask...")
    
    # Create a shared console
    response = requests.post(
        f"{BASE_URL}/consoles/shared_console/",
        headers=headers,
        json={"command": "pip3.10 install --user flask flask-cors"}
    )
    
    if response.status_code in [200, 201]:
        print("✅ Installation started")
        print("⏳ Waiting 10 seconds...")
        time.sleep(10)
    else:
        print(f"⚠️  Create console: {response.status_code} - {response.text}")

# Reload web app
print("\n🔄 Reloading web app...")
response = requests.post(
    f"{BASE_URL}/webapps/gull001.pythonanywhere.com/reload/",
    headers=headers
)

if response.status_code == 200:
    print("✅ Reloaded!")
elif response.status_code == 409:
    print("⏳ Already reloading...")
else:
    print(f"⚠️  {response.status_code}")

# Wait and test
print("\n⏳ Waiting 8 seconds for app to load...")
time.sleep(8)

print("\n🧪 Testing backend...")
try:
    response = requests.get("https://gull001.pythonanywhere.com/", timeout=20)
    if response.status_code == 200:
        print(f"\n🎉 SUCCESS! Backend is working!")
        print(f"Response: {response.json()}")
        print("\n✨ Full app is live:")
        print("   Frontend: https://gis-business-strategy-tool.vercel.app")
        print("   Backend: https://gull001.pythonanywhere.com")
    else:
        print(f"⚠️  Status: {response.status_code}")
        print(f"Response: {response.text[:300]}")
except Exception as e:
    print(f"❌ {e}")
    print("\n💡 Manual step needed:")
    print("   1. Go to PythonAnywhere Bash console")
    print("   2. Run: pip3.10 install --user flask flask-cors")
    print("   3. Reload web app")

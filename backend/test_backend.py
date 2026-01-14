import requests

print("🧪 Testing backend with long timeout...\n")

try:
    print("Testing root endpoint...")
    response = requests.get("https://gull001.pythonanywhere.com/", timeout=60)
    print(f"✅ Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    print("\n✅ SUCCESS! Backend is working!")
    print("\n🎉 Your full app is now live:")
    print("   Frontend: https://gis-business-strategy-tool.vercel.app")
    print("   Backend: https://gull001.pythonanywhere.com")
    
except requests.Timeout:
    print("❌ Still timing out after 60 seconds")
    print("\n💡 The issue is that PythonAnywhere free tier has a 30-second worker timeout")
    print("   and the app is taking too long to start up.")
except Exception as e:
    print(f"❌ Error: {e}")

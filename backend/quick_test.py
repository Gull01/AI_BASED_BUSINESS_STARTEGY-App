import requests

print("🧪 Quick test with new API key...\n")

try:
    response = requests.post(
        "https://gull001.pythonanywhere.com/recommend",
        json={"query": "coffee shop in Dubai"},
        timeout=60
    )
    
    if response.status_code == 200:
        data = response.json()
        cities = [rec['city'] for rec in data['recommendations']]
        print(f"✅ SUCCESS! Got {len(cities)} cities:")
        for i, rec in enumerate(data['recommendations'][:3], 1):
            print(f"\n{i}. {rec['city']}, {rec['country']}")
            print(f"   Score: {rec['score']}")
            print(f"   Neighborhoods: {len(rec.get('areas', []))}")
            if rec.get('areas'):
                print(f"   First area: {rec['areas'][0]['area_name']}")
        
        print("\n✅ App is working perfectly!")
        print("   Frontend: https://gis-business-strategy-tool.vercel.app")
        print("   Backend: https://gull001.pythonanywhere.com")
    else:
        print(f"❌ Status: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"❌ Error: {e}")

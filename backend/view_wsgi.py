import requests

USERNAME = "gull001"
API_TOKEN = "6b1e9f8a832689b290c4a5030fbb655debefb236"
BASE_URL = f"https://www.pythonanywhere.com/api/v0/user/{USERNAME}"
headers = {"Authorization": f"Token {API_TOKEN}"}

print("📄 Checking WSGI file content...\n")

response = requests.get(
    f"{BASE_URL}/files/path/var/www/gull001_pythonanywhere_com_wsgi.py",
    headers=headers
)

if response.status_code == 200:
    print("Current WSGI file:")
    print("=" * 60)
    print(response.text)
    print("=" * 60)
else:
    print(f"Error: {response.status_code}")

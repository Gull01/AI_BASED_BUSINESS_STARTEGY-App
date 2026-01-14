import requests

USERNAME = "gull001"
API_TOKEN = "6b1e9f8a832689b290c4a5030fbb655debefb236"

BASE_URL = f"https://www.pythonanywhere.com/api/v0/user/{USERNAME}"
headers = {"Authorization": f"Token {API_TOKEN}"}

print("🔍 Checking PythonAnywhere backend status...\n")

# Check if files exist
print("📁 Checking files...")
files_to_check = ["main.py", "ai_client.py", "schemas.py"]
for file in files_to_check:
    response = requests.get(
        f"{BASE_URL}/files/path/home/gull001/{file}",
        headers=headers
    )
    if response.status_code == 200:
        print(f"  ✅ {file} exists")
    else:
        print(f"  ❌ {file} missing")

# Get error log
print("\n📋 Fetching error log...")
response = requests.get(
    f"{BASE_URL}/files/path/var/log/gull001.pythonanywhere.com.error.log",
    headers=headers
)

if response.status_code == 200:
    log_content = response.text
    # Get last 50 lines
    lines = log_content.split('\n')
    last_lines = lines[-50:]
    print("\n🔴 Last 50 lines of error log:")
    print("=" * 60)
    for line in last_lines:
        if line.strip():
            print(line)
    print("=" * 60)
else:
    print(f"⚠️  Could not fetch error log: {response.status_code}")

# Get server log
print("\n📋 Fetching server log...")
response = requests.get(
    f"{BASE_URL}/files/path/var/log/gull001.pythonanywhere.com.server.log",
    headers=headers
)

if response.status_code == 200:
    log_content = response.text
    lines = log_content.split('\n')
    last_lines = lines[-30:]
    print("\n📝 Last 30 lines of server log:")
    print("=" * 60)
    for line in last_lines:
        if line.strip():
            print(line)
    print("=" * 60)
else:
    print(f"⚠️  Could not fetch server log: {response.status_code}")

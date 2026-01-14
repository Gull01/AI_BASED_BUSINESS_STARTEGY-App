#!/usr/bin/env python3
"""
PythonAnywhere Deployment Script
Run this after creating your account at pythonanywhere.com
"""

import os
import sys

print("=" * 60)
print("PythonAnywhere Deployment Helper")
print("=" * 60)

username = input("\nEnter your PythonAnywhere username: ").strip()
api_token = input("Enter your PythonAnywhere API token: ").strip()

if not username or not api_token:
    print("❌ Username and API token are required!")
    sys.exit(1)

print(f"\n✅ Configuration saved!")
print(f"Username: {username}")
print(f"API Token: {'*' * len(api_token)}")

print("\n" + "=" * 60)
print("Next Steps:")
print("=" * 60)
print(f"""
1. Your API will be at: https://{username}.pythonanywhere.com

2. To get your API token:
   - Go to: https://www.pythonanywhere.com/account/#api_token
   - Click "Create a new API token"
   - Copy the token

3. Upload your files to PythonAnywhere:
   - Go to Files tab
   - Upload: main.py, ai_client.py, schemas.py, requirements.txt

4. Run in PythonAnywhere Bash console:
   pip3.10 install --user fastapi uvicorn pydantic python-dotenv google-generativeai

5. Create web app and configure WSGI file as shown in PYTHONANYWHERE_DEPLOY.md

Your backend will be live 24/7 for FREE!
""")

print("\nOnce deployed, come back and give me your URL!")
print(f"URL will be: https://{username}.pythonanywhere.com")

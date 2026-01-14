# PythonAnywhere Deployment Guide

## Step 1: Sign Up (FREE, No Card)
Go to: https://www.pythonanywhere.com/registration/register/beginner/
- Create account with email
- No credit card needed!

## Step 2: Upload Files
1. Go to **Files** tab
2. Create directory: `/home/yourusername/gis-api`
3. Upload these files from backend folder:
   - main.py
   - ai_client.py
   - schemas.py
   - requirements.txt

## Step 3: Install Dependencies
1. Go to **Consoles** → **Bash**
2. Run:
```bash
cd ~/gis-api
pip3.10 install --user -r requirements.txt
```

## Step 4: Create WSGI File
1. Go to **Web** tab → **Add a new web app**
2. Choose **Manual configuration** → **Python 3.10**
3. Click on **WSGI configuration file** link
4. Replace content with:
```python
import sys
import os

path = '/home/yourusername/gis-api'
if path not in sys.path:
    sys.path.append(path)

os.environ['GOOGLE_API_KEY'] = 'AIzaSyC_y-iqtBamMmsv07dGKefauyZ5FGyVQr0'

from main import app as application
```

## Step 5: Configure Web App
In Web tab:
- **Source code**: `/home/yourusername/gis-api`
- **Working directory**: `/home/yourusername/gis-api`
- Click **Reload** button

## Your API URL
Your API will be at: `https://yourusername.pythonanywhere.com`

Free tier: Always on, 24/7!

# 🎯 Alternative: Use PythonAnywhere (NO CARD NEEDED)

## 100% Free, No Credit Card Required!

### Step 1: Sign Up
Go to: https://www.pythonanywhere.com/registration/register/beginner/

### Step 2: Upload Your Code
1. Go to **Files** tab
2. Click **Upload a file**
3. Upload: `main.py`, `ai_client.py`, `schemas.py`, `requirements.txt`

### Step 3: Install Dependencies
1. Go to **Consoles** → Start a **Bash console**
2. Run:
```bash
pip install --user fastapi uvicorn pydantic python-dotenv google-generativeai
```

### Step 4: Create Web App
1. Go to **Web** tab
2. Click **Add a new web app**
3. Choose **Manual configuration** → **Python 3.10**
4. WSGI file: Point to your FastAPI app

### Step 5: Set Environment Variable
1. In **Web** tab, scroll to **Environment variables**
2. Add: `GOOGLE_API_KEY` = `AIzaSyC_y-iqtBamMmsv07dGKefauyZ5FGyVQr0`

Your API will be at: `https://yourusername.pythonanywhere.com`

---

# 🚀 EASIER OPTION: Use Vercel for Backend Too!

Since frontend works on Vercel, let me try fixing the backend on Vercel one more time with a simpler approach.

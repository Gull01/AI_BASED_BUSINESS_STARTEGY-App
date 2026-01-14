# 🚀 Deploy Backend to Render.com (FREE)

## Step 1: Go to Render Dashboard
Open: https://dashboard.render.com/

## Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Choose **"Build and deploy from a Git repository"**
3. Click **"Connect GitHub"** and authorize
4. Select repository: **`Gull01/AI_BASED_BUSINESS_STARTEGY-App`**

## Step 3: Configure Service
- **Name**: `gis-business-api`
- **Root Directory**: `backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Plan**: `Free`

## Step 4: Add Environment Variable
Click **"Advanced"** → **"Add Environment Variable"**
- **Key**: `GOOGLE_API_KEY`
- **Value**: `AIzaSyC_y-iqtBamMmsv07dGKefauyZ5FGyVQr0`

## Step 5: Deploy!
Click **"Create Web Service"**

Your API will be live at: `https://gis-business-api.onrender.com`

## Step 6: Update Frontend
After backend is deployed, I'll update the frontend to use the Render API URL.

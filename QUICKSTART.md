# 🚀 Quick Start - Push to GitHub & Deploy

## Step 1: Initialize Git & Push to GitHub (5 minutes)

```bash
# Navigate to your project
cd "C:\Users\Gul Nawaz\Desktop\GIS_BASED_BUSINESS_STARTEGY TOOL"

# Initialize git repository
git init

# Add all files (.env will be automatically excluded by .gitignore)
git add .

# Commit
git commit -m "Initial commit: Geo Market Match - AI Business Location Intelligence"

# Create a new repository on GitHub:
# 1. Go to https://github.com/new
# 2. Repository name: geo-market-match
# 3. Description: AI-powered business location intelligence tool
# 4. Public or Private: Your choice
# 5. DON'T initialize with README (we already have one)
# 6. Click "Create repository"

# Link your local repo to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/geo-market-match.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**✅ VERIFY**: Go to your GitHub repo and make sure `.env` files are NOT visible!

---

## Step 2: Deploy Backend on Render (10 minutes)

1. **Go to https://render.com**
   - Sign up/Login with GitHub
   - Click "Authorize Render" to access your repos

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Click "Connect" on your `geo-market-match` repository

3. **Configure Settings:**
   ```
   Name: geo-market-match-api
   Region: Choose closest (e.g., Oregon for US West)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

4. **🔐 Add Environment Variable:**
   - Scroll to "Environment Variables"
   - Click "Add Environment Variable"
   - Key: `GOOGLE_API_KEY`
   - Value: Paste your Gemini API key here
   - Click "Save"

5. **Create Web Service**
   - Click "Create Web Service"
   - Wait 5-10 minutes for build and deploy
   - Copy your backend URL (looks like: `https://geo-market-match-api.onrender.com`)

**⚠️ Note**: Free tier sleeps after 15 mins of inactivity. First request after sleep takes ~30 seconds.

---

## Step 3: Deploy Frontend on Vercel (5 minutes)

1. **Go to https://vercel.com**
   - Sign up/Login with GitHub
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select `geo-market-match` from the list
   - Click "Import"

3. **Configure Project:**
   ```
   Project Name: geo-market-match
   Framework Preset: Vite (auto-detected)
   Root Directory: frontend
   Build Command: npm run build (auto-detected)
   Output Directory: dist (auto-detected)
   Install Command: npm install (auto-detected)
   ```

4. **🔐 Add Environment Variable:**
   - Click "Environment Variables" tab
   - Add new variable:
     - Name: `VITE_API_URL`
     - Value: `https://geo-market-match-api.onrender.com` (your Render URL from Step 2)
     - Environments: Production ✓ Preview ✓ Development ✓
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is LIVE! 🎉
   - Vercel gives you a URL like: `https://geo-market-match.vercel.app`

---

## Step 4: Test Your Live App ✅

1. Open your Vercel URL: `https://geo-market-match.vercel.app`
2. Dismiss the welcome screen
3. Try a query: "Best areas for cafe in Islamabad"
4. Wait for results (first backend request may take 30s on Render free tier)
5. Click on map markers to see neighborhood insights
6. Click anywhere on the map for instant analysis

**If it works**: Congratulations! Your app is live! 🎉

---

## Common Issues & Fixes

### Issue: "Failed to fetch recommendations"
**Fix**: Check if backend URL in Vercel env vars matches Render URL exactly (no trailing slash)

### Issue: First request takes forever
**Reason**: Render free tier sleeps after 15 min inactivity
**Fix**: This is normal. After first request, it stays awake for 15 minutes

### Issue: CORS error in browser console
**Fix**: 
1. Go to your Render dashboard
2. Edit `backend/main.py` and update CORS to include your Vercel URL:
```python
allow_origins=[
    "https://geo-market-match.vercel.app",  # Your Vercel URL
    "http://localhost:5173"  # Keep for local dev
]
```
3. Commit and push changes - Render auto-deploys

### Issue: "API Key invalid"
**Fix**: 
1. Go to Render dashboard → Your service → Environment
2. Verify `GOOGLE_API_KEY` is set correctly
3. Try generating a new API key from Google
4. Update the environment variable and redeploy

---

## 🎯 You're Done! Share Your App

Your app is now:
- ✅ Live on the internet
- ✅ Secured (API keys not in code)
- ✅ Free to run (within limits)
- ✅ Auto-deploys on GitHub push

**Share your Vercel URL with anyone!**

Example: "Check out my AI business location intelligence tool: https://geo-market-match.vercel.app"

---

## Optional: Custom Domain

### On Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your domain (e.g., `geomarketmatch.com`)
3. Follow DNS instructions
4. Vercel handles SSL automatically

### On Render (Backend):
1. Free tier doesn't support custom domains
2. Upgrade to paid tier ($7/month) if needed
3. Or use free Render subdomain

---

## Monitoring & Maintenance

### Check Backend Logs:
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. See all requests and errors

### Check Frontend Deployments:
1. Go to Vercel dashboard
2. Click your project
3. See all deployments and previews

### Update Code:
```bash
# Make changes to your code
git add .
git commit -m "Description of changes"
git push

# Both Render and Vercel auto-deploy! 🚀
```

---

## Cost Breakdown (Free Tier)

| Service | Free Tier | Cost |
|---------|-----------|------|
| GitHub | Unlimited public repos | $0 |
| Render | 750 hrs/month, sleeps after 15min | $0 |
| Vercel | 100GB bandwidth, unlimited builds | $0 |
| Google Gemini API | 60 requests/min | $0 |
| **Total Monthly** | | **$0** |

Perfect for:
- ✅ Portfolio projects
- ✅ Side projects
- ✅ Demos and prototypes
- ✅ Small business tools

For production with high traffic, consider upgrading.

---

## Need Help?

- **GitHub Issues**: Open an issue in your repo
- **Render Support**: https://render.com/docs
- **Vercel Support**: https://vercel.com/docs
- **Gemini API**: https://ai.google.dev/docs

---

**🎉 Congratulations! You've successfully deployed a full-stack AI application!**

Now go build something amazing! 🚀

# Deployment Guide - Geo Market Match

## 🚀 Quick Deploy to Production (Free)

This guide shows you how to deploy your app for FREE with secure API key handling.

## 📋 Pre-Deployment Checklist

- [ ] Code is committed to GitHub with `.env` excluded
- [ ] `.gitignore` is properly configured
- [ ] `.env.example` files are included
- [ ] Google Gemini API key is ready
- [ ] Both frontend and backend work locally

---

## Option 1: Vercel (Frontend) + Render (Backend) ⭐ Recommended

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files (will automatically exclude .env due to .gitignore)
git add .

# Commit
git commit -m "Initial commit - Geo Market Match app"

# Create GitHub repo and push
# Go to github.com → New Repository → "geo-market-match"
git remote add origin https://github.com/YOUR_USERNAME/geo-market-match.git
git branch -M main
git push -u origin main
```

**✅ Verify**: Check GitHub - your `.env` file should NOT be visible!

---

### Step 2: Deploy Backend on Render

1. **Go to https://render.com** → Sign in with GitHub

2. **New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service:**
   ```
   Name: geo-market-match-api
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

4. **🔐 Add Environment Variable:**
   - Click "Advanced" → "Add Environment Variable"
   - Key: `GOOGLE_API_KEY`
   - Value: `your_actual_gemini_api_key_here`
   - ✅ Click "Add"

5. **Deploy!**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy your backend URL: `https://geo-market-match-api.onrender.com`

**⚠️ Important**: Render free tier spins down after inactivity. First request may take 30-60 seconds.

---

### Step 3: Deploy Frontend on Vercel

1. **Go to https://vercel.com** → Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build (auto-detected)
   Output Directory: dist (auto-detected)
   Install Command: npm install (auto-detected)
   ```

4. **🔐 Add Environment Variable:**
   - Click "Environment Variables"
   - Key: `VITE_API_URL`
   - Value: `https://geo-market-match-api.onrender.com` (your Render backend URL)
   - Apply to: Production, Preview, Development
   - ✅ Click "Add"

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉
   - Vercel provides URL: `https://geo-market-match.vercel.app`

---

## Option 2: Railway (Full Stack)

1. **Go to https://railway.app** → Sign in with GitHub

2. **New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Add Backend Service:**
   - Railway auto-detects it
   - Go to service settings:
     - Root Directory: `backend`
     - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add Environment Variable:
     - `GOOGLE_API_KEY` = your API key
   - Deploy

4. **Add Frontend Service:**
   - Click "+ New Service"
   - Select same repo
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Start Command: `npm run preview` (for Vite)
   - Add Environment Variable:
     - `VITE_API_URL` = your Railway backend URL
   - Deploy

5. **Access Your App:**
   - Railway provides public URLs for both services
   - Use frontend URL to access the app

---

## Option 3: Netlify (Frontend) + Render (Backend)

Similar to Vercel + Render, but with Netlify:

1. Deploy backend on Render (same as above)

2. **Go to https://netlify.com**
   - Import from GitHub
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Environment Variables:
     - `VITE_API_URL` = your backend URL

---

## 🔒 Security Best Practices

### ✅ DO:

1. **Never commit `.env` files**
   ```bash
   # Check if .env is ignored
   git status
   # Should NOT show .env files
   ```

2. **Use platform environment variables**
   - Set `GOOGLE_API_KEY` in Render/Railway settings
   - Set `VITE_API_URL` in Vercel/Netlify settings

3. **Rotate keys if exposed**
   - If you accidentally push API key to GitHub:
     - Delete the key immediately from Google Console
     - Generate a new one
     - Update in hosting platform
     - Use `git filter-branch` to remove from history (or delete repo)

4. **Use `.env.example` for documentation**
   - Commit `.env.example` (WITHOUT actual keys)
   - Shows teammates what variables are needed

### ❌ DON'T:

1. ❌ Hardcode API keys in source code
2. ❌ Commit `.env` files to GitHub
3. ❌ Share production API keys in Slack/Discord
4. ❌ Use same key for dev and production
5. ❌ Leave API keys in code comments

---

## 🔍 Verify Security

Before pushing to GitHub:

```bash
# Check what will be committed
git status

# Make sure .env is NOT listed
# If it is, add to .gitignore immediately

# Check .gitignore
cat .gitignore

# Should include:
# .env
# *.env
# .env.local
```

---

## 🌐 CORS Configuration

If you get CORS errors in production, update `backend/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "http://localhost:5173"  # for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Cost Estimate (Free Tier Limits)

| Service | Free Tier | Limitations |
|---------|-----------|-------------|
| **Render** | 750 hours/month | Spins down after 15 min inactivity |
| **Vercel** | 100 GB bandwidth | Unlimited builds, no sleep |
| **Railway** | $5 credit/month | ~500 hours runtime |
| **Netlify** | 100 GB bandwidth | 300 build minutes/month |
| **Google Gemini** | 60 req/min | Perfect for small projects |

**Total Cost**: $0/month for moderate usage! 🎉

---

## 🐛 Troubleshooting

### "Backend not responding"
- Check if Render service is sleeping (first request takes 30s)
- Verify `VITE_API_URL` in frontend matches backend URL
- Check Render logs for errors

### "API Key Invalid"
- Verify `GOOGLE_API_KEY` is set in Render environment variables
- Check if key has proper permissions in Google Cloud Console
- Try regenerating the API key

### "CORS Error"
- Update CORS configuration in `backend/main.py`
- Add your Vercel domain to `allow_origins`

### "Module not found"
- Verify `requirements.txt` includes all Python dependencies
- Check `package.json` for frontend dependencies
- Try rebuilding the service

---

## 🎯 Post-Deployment

1. **Test your live app thoroughly**
2. **Monitor usage** in Google Cloud Console
3. **Set up custom domain** (optional - Vercel/Netlify make this easy)
4. **Enable HTTPS** (automatic on all platforms)
5. **Share with the world!** 🌍

---

## 📞 Need Help?

- Render docs: https://render.com/docs
- Vercel docs: https://vercel.com/docs
- Railway docs: https://docs.railway.app
- Google Gemini: https://ai.google.dev/docs

---

**Your app is now live, secure, and FREE! 🚀**

# Deployment Guide

This guide will walk you through deploying the Movie Recommendation App to production.

## Overview

- **Frontend**: Deploy to Netlify (free tier)
- **Backend**: Deploy to Render (free tier)
- **Database**: SQLite (stored on Render's filesystem)

## Prerequisites

1. GitHub account
2. Netlify account (free)
3. Render account (free)
4. Groq API key from [Groq Console](https://console.groq.com/)

---

## Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository (if not already done)

```bash
cd /Users/rahulkumar/Downloads/movies
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it (e.g., `movie-recommendation-app`)
3. **Don't** initialize with README, .gitignore, or license
4. Copy the repository URL

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account

1. Go to [Render](https://render.com)
2. Sign up with your GitHub account (recommended) or email
3. Verify your email if needed

### 2.2 Create New Web Service

1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository: `YOUR_USERNAME/YOUR_REPO_NAME`

### 2.3 Configure Backend Service

Fill in the following details:

- **Name**: `movie-recommendation-api` (or any name you prefer)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Select **"Free"** tier

### 2.4 Add Environment Variables

Click **"Advanced"** and add environment variables:

1. Click **"Add Environment Variable"**
2. Add the following:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | Your Groq API key from [console.groq.com](https://console.groq.com/) |
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render uses this port) |

**Important**: 
- Get your Groq API key from [Groq Console](https://console.groq.com/)
- Click on "API Keys" → "Create API Key"
- Copy the key and paste it in Render

### 2.5 Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your backend
3. Wait for deployment to complete (usually 2-5 minutes)
4. Once deployed, you'll see a URL like: `https://movie-recommendation-api.onrender.com`
5. **Copy this URL** - you'll need it for the frontend

### 2.6 Test Backend

Test your backend health endpoint:
```
https://YOUR-BACKEND-URL.onrender.com/health
```

You should see: `{"status":"ok"}`

**Note**: Free tier on Render spins down after 15 minutes of inactivity. First request after spin-down may take 30-60 seconds.

---

## Step 3: Deploy Frontend to Netlify

### 3.1 Create Netlify Account

1. Go to [Netlify](https://netlify.com)
2. Sign up with your GitHub account (recommended) or email
3. Complete the signup process

### 3.2 Deploy from GitHub

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize Netlify to access your GitHub repositories
4. Select your repository: `YOUR_USERNAME/YOUR_REPO_NAME`

### 3.3 Configure Build Settings

Netlify should auto-detect settings, but verify:

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

### 3.4 Add Environment Variables

1. Click **"Show advanced"** or go to **"Site settings"** → **"Environment variables"**
2. Add the following:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://YOUR-BACKEND-URL.onrender.com/api` |

**Important**: Replace `YOUR-BACKEND-URL` with the actual URL from Step 2.5

Example:
```
VITE_API_URL=https://movie-recommendation-api.onrender.com/api
```

### 3.5 Deploy

1. Click **"Deploy site"**
2. Wait for build to complete (usually 1-2 minutes)
3. Once deployed, you'll get a URL like: `https://random-name-12345.netlify.app`
4. Click on the URL to open your app

### 3.6 Custom Domain (Optional)

1. Go to **"Site settings"** → **"Domain management"**
2. Click **"Add custom domain"**
3. Follow instructions to add your domain

---

## Step 4: Update CORS Settings (If Needed)

If you encounter CORS errors, update the backend CORS configuration:

1. Go to Render dashboard
2. Find your backend service
3. Go to **"Environment"** tab
4. Add environment variable:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | Your Netlify URL (e.g., `https://your-app.netlify.app`) |

Then update `backend/server.js` to use this:

```javascript
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || true
});
```

---

## Step 5: Verify Deployment

### 5.1 Test Frontend

1. Open your Netlify URL
2. Enter a movie preference (e.g., "sci-fi movies")
3. Click "Get Recommendations"
4. Verify recommendations appear

### 5.2 Test Backend Directly

Test the API endpoint:
```bash
curl -X POST https://YOUR-BACKEND-URL.onrender.com/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"userInput": "action movies"}'
```

---

## Troubleshooting

### Backend Issues

**Problem**: Backend returns 502 or timeout
- **Solution**: Free tier spins down after inactivity. Wait 30-60 seconds for first request

**Problem**: "Groq API key is not configured"
- **Solution**: Verify `GROQ_API_KEY` is set in Render environment variables

**Problem**: Database errors
- **Solution**: SQLite database is stored on Render's filesystem. It persists but may reset on redeploy

### Frontend Issues

**Problem**: "Failed to fetch" or CORS errors
- **Solution**: 
  1. Verify `VITE_API_URL` is set correctly in Netlify
  2. Check backend CORS settings
  3. Ensure backend URL includes `/api` path

**Problem**: Build fails on Netlify
- **Solution**: 
  1. Check build logs in Netlify dashboard
  2. Verify `package.json` has correct build script
  3. Ensure all dependencies are listed

### General Issues

**Problem**: Changes not reflecting
- **Solution**: 
  1. Push changes to GitHub
  2. Render and Netlify auto-deploy on push
  3. Check deployment logs

**Problem**: API calls fail
- **Solution**: 
  1. Verify backend is running (check Render dashboard)
  2. Test backend URL directly
  3. Check browser console for errors

---

## Updating Your Deployment

### Making Changes

1. Make changes locally
2. Test locally
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
4. Render and Netlify will automatically redeploy

### Updating Environment Variables

**Render (Backend)**:
1. Go to Render dashboard
2. Select your service
3. Go to **"Environment"** tab
4. Update variables and save
5. Service will restart automatically

**Netlify (Frontend)**:
1. Go to Netlify dashboard
2. Select your site
3. Go to **"Site settings"** → **"Environment variables"**
4. Update variables
5. Trigger a new deploy (or push a commit)

---

## Cost

Both services offer free tiers:

- **Render Free Tier**:
  - 750 hours/month (enough for 24/7)
  - Spins down after 15 min inactivity
  - Free SSL

- **Netlify Free Tier**:
  - 100 GB bandwidth/month
  - 300 build minutes/month
  - Free SSL
  - Custom domains

---

## Alternative Free Backend Hosting

If Render doesn't work for you, consider:

1. **Railway** (https://railway.app) - $5/month free credit
2. **Fly.io** (https://fly.io) - Free tier available
3. **Heroku** (https://heroku.com) - No longer free, but has low-cost options
4. **Cyclic** (https://cyclic.sh) - Free tier available

---

## Security Notes

1. **Never commit API keys** to GitHub
2. Always use environment variables
3. The `.env` files are in `.gitignore`
4. Keep your Groq API key secure

---

## Support

If you encounter issues:

1. Check deployment logs in Render/Netlify dashboards
2. Test endpoints directly with curl or Postman
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

## Summary Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] `GROQ_API_KEY` set in Render
- [ ] Backend URL copied
- [ ] Frontend deployed to Netlify
- [ ] `VITE_API_URL` set in Netlify (with backend URL)
- [ ] Tested frontend and backend
- [ ] Everything working!

Congratulations! Your app is now live! 🎉

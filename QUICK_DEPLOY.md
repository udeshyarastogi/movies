# Quick Deployment Guide

## 🚀 Fast Track Deployment

### Prerequisites
- GitHub account
- Groq API key from [console.groq.com](https://console.groq.com/)

---

## Backend Deployment (Render) - 5 minutes

1. **Go to [Render.com](https://render.com)** and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub and select your repository
4. Configure:
   - **Name**: `movie-recommendation-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**
5. Add Environment Variables:
   - `GROQ_API_KEY` = Your Groq API key
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
6. Click **"Create Web Service"**
7. **Wait 2-5 minutes** for deployment
8. **Copy the URL** (e.g., `https://movie-recommendation-api.onrender.com`)

---

## Frontend Deployment (Netlify) - 3 minutes

1. **Go to [Netlify.com](https://netlify.com)** and sign up/login
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub and select your repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://YOUR-BACKEND-URL.onrender.com/api`
   (Replace with your actual backend URL from step above)
6. Click **"Deploy site"**
7. **Wait 1-2 minutes** for deployment
8. **Done!** Your app is live! 🎉

---

## Test Your Deployment

1. Open your Netlify URL
2. Enter a movie preference
3. Click "Get Recommendations"
4. If it works, you're all set!

---

## Troubleshooting

**Backend not responding?**
- Free tier spins down after 15 min inactivity
- First request takes 30-60 seconds

**CORS errors?**
- Verify `VITE_API_URL` includes `/api` at the end
- Check backend URL is correct

**Need more help?**
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide

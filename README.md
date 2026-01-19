# Movie Recommendation App

A web application that recommends movies based on user preferences using Groq API. The app features a React frontend, a Fastify backend, and SQLite database for storing recommendations.

## Features

- 🎬 AI-powered movie recommendations using Groq (Llama 3.1 70B)
- 📝 Simple form interface for entering movie preferences
- 💾 SQLite database to store user inputs and recommendations
- 🎨 Modern, responsive UI design
- 📊 Recommendation history tracking

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Groq API key

## Setup Instructions

### 1. Get Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you'll need it in step 3)

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Set Up Environment Variable

Create a `.env` file in the `backend` directory (or export the environment variable):

```bash
# In backend directory
export GROQ_API_KEY=your_groq_api_key_here
```

Or create a `.env` file:
```
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 5. Run the Application

#### Terminal 1 - Backend Server:
```bash
cd backend
npm start
```

The backend server will run on `http://localhost:3001`

#### Terminal 2 - Frontend Server:
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### 6. Open the Application

Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter a genre or description of movies you'd like to watch (e.g., "action movies with a strong female lead")
2. Click "Get Recommendations"
3. View the AI-generated movie recommendations
4. Each recommendation includes the movie title, year, and reason why it matches your request

## Project Structure

```
movies/
├── backend/
│   ├── server.js          # Fastify server with Groq integration
│   ├── package.json       # Backend dependencies
│   └── movies.db          # SQLite database (created automatically)
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Styles for the app
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## API Endpoints

### POST `/api/recommendations`
Get movie recommendations based on user input.

**Request Body:**
```json
{
  "userInput": "action movies with a strong female lead"
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "title": "Mad Max: Fury Road",
      "year": 2015,
      "reason": "Features Charlize Theron as a powerful female protagonist in an action-packed post-apocalyptic setting"
    },
    ...
  ],
  "userInput": "action movies with a strong female lead"
}
```

### GET `/api/history`
Retrieve the last 50 recommendation requests from the database.

## Database Schema

The SQLite database uses the following schema:

```sql
CREATE TABLE recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_input TEXT NOT NULL,
  recommended_movies TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Technologies Used

- **Frontend:** React 18, Vite
- **Backend:** Node.js, Fastify
- **Database:** SQLite (better-sqlite3)
- **AI:** Groq (Llama 3.1 70B Versatile)
- **Styling:** CSS3 with modern gradients and animations

## Deployment

This app can be deployed to production for free:

- **Frontend**: Deploy to [Netlify](https://netlify.com) (free tier)
- **Backend**: Deploy to [Render](https://render.com) (free tier)

### Quick Deployment Guide

See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for a 5-minute deployment guide.

### Detailed Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive step-by-step instructions including:
- Setting up GitHub repository
- Deploying backend to Render
- Deploying frontend to Netlify
- Environment variable configuration
- Troubleshooting common issues

### Updating Deployed Services

- **Render (Backend)**: See [RENDER_UPDATE_GUIDE.md](./RENDER_UPDATE_GUIDE.md) for how to update your backend
- **Netlify (Frontend)**: Automatically deploys when you push to GitHub, or see Netlify dashboard for manual deploy

## Troubleshooting

### Backend won't start
- Make sure you've set the `GROQ_API_KEY` environment variable
- Check that port 3001 is not already in use
- Verify all dependencies are installed: `cd backend && npm install`

### Frontend won't start
- Check that port 3000 is not already in use
- Verify all dependencies are installed: `cd frontend && npm install`

### No recommendations returned
- Verify your Groq API key is valid and has credits
- Check the backend console for error messages
- Ensure the backend server is running on port 3001

### Deployment Issues
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment-specific troubleshooting
- Verify environment variables are set correctly in your hosting platform
- Check deployment logs in Netlify/Render dashboards

## License

ISC

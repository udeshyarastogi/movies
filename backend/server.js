import Fastify from 'fastify';
import cors from '@fastify/cors';
import Groq from 'groq-sdk';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Fastify
const fastify = Fastify({ logger: true });

// Initialize Groq (API key should be in environment variable)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ''
});

// Initialize SQLite database
const db = new Database(join(__dirname, 'movies.db'));

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_input TEXT NOT NULL,
    recommended_movies TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Register CORS
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || true,
  credentials: true
});

// Health check route
fastify.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// POST route for movie recommendations
fastify.post('/api/recommendations', async (request, reply) => {
  try {
    const { userInput } = request.body;

    if (!userInput || typeof userInput !== 'string' || userInput.trim().length === 0) {
      return reply.status(400).send({ 
        error: 'Please provide a valid user input (genre or description)' 
      });
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return reply.status(500).send({ 
        error: 'Groq API key is not configured. Please set GROQ_API_KEY environment variable.' 
      });
    }

    // Call Groq API to get movie recommendations
    // Using llama-3.3-70b-versatile (replacement for decommissioned llama-3.1-70b-versatile)
    // Can be overridden with GROQ_MODEL environment variable
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    const completion = await groq.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful movie recommendation assistant. When given a genre or description, provide 3-5 movie recommendations in a JSON array format. Each movie should have: title, year, and a brief reason why it matches the request. Return ONLY a valid JSON array, no additional text.'
        },
        {
          role: 'user',
          content: `Recommend 3-5 movies based on: ${userInput}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const recommendationsText = completion.choices[0].message.content.trim();
    
    // Try to parse the JSON response
    let recommendedMovies;
    try {
      // Remove markdown code blocks if present
      const cleanedText = recommendationsText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recommendedMovies = JSON.parse(cleanedText);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = recommendationsText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendedMovies = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse recommendations from Groq response');
      }
    }

    // Ensure it's an array
    if (!Array.isArray(recommendedMovies)) {
      recommendedMovies = [recommendedMovies];
    }

    // Save to database
    const stmt = db.prepare('INSERT INTO recommendations (user_input, recommended_movies) VALUES (?, ?)');
    stmt.run(userInput, JSON.stringify(recommendedMovies));

    return reply.send({
      recommendations: recommendedMovies,
      userInput: userInput
    });

  } catch (error) {
    fastify.log.error('Error in recommendations endpoint:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to get movie recommendations';
    let statusCode = 500;
    
    if (error.message?.includes('API key')) {
      errorMessage = 'Groq API key is invalid or missing';
      statusCode = 500;
    } else if (error.message?.includes('decommissioned') || error.message?.includes('model_decommissioned')) {
      errorMessage = 'The AI model has been updated. Please contact support or check backend configuration.';
      statusCode = 500;
      fastify.log.error('Model decommissioned error - update GROQ_MODEL environment variable');
    } else if (error.message?.includes('parse')) {
      errorMessage = 'Failed to parse AI response. Please try again.';
      statusCode = 500;
    } else if (error.message?.includes('database') || error.message?.includes('SQL')) {
      errorMessage = 'Database error occurred';
      statusCode = 500;
    } else if (error.response) {
      // Groq API error
      errorMessage = `Groq API error: ${error.response.status} - ${error.message}`;
      statusCode = 502;
    }
    
    return reply.status(statusCode).send({ 
      error: errorMessage,
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET route to retrieve recommendation history
fastify.get('/api/history', async (request, reply) => {
  try {
    const stmt = db.prepare('SELECT * FROM recommendations ORDER BY timestamp DESC LIMIT 50');
    const rows = stmt.all();
    
    return reply.send({
      history: rows.map(row => ({
        id: row.id,
        userInput: row.user_input,
        recommendations: JSON.parse(row.recommended_movies),
        timestamp: row.timestamp
      }))
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ 
      error: 'Failed to retrieve history',
      message: error.message 
    });
  }
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Store conversations in memory (en production, utiliser une base de données)
const conversations = new Map();

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// Route de chat principal
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialiser ou récupérer la conversation
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, []);
    }

    const conversationHistory = conversations.get(conversationId);
    conversationHistory.push({
      role: 'user',
      content: message
    });

    // Utiliser OpenAI API si la clé est disponible, sinon réponse par défaut
    let response;
    
    if (process.env.OPENAI_API_KEY) {
      response = await callOpenAI(conversationHistory);
    } else {
      response = getDefaultResponse(message);
    }

    conversationHistory.push({
      role: 'assistant',
      content: response
    });

    // Limiter l'historique à 20 messages
    if (conversationHistory.length > 20) {
      conversationHistory.shift();
      conversationHistory.shift();
    }

    res.json({
      response,
      conversationId,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Erreur lors du traitement de votre message',
      details: error.message 
    });
  }
});

// Appel à OpenAI
async function callOpenAI(messages) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Tu es un agent support client IA bienveillant et professionnel. Tu aides les clients avec leurs questions et problèmes. Réponds toujours en français.'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message);
    return getDefaultResponse(messages[messages.length - 1].content);
  }
}

// Réponses par défaut si pas d'API
function getDefaultResponse(userMessage) {
  const responses = {
    salut: 'Bonjour! Comment puis-je vous aider?',
    aide: 'Je suis ici pour vous aider. Que puis-je faire pour vous?',
    merci: 'De rien! Y a-t-il autre chose?',
    probleme: 'Je suis désolé d\'entendre cela. Pouvez-vous m\'en dire plus?',
    default: 'J\'ai bien reçu votre message. Pouvez-vous me donner plus de détails?'
  };

  const lowerMessage = userMessage.toLowerCase();
  
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  return responses.default;
}

// Récupérer l'historique d'une conversation
app.get('/api/conversation/:id', (req, res) => {
  const { id } = req.params;
  const history = conversations.get(id) || [];
  res.json({ conversationId: id, messages: history });
});

// Nouvelle conversation
app.post('/api/conversation/new', (req, res) => {
  const conversationId = Date.now().toString();
  conversations.set(conversationId, []);
  res.json({ conversationId });
});

// Erreur 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

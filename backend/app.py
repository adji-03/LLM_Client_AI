from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from datetime import datetime
import requests
from dotenv import load_dotenv
import logging

load_dotenv()

app = Flask(__name__)

# Configuration logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration CORS
CORS(app, origins=[os.getenv('FRONTEND_URL', 'http://localhost:3000')])

# Configuration
PORT = int(os.getenv('PORT', 5000))
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
NODE_ENV = os.getenv('NODE_ENV', 'development')

# Vérifier que la clé API est configurée
if not OPENAI_API_KEY:
    logger.warning('⚠️  OPENAI_API_KEY non configurée - Utilisation des réponses par défaut')

# Stockage des conversations en mémoire
conversations = {}


@app.route('/api/health', methods=['GET'])
def health():
    """Route de santé"""
    return jsonify({
        'status': 'Backend is running!',
        'environment': NODE_ENV,
        'openai_configured': bool(OPENAI_API_KEY),
        'conversations_count': len(conversations)
    }), 200


@app.route('/api/chat', methods=['POST'])
def chat():
    """Route principale du chat"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        conversation_id = data.get('conversationId')

        # Validation
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        if not conversation_id:
            return jsonify({'error': 'Conversation ID is required'}), 400
        
        if len(message) > 5000:
            return jsonify({'error': 'Message too long'}), 400

        logger.info(f' Nouveau message: {message[:50]}...')

        # Initialiser ou récupérer la conversation
        if conversation_id not in conversations:
            conversations[conversation_id] = []

        conversation_history = conversations[conversation_id]
        conversation_history.append({
            'role': 'user',
            'content': message
        })

        # Générer une réponse
        if OPENAI_API_KEY:
            response = call_openai(conversation_history)
        else:
            response = get_default_response(message)

        conversation_history.append({
            'role': 'assistant',
            'content': response
        })

        # Limiter l'historique à 20 messages
        if len(conversation_history) > 20:
            conversation_history.pop(0)
            conversation_history.pop(0)

        logger.info(f' Réponse envoyée')

        return jsonify({
            'response': response,
            'conversationId': conversation_id,
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        logger.error(f' Erreur: {str(e)}')
        return jsonify({
            'error': 'Erreur lors du traitement de votre message',
            'details': str(e) if NODE_ENV == 'development' else ''
        }), 500


def call_openai(messages):
    """Appel à l'API OpenAI"""
    try:
        if not OPENAI_API_KEY:
            return get_default_response(messages[-1]['content'])

        headers = {
            'Authorization': f'Bearer {OPENAI_API_KEY}',
            'Content-Type': 'application/json'
        }

        system_prompt = """Tu es un agent de support client IA professionnel, bienveillant et efficace.
Tes responsabilités:
- Écouter attentivement les problèmes des clients
- Fournir des solutions claires et pratiques
- Être empathique et patient

Instructions:
- Réponds TOUJOURS en français
- Utilise un ton professionnel mais amical
- Sois concis mais complet
- Si tu ne sais pas, dis-le honnêtement
- Propose de l'aide supplémentaire à la fin"""

        payload = {
            'model': 'gpt-3.5-turbo',
            'messages': [
                {'role': 'system', 'content': system_prompt},
                *messages
            ],
            'temperature': 0.7,
            'max_tokens': 500
        }

        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            json=payload,
            headers=headers,
            timeout=30
        )

        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        elif response.status_code == 401:
            return 'Erreur: Clé OpenAI invalide'
        elif response.status_code == 429:
            return 'Trop de requêtes. Attendez un moment.'
        else:
            logger.error(f'Erreur OpenAI: {response.status_code}')
            return get_default_response(messages[-1]['content'])

    except requests.Timeout:
        return 'La requête a pris trop de temps. Veuillez réessayer.'
    except Exception as e:
        logger.error(f'Exception OpenAI: {str(e)}')
        return get_default_response(messages[-1]['content'])


def get_default_response(user_message):
    """Réponses par défaut"""
    responses = {
        'salut': 'Bonjour! Comment puis-je vous aider?',
        'aide': 'Je suis ici pour vous aider. Que puis-je faire pour vous?',
        'merci': 'De rien! Y a-t-il autre chose?',
        'probleme': 'Je suis désolé. Pouvez-vous m\'en dire plus?',
    }

    user_lower = user_message.lower()
    for key, response in responses.items():
        if key in user_lower:
            return response

    return 'J\'ai bien reçu votre message. Pouvez-vous me donner plus de détails?'


@app.route('/api/conversation/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    """Récupérer l'historique"""
    history = conversations.get(conversation_id, [])
    return jsonify({
        'conversationId': conversation_id,
        'messages': history
    }), 200


@app.route('/api/conversation/new', methods=['POST'])
def new_conversation():
    """Créer une nouvelle conversation"""
    conversation_id = str(uuid.uuid4())
    conversations[conversation_id] = []
    return jsonify({'conversationId': conversation_id}), 201


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Route not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    print('\n' + '='*50)
    print(' Backend Flask - Support Client IA')
    print('='*50)
    print(f' Port: {PORT}')
    print(f' Environnement: {NODE_ENV}')
    print(f' OpenAI: {"✓ Configuré" if OPENAI_API_KEY else "✗ Non configuré"}')
    print(f' CORS: {os.getenv("FRONTEND_URL", "http://localhost:3000")}')
    print('='*50)
    print(f' Backend: http://0.0.0.0:{PORT}')
    print(f' Health: http://localhost:{PORT}/api/health')
    print('='*50 + '\n')
    
    app.run(
        host='0.0.0.0', 
        port=PORT, 
        debug=NODE_ENV == 'development'
    )
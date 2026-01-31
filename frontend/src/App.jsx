import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  // src/config.js ou en haut de ton composant
//const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://llm-client-ai.onrender.com'


  // Initialiser une nouvelle conversation au chargement
  useEffect(() => {
    initializeConversation()
  }, [])

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const initializeConversation = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/conversation/new`)
      setConversationId(response.data.conversationId)
      setMessages([
        {
          id: 1,
          text: "Bonjour! Je suis votre assistant support client IA. Comment puis-je vous aider?",
          sender: 'assistant'
        }
      ])
      setError('')
    } catch (err) {
      console.error('Erreur lors de l\'initialisation:', err)
      setConversationId(Date.now().toString())
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    
    if (!input.trim() || !conversationId || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: userMessage,
      sender: 'user'
    }])
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/chat`,
        {
          message: userMessage,
          conversationId
        },
        {
          timeout: 60000
        }
      )

      if (response.data.response) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: response.data.response,
          sender: 'assistant'
        }])
      }
    } catch (err) {
      let errorMessage = 'Erreur de connexion au serveur'
      
      if (err.response) {
        errorMessage = err.response.data?.error || errorMessage
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'La requête a dépassé le délai imparti'
      } else if (!window.navigator.onLine) {
        errorMessage = 'Pas de connexion Internet'
      }
      
      setError(errorMessage)
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
        sender: 'assistant'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    initializeConversation()
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-buttons">
          <span style={{ flex: 1, textAlign: 'center' }}>Support Client IA </span>
          <button className="new-chat-btn" onClick={handleNewChat}>
            ↻ Nouveau
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-content">
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={sendMessage} className="input-area">
        <div className="input-group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrivez votre message..."
            disabled={loading || !conversationId}
          />
          <button type="submit" disabled={loading || !conversationId || !input.trim()}>
            {loading ? '...' : 'Envoyer'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default App

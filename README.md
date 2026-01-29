# Application IA Conversationnelle Support Client

Une application complète de support client alimentée par IA avec:
- **Frontend**: React + Vite (JavaScript)
- **Backend**: Flask (Python) 🐍

## 🎯 Fonctionnalités

- **Chat en temps réel** avec IA
- **Historique des conversations** stocké
- **Interface moderne et responsive**
- **Prêt pour production** avec déploiements sur Vercel et Render

## 📋 Structure du Projet

```
├── backend/          # API Flask
│   ├── app.py        # Serveur principal Flask
│   ├── requirements.txt  # Dépendances Python
│   ├── .env.example  # Variables d'environnement
│   └── render.yaml   # Config Render (si tu déploies)
├── frontend/         # Application React
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vercel.json   # Config Vercel
│   └── vite.config.js
└── README.md
```

## 🚀 Installation Locale

### Backend (Python/Flask avec Virtual Environment)

```bash
cd backend

# Windows
run_backend.bat

# macOS/Linux
chmod +x run_backend.sh
./run_backend.sh
```

**Ou manuellement**:
```bash
cd backend

# Créer et activer le venv
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
python app.py
```

Le backend tournera sur `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local

# Modifier .env.local si nécessaire
nano .env.local

# Démarrer l'application
npm run dev
```

L'application tournera sur `http://localhost:3000`

## 🧪 Test Local (Rapide)

**Windows (tout automatique)**:
```bash
start-complete.bat
```

**Windows (Backend seulement)**:
```bash
cd backend
run_backend.bat
```

**macOS/Linux (Backend seulement)**:
```bash
cd backend
chmod +x run_backend.sh
./run_backend.sh
```

**Manuel (Contrôle total - Recommandé)**:
```bash
# Terminal 1: Backend
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Ouvrez http://localhost:3000
```

## 🔧 Configuration IA

### Option 1: Utiliser OpenAI (Recommandé)

1. Créez un compte sur [OpenAI](https://platform.openai.com)
2. Générez une clé API
3. Ajoutez-la à `.env` du backend:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

### Option 2: Mode Fallback

Sans clé OpenAI, l'application fonctionne avec des réponses par défaut.

## 📦 Déploiement

### Déployer le Backend sur Render

1. Créez un compte sur [Render](https://render.com)
2. Connectez votre repository GitHub
3. Créez un nouveau Web Service
4. Sélectionnez le repository et configurez:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Environment Variables**:
     - `OPENAI_API_KEY`: Votre clé OpenAI
     - `FRONTEND_URL`: L'URL de votre frontend Vercel
     - `NODE_ENV`: production
5. Cliquez sur **Deploy**

### Déployer le Frontend sur Vercel

1. Créez un compte sur [Vercel](https://vercel.com)
2. Importez le repository
3. Configurez:
   - **Framework**: Vite
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_BACKEND_URL`: L'URL de votre backend Render (ex: `https://your-app.onrender.com`)
4. Cliquez sur **Deploy**

## 🔗 Lier Frontend et Backend

Après les déploiements:

1. **Mettez à jour le Frontend** (Vercel):
   - Allez à Settings → Environment Variables
   - Modifiez `VITE_BACKEND_URL` avec votre URL Render
   - Redéployez

2. **Mettez à jour le Backend** (Render):
   - Allez à Settings → Environment Variables
   - Modifiez `FRONTEND_URL` avec votre URL Vercel
   - Le service redéploiera automatiquement

3. **Testez l'intégration**:
   - Ouvrez votre application Vercel
   - Envoyez un message
   - Vérifiez les logs du backend pour confirmer la réception

## 🧪 Test Local (Rapide)

**Windows**:
```bash
start.bat
```

**macOS/Linux**:
```bash
chmod +x start.sh
./start.sh
```

**Manuel (Terminal séparé)**:
```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
python app.py

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Ouvrez http://localhost:3000
```

## 📚 Variables d'Environnement

### Backend (.env)
```
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_api_key
FRONTEND_URL=http://localhost:3000
FLASK_ENV=development
```

### Frontend (.env.local)
```
VITE_BACKEND_URL=http://localhost:5000
```

## 🛠️ Architecture

- **Frontend**: React + Vite + Axios (JavaScript)
- **Backend**: Flask + Flask-CORS + python-dotenv (Python 🐍)
- **IA**: OpenAI API (GPT-3.5 Turbo)
- **Isolation**: Virtual Environment Python
- **Stockage**: En mémoire (peut être remplacé par une base de données)
- **Déploiement**: Vercel (Frontend) + Render (Backend)

## 📱 Compatibilité

- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Android)
- ✅ Responsive design

## 🤝 Support

Pour des questions ou des problèmes, consultez:
- [Documentation Flask](https://flask.palletsprojects.com/)
- [Documentation React](https://react.dev/)
- [Documentation OpenAI](https://platform.openai.com/docs)
- [Documentation Render](https://render.com/docs)
- [Documentation Vercel](https://vercel.com/docs)

## 📄 Licence

MIT

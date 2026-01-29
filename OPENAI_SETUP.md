#  Configuration OpenAI

##  Obtenir votre clé API

1. Allez sur https://platform.openai.com/account/api-keys
2. Connectez-vous avec votre compte OpenAI
3. Cliquez sur **"Create new secret key"**
4. Copiez la clé (commence par `sk-`)
5. **⚠️ Ne la partagez jamais!**

## 🔧 Ajouter la clé au projet

### Méthode 1: Fichier .env local (Recommandé)

1. Ouvrez `backend/.env`
2. Remplacez:
   ```
   OPENAI_API_KEY=sk-votre-clé-api-openai-ici
   ```
   Par votre vraie clé:
   ```
   OPENAI_API_KEY=sk-proj-abcd1234...
   ```
3. Sauvegardez
4. Redémarrez le backend

### Méthode 2: Via terminal

```bash
cd backend
# Windows
$env:OPENAI_API_KEY="sk-votre-clé"
# macOS/Linux
export OPENAI_API_KEY="sk-votre-clé"
python app.py
```

## ✅ Vérifier que ça marche

1. Testez le health check:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. Vous devriez voir:
   ```json
   {
     "status": "Backend is running!",
     "openai_configured": true,
     "environment": "development"
   }
   ```

3. Si `"openai_configured": false` → La clé n'est pas configurée

##  Test dans le chat

1. Ouvrez http://localhost:3000
2. Envoyez un message
3. Vous recevrez une vraie réponse IA! 

##  Coûts

- Compte gratuit OpenAI: $5 de crédit
- GPT-3.5 Turbo: ~$0.0005 par 1K tokens
- Très bon marché pour débuter!

## 🆘 Dépannage

**Erreur 401**: Clé API invalide
- Vérifiez que votre clé commence par `sk-`
- Vérifiez qu'il n'y a pas d'espaces

**Erreur 429**: Limite dépassée
- Vous avez dépassé votre quota
- Attendez ou augmentez votre limite sur OpenAI

**Pas de réponse**: La clé n'est pas chargée
- Relancez le backend
- Vérifiez le fichier .env

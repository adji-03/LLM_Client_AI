#!/bin/bash
# Script de développement local

echo "🐍 Démarrage du backend Flask..."
cd backend
pip install -r requirements.txt
python app.py &
BACKEND_PID=$!

echo "⏳ Attendre 2 secondes..."
sleep 2

echo "⚛️ Démarrage du frontend React..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Les deux services sont en cours d'exécution!"
echo ""
echo "🔗 Frontend: http://localhost:3000"
echo "🔗 Backend: http://localhost:5000"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les deux services"
echo ""

wait $BACKEND_PID $FRONTEND_PID

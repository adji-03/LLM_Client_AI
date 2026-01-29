@echo off
REM Script de démarrage pour Windows

echo 🐍 Démarrage du backend Flask...
cd backend
pip install -r requirements.txt
start "Flask Backend" python app.py

echo ⏳ Attendre 2 secondes...
timeout /t 2

echo ⚛️ Démarrage du frontend React...
cd ..\frontend
npm install
start "React Frontend" npm run dev

echo.
echo ✅ Les deux services sont en cours d'exécution!
echo.
echo 🔗 Frontend: http://localhost:3000
echo 🔗 Backend: http://localhost:5000
echo.
echo Fermez les fenêtres pour arrêter les services
pause

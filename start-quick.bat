@echo off
REM Script rapide pour relancer quand tout est déjà installé

echo.
echo ========================================
echo 🚀 Démarrage rapide (services déjà installés)
echo ========================================
echo.

REM Backend
echo Lancement Backend Flask...
start "Backend Flask 🐍" cmd /k "cd backend && venv\Scripts\activate.bat && python app.py"

REM Attendre 2 secondes
timeout /t 2 /nobreak

REM Frontend
echo Lancement Frontend React...
start "Frontend React ⚛️" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Services lancés!
echo.
echo 🔗 Frontend: http://localhost:3000
echo 🔗 Backend: http://localhost:5000
echo.
pause

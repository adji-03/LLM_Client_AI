@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo 🐍 Backend: Installation venv + Python
echo ⚛️  Frontend: Installation npm + React
echo ========================================
echo.

REM Vérifier si les dossiers existent
if not exist "backend" (
    echo ❌ Erreur: Le dossier 'backend' n'existe pas
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Erreur: Le dossier 'frontend' n'existe pas
    pause
    exit /b 1
)

echo ✅ Dossiers trouvés

REM Vérifier Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Erreur: Python n'est pas installé ou pas dans PATH
    pause
    exit /b 1
)
echo ✅ Python détecté

REM Vérifier npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Erreur: npm n'est pas installé
    pause
    exit /b 1
)
echo ✅ npm détecté

echo.
echo Démarrage des services...
echo.

REM Démarrer Backend dans une nouvelle fenêtre avec pause si erreur
echo Lancement du Backend Flask...
start "Backend Flask 🐍" cmd /k "cd backend && python -m venv venv && venv\Scripts\activate.bat && pip install -r requirements.txt --quiet && echo. && echo ✅ Backend prêt! && python app.py"

REM Attendre un peu
timeout /t 4 /nobreak

REM Démarrer Frontend dans une nouvelle fenêtre
echo Lancement du Frontend React...
start "Frontend React ⚛️" cmd /k "cd frontend && npm install && echo. && echo ✅ Frontend prêt! && npm run dev"

echo.
echo ✅ Les deux services démarrent!
echo.
echo 🔗 Frontend: http://localhost:3000
echo 🔗 Backend:  http://localhost:5000
echo.
echo ⏳ Veuillez attendre 10-15 secondes que tout se compile...
echo.
pause


@echo off
chcp 65001 >nul

echo.
echo ========================================
echo 🧪 Test des services
echo ========================================
echo.

REM Tester Backend
echo Vérification du Backend (http://localhost:5000/api/health)...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend: OK
    curl -s http://localhost:5000/api/health
    echo.
) else (
    echo ❌ Backend: Pas de réponse (port 5000)
)

echo.

REM Tester Frontend
echo Vérification du Frontend (http://localhost:3000)...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 2>nul
if %errorlevel% equ 0 (
    echo ✅ Frontend: OK
) else (
    echo ❌ Frontend: Pas de réponse (port 3000)
)

echo.
echo ========================================
echo.
pause

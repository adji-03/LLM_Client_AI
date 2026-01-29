@echo off
REM Script d'activation du venv sur Windows

cd /d C:\Users\hp\Desktop\LLMs\backend
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
) else (
    echo Création du virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
)

echo Virtual environment activé!
pip install -r requirements.txt --quiet
echo Dépendances installées!
python app.py

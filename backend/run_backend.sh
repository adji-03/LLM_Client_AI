#!/bin/bash
# Script d'activation du venv sur macOS/Linux

cd "$(dirname "$0")"

if [ -d "venv/bin" ]; then
    source venv/bin/activate
else
    echo "Création du virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
fi

echo "Virtual environment activé!"
pip install -r requirements.txt -q
echo "Dépendances installées!"
python app.py

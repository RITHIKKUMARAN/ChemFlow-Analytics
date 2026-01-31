@echo off
echo ========================================
echo Chemical Equipment Visualizer Setup
echo ========================================
echo.

echo [1/3] Setting up Backend (Django)...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py makemigrations
python manage.py migrate
echo Backend setup complete!
echo.

cd ..
echo [2/3] Setting up Web Frontend (React)...
cd web-frontend
call npm install
echo Web frontend setup complete!
echo.

cd ..
echo [3/3] Setting up Desktop App (PyQt5)...
cd desktop-app
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
echo Desktop app setup complete!
echo.

cd ..
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To run the application:
echo 1. Backend: cd backend ^&^& venv\Scripts\activate ^&^& python manage.py runserver
echo 2. Web: cd web-frontend ^&^& npm run dev
echo 3. Desktop: cd desktop-app ^&^& venv\Scripts\activate ^&^& python main.py
echo.
pause

# Quick Start Guide
## Chemical Equipment Parameter Visualizer

Get up and running in 5 minutes! ⚡

---

## 🚀 Automated Setup (Recommended)

### Windows
```bash
# Run the setup script
setup.bat
```

### macOS/Linux
```bash
# Make script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

This will automatically set up all three components!

---

## ⚡ Manual Quick Start

### Step 1: Backend (2 minutes)

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux

python manage.py migrate
python manage.py runserver
```

✅ Backend running at `http://localhost:8000`

### Step 2: Web Frontend (1 minute)

**Open a new terminal:**

```bash
cd web-frontend
npm install
npm run dev
```

✅ Web app running at `http://localhost:5173`

### Step 3: Desktop App (1 minute)

**Open another new terminal:**

```bash
cd desktop-app
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
python main.py
```

✅ Desktop app launched!

---

## 🎯 First Steps

### 1. Create an Account
- **Web:** Open `http://localhost:5173` → Click "Get Started"
- **Desktop:** Click "Create New Account" button

### 2. Upload Sample Data
- Use the provided `sample_equipment_data.csv`
- Drag and drop or click "Browse Files"

### 3. Explore Features
- 📊 View interactive charts
- 📋 Browse equipment data table
- 📄 Download PDF report
- 🔄 Check upload history

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Or change port:
python manage.py runserver 8001
```

### Web frontend errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Desktop app won't launch
```bash
# Ensure PyQt5 is installed correctly
pip uninstall PyQt5
pip install PyQt5==5.15.10
```

### CORS errors
- Make sure backend is running on port 8000
- Check `backend/.env` has correct `CORS_ALLOWED_ORIGINS`

---

## 📱 Accessing the Application

### Web Application
1. Open browser: `http://localhost:5173`
2. Register or login
3. Start uploading data!

### Desktop Application
1. Run `python main.py` from desktop-app directory
2. Login window appears
3. Enter credentials or create account

### Admin Panel
1. Open: `http://localhost:8000/admin`
2. Use superuser credentials (create with `python manage.py createsuperuser`)

---

## ✅ Verification Checklist

- [ ] Backend server running (port 8000)
- [ ] Web app running (port 5173)
- [ ] Desktop app launched successfully
- [ ] Can register new user
- [ ] Can login
- [ ] Can upload CSV
- [ ] Charts display correctly
- [ ] Can download PDF
- [ ] History shows uploads

---

## 🎉 You're Ready!

The application is now fully functional. Upload your chemical equipment data and start analyzing!

### What's Next?
- Read full [README.md](README.md) for detailed features
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for development guidelines
- Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for complete overview

---

**Need Help?** 
- Check error messages in terminal
- Review console logs (F12 in browser)
- Ensure all dependencies are installed
- Verify Python 3.9+ and Node.js 16+ are installed

---

**Happy Analyzing! 📊⚗️**

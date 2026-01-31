# ⚗️ ChemFlow Analytics  
**Production-Ready Hybrid Chemical Equipment Analysis Platform**

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://react.dev/)
[![PyQt5](https://img.shields.io/badge/PyQt5-5.15-41CD52.svg)](https://www.riverbankcomputing.com/software/pyqt/)
[![GitHub](https://img.shields.io/badge/GitHub-ChemFlow--Analytics-black.svg)](https://github.com/RITHIKKUMARAN/ChemFlow-Analytics)

---

## 🚀 **What is ChemFlow Analytics?**

**ChemFlow Analytics** is a modern, production-ready hybrid application designed for chemical engineers and researchers to upload, analyze, and visualize chemical equipment parameter data. With stunning animations, interactive charts, and professional PDF reports, it transforms raw CSV data into actionable insights.

### **Key Highlights**
- 🌐 **Web Application** - Beautiful React frontend with GSAP animations
- 🖥️ **Desktop Application** - Native PyQt5 app for offline use
- 🔗 **Unified Backend** - Single Django REST API serving both platforms
- 📊 **Interactive Visualizations** - Chart.js (web) and Matplotlib (desktop)
- 📄 **PDF Reports** - Professional reports with ReportLab
- 🔐 **Secure** - JWT authentication for data privacy

---

## ✨ **Features**

### **Data Management**
- ✅ **CSV Upload** - Drag-and-drop or browse
- ✅ **Smart Parsing** - Pandas-powered data validation
- ✅ **History Management** - Auto-stores last 5 datasets
- ✅ **Real-time Statistics** - Instant calculations

### **Visualizations**
- 📊 **Equipment Distribution** - Pie charts
- 📈 **Flowrate & Pressure Analysis** - Bar charts
- 🌡️ **Temperature Trends** - Line charts
- 🎨 **Interactive & Animated** - GSAP-powered transitions

### **Reporting**
- 📄 **PDF Generation** - Comprehensive reports
- 📥 **One-Click Download** - Save reports locally
- 📋 **Detailed Analytics** - Stats, charts, metadata

### **User Experience**
- 🎬 **Smooth Animations** - GSAP Timeline & ScrollTrigger
- 🎨 **Modern Dark Theme** - Glassmorphism & gradients
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **Fast & Efficient** - Optimized performance

---

## 🏗️ **Architecture**

```
                    ChemFlow Analytics
                           │
                           ▼
              ┌────────────────────────┐
              │   Django REST API      │
              │  (JWT + Pandas + PDF)  │
              └────────────┬───────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌───────────────┐    ┌──────────────┐
        │  React Web    │    │ PyQt5 Desktop│
        │  GSAP + Charts│    │  Matplotlib  │
        └───────────────┘    └──────────────┘
```

---

## 🛠️ **Technology Stack**

### **Backend**
| Technology | Purpose |
|------------|---------|
| Django 4.2 | Web framework |
| Django REST Framework | RESTful API |
| JWT | Authentication |
| Pandas | CSV parsing |
| ReportLab | PDF generation |
| SQLite | Database |

### **Web Frontend**
| Technology | Purpose |
|------------|---------|
| React 18.2 | UI library |
| Vite | Build tool |
| GSAP | Animations |
| Chart.js | Charts |
| Axios | HTTP client |

### **Desktop Frontend**
| Technology | Purpose |
|------------|---------|
| PyQt5 5.15 | GUI framework |
| Matplotlib | Charts |
| Requests | HTTP client |

---

## 📦 **Installation**

### **Quick Start (Automated)**

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### **Manual Setup**

#### **1. Backend Setup**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```
✅ Running on `http://localhost:8000`

#### **2. Web Frontend Setup**
```bash
cd web-frontend
npm install
npm run dev
```
✅ Running on `http://localhost:5173`

#### **3. Desktop App Setup**
```bash
cd desktop-app
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
✅ Application launched!

---

## 🎯 **Usage**

### **1. Create Account**
- Open web app or desktop app
- Click "Get Started" or "Create New Account"
- Enter username, email, password

### **2. Upload Data**
- Use provided `sample_equipment_data.csv` or your own
- Drag-and-drop or click "Browse Files"
- Watch real-time progress bar

### **3. Analyze**
- View interactive charts
- Browse equipment data table
- Check summary statistics

### **4. Download Report**
- Click "Download PDF"
- Comprehensive report with charts and stats

---

## 📊 **CSV Format**

Your CSV must have these columns:

```csv
Equipment_ID,Equipment_Type,Flowrate,Pressure,Temperature
EQ001,Reactor,150.5,25.3,350.2
EQ002,Heat Exchanger,200.8,30.5,280.5
EQ003,Pump,180.2,45.8,120.3
...
```

---

## 🎨 **Screenshots**

### **Web Application**
- **Landing Page**: Animated hero with GSAP
- **Dashboard**: Interactive charts and data table
- **Upload**: Drag-and-drop with progress

### **Desktop Application**
- **Login**: Modern dark theme
- **Dashboard**: Statistics cards and Matplotlib charts
- **Data Table**: Sortable equipment list

---

## 🔒 **Security**

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - Django's built-in security
- ✅ **CORS Protection** - Configured for safety
- ✅ **Input Validation** - Pandas data validation
-✅ **Environment Variables** - No hardcoded secrets

---

## 🚀 **Deployment**

### **Backend (Django)**
- **Platforms**: Render, Heroku, AWS EC2
- **Database**: Switch to PostgreSQL/MySQL
- **Server**: Gunicorn or uWSGI

### **Web Frontend (React)**
- **Platforms**: Vercel, Netlify, AWS S3
- **Build**: `npm run build`
- **Deploy**: Upload `dist/` folder

### **Desktop App**
- **Build**: `pyinstaller --onefile --windowed main.py`
- **Distribute**: Share executable

---

## 📚 **Documentation**

- 📖 **[README.md](README.md)** - Complete user guide
- 🛠️ **[DEVELOPMENT.md](DEVELOPMENT.md)** - Developer documentation
- ⚡ **[QUICKSTART.md](QUICKSTART.md)** - 5-minute quick start
- 📋 **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 **License**

This project is licensed under the MIT License.

---

## 👥 **Credits**

**Developed by**: [Rithik Kumaran](https://github.com/RITHIKKUMARAN)

**Technologies Used**:
- Django & Django REST Framework
- React & GSAP
- PyQt5 & Matplotlib
- Chart.js & ReportLab

---

## 🌟 **Star This Repo!**

If you find ChemFlow Analytics useful, please give it a ⭐ on GitHub!

---

## 📞 **Support**

- 🐛 **Issues**: [GitHub Issues](https://github.com/RITHIKKUMARAN/ChemFlow-Analytics/issues)
- 📧 **Email**: Contact via GitHub profile

---

## 🎉 **Get Started Now!**

```bash
git clone https://github.com/RITHIKKUMARAN/ChemFlow-Analytics.git
cd ChemFlow-Analytics
./setup.sh  # or setup.bat on Windows
```

**Transform your chemical equipment data analysis today!** ⚗️📊

---

© 2026 ChemFlow Analytics | Hybrid Application

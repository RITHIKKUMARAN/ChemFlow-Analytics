# Chemical Equipment Parameter Visualizer
## Hybrid Web + Desktop Application

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![Django](https://img.shields.io/badge/Django-4.2-green.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)
![PyQt5](https://img.shields.io/badge/PyQt5-5.15-41CD52.svg)

A production-ready hybrid application for uploading, analyzing, and visualizing chemical equipment parameter data. Features a **Django REST API** backend, **React web frontend** with GSAP animations, and a **PyQt5 desktop application**.

---

## 🎯 Features

### Core Functionality
- ✅ **CSV Upload & Parsing** - Upload equipment data via drag-and-drop or file browser
- ✅ **Real-time Statistics** - Automatic computation of averages and distributions
- ✅ **Interactive Charts** - Dynamic visualizations with Chart.js (web) and Matplotlib (desktop)
- ✅ **PDF Reports** - Downloadable professional reports with ReportLab
- ✅ **History Management** - Automatic storage of last 5 datasets
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Dual Platform Support** - Web and desktop apps sharing the same API

### Web Frontend (React + GSAP)
- 🎬 **Animated Landing Page** with GSAP Timeline and ScrollTrigger
- 🎨 **Modern Dark Theme** with vibrant gradients and glassmorphism
- 🔄 **3D Hover Effects** on feature cards
- 📊 **Chart.js Visualizations** (Pie, Bar, Line charts)
- 📱 **Fully Responsive** design for all screen sizes
- ⚡ **Smooth Animations** throughout the user experience

### Desktop Frontend (PyQt5)
- 🖥️ **Native Desktop UI** with modern dark theme
- 📈 **Matplotlib Charts** embedded in Qt widgets
- 📋 **Data Table View** with sortable columns
- 🔐 **Secure Login** with registration support
- 📥 **CSV Upload Dialog** with progress feedback
- 📄 **PDF Download** with file save dialog

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              Django REST API Backend            │
│         (SQLite, Pandas, ReportLab, JWT)        │
│                                                 │
└────────────┬──────────────────────┬─────────────┘
             │                      │
             │   HTTP REST API      │
             │                      │
    ┌────────▼────────┐    ┌────────▼────────┐
    │                 │    │                 │
    │   React Web     │    │  PyQt5 Desktop  │
    │   (GSAP+Charts) │    │  (Matplotlib)   │
    │                 │    │                 │
    └─────────────────┘    └─────────────────┘
```

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login and get JWT tokens |
| `POST` | `/api/upload-csv` | Upload CSV file |
| `GET` | `/api/summary?dataset_id=<id>` | Get statistics summary |
| `GET` | `/api/history` | Get upload history |
| `GET` | `/api/dataset/<id>` | Get dataset details |
| `GET` | `/api/report/pdf?dataset_id=<id>` | Download PDF report |

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+**
- **Node.js 16+** and **npm**
- **Git** (for version control)

### 1️⃣ Backend Setup (Django)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
copy .env.example .env
# Edit .env and set SECRET_KEY

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

Backend will run at `http://localhost:8000`

### 2️⃣ Web Frontend Setup (React)

```bash
# Navigate to web frontend directory
cd web-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Web app will run at `http://localhost:5173`

### 3️⃣ Desktop App Setup (PyQt5)

```bash
# Navigate to desktop app directory
cd desktop-app

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run desktop application
python main.py
```

---

## 📊 Sample Data

A sample CSV file (`sample_equipment_data.csv`) is included in the root directory with the following structure:

```csv
Equipment_ID,Equipment_Type,Flowrate,Pressure,Temperature
EQ001,Reactor,150.5,25.3,350.2
EQ002,Heat Exchanger,200.8,30.5,280.5
...
```

### CSV Format Requirements
- **Equipment_ID**: Unique identifier
- **Equipment_Type**: Type of equipment (e.g., Reactor, Pump, Valve)
- **Flowrate**: Numeric value
- **Pressure**: Numeric value
- **Temperature**: Numeric value

---

## 🎨 Web Frontend Structure

```
web-frontend/
├── src/
│   ├── pages/
│   │   ├── LandingPage.jsx    # Animated landing with GSAP
│   │   ├── LoginPage.jsx      # Login with JWT auth
│   │   ├── RegisterPage.jsx   # Registration form
│   │   └── Dashboard.jsx      # Main dashboard
│   ├── components/
│   │   ├── UploadCSV.jsx      # Drag-and-drop upload
│   │   ├── Charts.jsx         # Chart.js visualizations
│   │   ├── DataTable.jsx      # Sortable table
│   │   └── HistoryPanel.jsx   # Upload history
│   ├── utils/
│   │   └── api.js             # Axios API client
│   ├── App.jsx                # Router configuration
│   ├── main.jsx               # Entry point
│   └── index.css              # Design system
├── package.json
├── vite.config.js
└── index.html
```

---

## 🖥️ Desktop App Structure

```
desktop-app/
├── windows/
│   ├── login_window.py        # Login UI
│   └── main_window.py         # Dashboard UI
├── widgets/
│   └── chart_widgets.py       # Matplotlib charts
├── utils/
│   └── api_client.py          # HTTP client
├── dialogs/                   # (Reserved for future dialogs)
├── main.py                    # Entry point
└── requirements.txt
```

---

## 🔐 Environment Variables

### Backend (`.env`)
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Web Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8000
```

---

## 📦 Deployment

### Backend (Django)
- Use **Gunicorn** or **uWSGI** for production
- Deploy on **Render**, **Heroku**, or **AWS EC2**
- Set `DEBUG=False` and configure `ALLOWED_HOSTS`
- Use PostgreSQL or MySQL for production database

### Web Frontend (React)
- Build production bundle: `npm run build`
- Deploy on **Vercel**, **Netlify**, or **AWS S3 + CloudFront**
- Update `VITE_API_URL` to production backend URL

### Desktop App
- Create executable with **PyInstaller**:
  ```bash
  pyinstaller --onefile --windowed main.py
  ```
- Distribute `.exe` (Windows) or `.app` (macOS)

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] CSV upload (drag-and-drop and file browser)
- [ ] Data visualization on web and desktop
- [ ] PDF report download
- [ ] History management (5 dataset limit)
- [ ] Error handling for invalid CSV

---

## 🛠️ Tech Stack

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework** - API
- **djangorestframework-simplejwt** - JWT authentication
- **Pandas** - CSV parsing
- **ReportLab** - PDF generation
- **SQLite** - Database (development)

### Web Frontend
- **React 18.2** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Chart.js + react-chartjs-2** - Charts
- **GSAP** - Animations

### Desktop Frontend
- **PyQt5** - GUI framework
- **Matplotlib** - Charts
- **Requests** - HTTP client

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🐛 Known Issues & Future Enhancements

### Known Issues
- Desktop app may require manual API URL configuration
- First-time chart rendering may be slow on large datasets

### Future Enhancements
- [ ] Real-time data updates with WebSockets
- [ ] Export to Excel functionality
- [ ] Custom chart configurations
- [ ] Multi-user collaboration
- [ ] Cloud storage integration

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

## 🙏 Acknowledgments

- **Django** team for the excellent web framework
- **React** team for the powerful UI library
- **GSAP** for stunning animations
- **Chart.js** for beautiful charts
- **PyQt** for desktop GUI capabilities

---

**Made with ❤️ for Chemical Equipment Analysis**

© 2026 Chemical Equipment Visualizer | Hybrid Application

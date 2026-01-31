# Development Guide
## Chemical Equipment Parameter Visualizer

This guide provides detailed information for developers working on this project.

---

## 🏗️ Project Structure

```
chemical-equipment-visualizer/
├── backend/                    # Django REST API
│   ├── backend/               # Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py        # Main configuration
│   │   ├── urls.py            # Root URL routing
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── api/                   # Main API application
│   │   ├── __init__.py
│   │   ├── models.py          # Database models
│   │   ├── serializers.py     # DRF serializers
│   │   ├── views.py           # API endpoints
│   │   ├── urls.py            # API routing
│   │   ├── utils.py           # Helper functions
│   │   └── admin.py           # Admin configuration
│   ├── manage.py              # Django management script
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── web-frontend/              # React Web Application
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/       # Reusable components
│   │   │   ├── UploadCSV.jsx
│   │   │   ├── Charts.jsx
│   │   │   ├── DataTable.jsx
│   │   │   └── HistoryPanel.jsx
│   │   ├── utils/           # Utilities
│   │   │   └── api.js       # API client
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html           # HTML template
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   └── .env                 # Environment variables
│
├── desktop-app/              # PyQt5 Desktop Application
│   ├── windows/             # Window components
│   │   ├── login_window.py
│   │   └── main_window.py
│   ├── widgets/             # Custom widgets
│   │   └── chart_widgets.py
│   ├── utils/               # Utilities
│   │   └── api_client.py    # API client
│   ├── dialogs/             # Dialog components
│   ├── main.py              # Entry point
│   └── requirements.txt     # Python dependencies
│
├── sample_equipment_data.csv  # Sample dataset
├── README.md                  # User documentation
├── PROJECT_SUMMARY.md         # Project overview
├── DEVELOPMENT.md             # This file
├── .gitignore                 # Git ignore patterns
├── setup.bat                  # Windows setup script
└── setup.sh                   # Linux/macOS setup script
```

---

## 🔧 Development Setup

### Prerequisites
- Python 3.9 or higher
- Node.js 16 or higher
- Git
- Code editor (VS Code recommended)

### Backend Development

```bash
# Create virtual environment
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up database
python manage.py makemigrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

**Development URLs:**
- API: `http://localhost:8000/api/`
- Admin: `http://localhost:8000/admin/`

### Web Frontend Development

```bash
# Install dependencies
cd web-frontend
npm install

# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Development URL:** `http://localhost:5173`

### Desktop App Development

```bash
# Create virtual environment
cd desktop-app
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run application
python main.py
```

---

## 📝 Coding Standards

### Python (Backend & Desktop)

**Style Guide:** PEP 8

```python
# Use descriptive names
def compute_statistics(dataset_id):
    """
    Compute summary statistics for a dataset
    
    Args:
        dataset_id: ID of the Dataset object
        
    Returns:
        dict: Summary statistics
    """
    pass

# Type hints where applicable
def parse_csv_file(csv_file: UploadedFile) -> Tuple[bool, Union[DataFrame, str]]:
    pass

# Use list comprehensions
equipment_ids = [eq.equipment_id for eq in equipment_list]

# Proper error handling
try:
    result = api_call()
except SpecificException as e:
    logger.error(f"Error: {e}")
    raise
```

### JavaScript/React (Web Frontend)

**Style Guide:** Airbnb JavaScript Style Guide

```javascript
// Use functional components with hooks
function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return <div>...</div>;
}

// Destructure props
const { username, email } = user;

// Use arrow functions for callbacks
const handleClick = () => {
  doSomething();
};

// Proper error handling
try {
  await apiCall();
} catch (error) {
  console.error('Error:', error);
  setError(error.message);
}
```

### CSS

```css
/* Use CSS custom properties */
:root {
  --color-primary: #3b82f6;
  --spacing-md: 1.5rem;
}

/* BEM-like naming for classes */
.component-name__element--modifier {
  /* styles */
}

/* Mobile-first responsive design */
.element {
  /* Mobile styles */
}

@media (min-width: 768px) {
  .element {
    /* Tablet styles */
  }
}
```

---

## 🗄️ Database Schema

### Models

**Dataset**
```python
- id: AutoField (Primary Key)
- user: ForeignKey(User)
- filename: CharField(max_length=255)
- upload_timestamp: DateTimeField(auto_now_add=True)
- total_equipment_count: IntegerField
```

**Equipment**
```python
- id: AutoField (Primary Key)
- dataset: ForeignKey(Dataset, on_delete=CASCADE)
- equipment_id: CharField(max_length=100)
- equipment_type: CharField(max_length=100)
- flowrate: FloatField
- pressure: FloatField
- temperature: FloatField
```

### Relationships
- One User → Many Datasets
- One Dataset → Many Equipment
- Cascade delete: Deleting a Dataset deletes all related Equipment

---

## 🔌 API Reference

### Authentication

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123"
}

Response 201:
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1Q...",
    "refresh": "eyJ0eXAiOiJKV1Q..."
  }
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepass123"
}

Response 200:
{
  "user": { ... },
  "tokens": { ... }
}
```

### Data Operations

**Upload CSV**
```http
POST /api/upload-csv
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <csv_file>

Response 201:
{
  "message": "CSV uploaded successfully",
  "dataset": { ... },
  "statistics": { ... }
}
```

**Get Summary**
```http
GET /api/summary?dataset_id=1
Authorization: Bearer <access_token>

Response 200:
{
  "total_equipment": 25,
  "avg_flowrate": 185.23,
  "avg_pressure": 32.45,
  "avg_temperature": 245.67,
  "equipment_type_distribution": { ... },
  "dataset_info": { ... },
  "equipment_data": [ ... ]
}
```

---

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
python manage.py test

# Run specific test
python manage.py test api.tests.TestCSVUpload

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend Tests

```bash
# Install testing libraries
npm install --save-dev @testing-library/react vitest

# Run tests
npm run test
```

### Manual Testing Checklist

- [ ] User registration
- [ ] User login/logout
- [ ] CSV upload (valid file)
- [ ] CSV upload (invalid file)
- [ ] CSV upload (duplicate data)
- [ ] Statistics display
- [ ] Chart rendering
- [ ] Data table sorting
- [ ] Data table filtering
- [ ] History navigation
- [ ] PDF download
- [ ] Dataset auto-deletion (6th upload)
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Error handling (network errors)
- [ ] Token expiration handling

---

## 🎨 Adding New Features

### Adding a New API Endpoint

1. **Define Model (if needed)** in `api/models.py`
2. **Create Serializer** in `api/serializers.py`
3. **Implement View** in `api/views.py`
4. **Add URL Route** in `api/urls.py`
5. **Update Frontend API Client** in `web-frontend/src/utils/api.js`
6. **Update Desktop API Client** in `desktop-app/utils/api_client.py`

### Adding a New React Component

1. **Create Component File** in `src/components/`
2. **Import and Use** in parent component
3. **Add Styles** in component or `index.css`
4. **Add GSAP Animation** if needed

### Adding a New Chart Type

**Web (Chart.js):**
```javascript
import { Scatter } from 'react-chartjs-2';

const data = { ... };
<Scatter data={data} options={options} />
```

**Desktop (Matplotlib):**
```python
class ScatterChartWidget(ChartWidget):
    def plot(self, data):
        ax = self.figure.add_subplot(111)
        ax.scatter(x, y)
        self.canvas.draw()
```

---

## 🐛 Debugging

### Backend
```python
# Use Django debug toolbar
pip install django-debug-toolbar

# Add to INSTALLED_APPS and MIDDLEWARE in settings.py

# Use print statements or logging
import logging
logger = logging.getLogger(__name__)
logger.debug("Debug message")
```

### Web Frontend
```javascript
// Use browser DevTools
console.log('Debug:', variable);

// React DevTools browser extension

// Vite debugging
npm run dev -- --debug
```

### Desktop App
```python
# Use print statements
print(f"Debug: {variable}")

# PyQt debugging
import sys
sys.excepthook = lambda *args: print(args)
```

---

## 📦 Building for Production

### Backend
```bash
# Install production server
pip install gunicorn

# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

### Web Frontend
```bash
# Build production bundle
npm run build

# Output in dist/ directory
# Deploy to Vercel, Netlify, or static hosting
```

### Desktop App
```bash
# Install PyInstaller
pip install pyinstaller

# Create executable
pyinstaller --onefile --windowed --name="ChemicalEquipmentVisualizer" main.py

# Executable in dist/ directory
```

---

## 🔐 Security Best Practices

### Backend
- ✅ Never commit `.env` files
- ✅ Use environment variables for secrets
- ✅ Set `DEBUG=False` in production
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Validate all user inputs
- ✅ Use parameterized queries (Django ORM does this)

### Frontend
- ✅ Store tokens in localStorage (or httpOnly cookies for better security)
- ✅ Clear tokens on logout
- ✅ Validate file uploads client-side
- ✅ Sanitize user inputs
- ✅ Use HTTPS in production

---

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [GSAP Documentation](https://greensock.com/docs/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [PyQt5 Documentation](https://www.riverbankcomputing.com/static/Docs/PyQt5/)
- [Matplotlib Documentation](https://matplotlib.org/stable/contents.html)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure no errors
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Example:**
```
feat(api): Add export to Excel functionality

- Add endpoint for Excel export
- Implement Pandas to_excel conversion
- Update frontend API client

Closes #123
```

---

## 📝 Version History

- **v1.0.0** (2026-01-31) - Initial release
  - Complete Django backend with JWT auth
  - React web frontend with GSAP animations
  - PyQt5 desktop application
  - PDF report generation
  - History management

---

**Happy Coding! 🚀**

/**
 * Main App Component with Routing
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './utils/api';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CustomCursor from './components/CustomCursor';

// Protected Route Component
function ProtectedRoute({ children }) {
    const isAuthenticated = authAPI.isAuthenticated();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Public Route Component (redirect if already authenticated)
function PublicRoute({ children }) {
    const isAuthenticated = authAPI.isAuthenticated();
    return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

function App() {
    return (
        <>
            <CustomCursor />
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <RegisterPage />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreatePrescription from './pages/CreatePrescription';
import EditPrescription from './pages/EditPrescription';
import Navbar from './components/Navbar';
import './App.css';

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Composant pour rediriger les utilisateurs connectés
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

const AppContent = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="App">
            {isAuthenticated && <Navbar />}
            <Routes>
                <Route 
                    path="/login" 
                    element={
                        <PublicRoute>
                            <LoginPage />
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
                <Route 
                    path="/create-prescription" 
                    element={
                        <ProtectedRoute>
                            <CreatePrescription />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/edit-prescription/:id" 
                    element={
                        <ProtectedRoute>
                            <EditPrescription />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/" 
                    element={<Navigate to="/dashboard" />} 
                />
                <Route 
                    path="*" 
                    element={<Navigate to="/dashboard" />} 
                />
            </Routes>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;

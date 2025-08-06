import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await apiService.getProfile();
                if (response.success) {
                    setUser(response.user);
                } else {
                    localStorage.removeItem('token');
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            const response = await apiService.login(credentials);
            
            if (response.success) {
                localStorage.setItem('token', response.token);
                setUser(response.user);
                return { success: true };
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await apiService.register(userData);
            
            if (response.success) {
                return { success: true, message: response.message };
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await apiService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isDoctor: user?.role === 'doctor',
        isPharmacist: user?.role === 'pharmacist',
        isDriver: user?.role === 'driver',
        isAdmin: user?.role === 'admin',
        isPatient: user?.role === 'patient'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

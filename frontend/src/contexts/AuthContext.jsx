import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

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
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            const token = authService.getToken();
            const savedUser = authService.getCurrentUser();

            if (token && savedUser) {
                // Vérifier si le token est toujours valide
                try {
                    const profileResponse = await authService.getProfile();
                    if (profileResponse.success) {
                        setUser(profileResponse.data.user);
                    } else {
                        // Token invalide, nettoyer le stockage
                        await authService.logout();
                        setUser(null);
                    }
                } catch (error) {
                    // Erreur de vérification, nettoyer le stockage
                    await authService.logout();
                    setUser(null);
                }
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
            setError('Erreur d\'initialisation de l\'authentification');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.login(email, password);
            
            if (result.success) {
                setUser(result.data.user);
                return { success: true };
            } else {
                setError(result.message);
                return { success: false, message: result.message };
            }
        } catch (error) {
            const errorMessage = 'Erreur de connexion';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.register(userData);
            
            if (result.success) {
                setUser(result.data.user);
                return { success: true };
            } else {
                setError(result.message);
                return { success: false, message: result.message };
            }
        } catch (error) {
            const errorMessage = 'Erreur d\'inscription';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();
            setUser(null);
            setError(null);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
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
        clearError: () => setError(null)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

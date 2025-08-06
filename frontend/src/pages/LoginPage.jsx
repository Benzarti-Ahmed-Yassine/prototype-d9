import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    const { login, error, clearError, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Comptes de démonstration
    const demoAccounts = [
        { email: 'doctor@hospital.com', password: 'demo123', role: 'Médecin', name: 'Dr. Jean Dupont' },
        { email: 'pharmacist@pharmacy.com', password: 'demo123', role: 'Pharmacien', name: 'Marie Martin' },
        { email: 'driver@delivery.com', password: 'demo123', role: 'Livreur', name: 'Pierre Durand' },
        { email: 'patient@email.com', password: 'demo123', role: 'Patient', name: 'Sophie Moreau' },
        { email: 'admin@mediflow.com', password: 'demo123', role: 'Admin', name: 'Admin MediFlow' }
    ];

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Effacer les erreurs quand l'utilisateur tape
        if (error) clearError();
        if (localError) setLocalError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setLocalError('Veuillez remplir tous les champs');
            return;
        }

        setIsLoading(true);
        setLocalError('');

        try {
            const result = await login(formData.email, formData.password);
            
            if (result.success) {
                navigate('/dashboard');
            } else {
                setLocalError(result.message || 'Erreur de connexion');
            }
        } catch (err) {
            setLocalError('Erreur de connexion au serveur');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async (demoAccount) => {
        setFormData({
            email: demoAccount.email,
            password: demoAccount.password
        });

        setIsLoading(true);
        try {
            const result = await login(demoAccount.email, demoAccount.password);
            if (result.success) {
                navigate('/dashboard');
            }
        } catch (err) {
            setLocalError('Erreur de connexion avec le compte de démo');
        } finally {
            setIsLoading(false);
        }
    };

    const displayError = error || localError;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        MediFlow
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Plateforme de gestion des médicaments
                    </p>
                </div>

                {/* Formulaire de connexion */}
                <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
                    {displayError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {displayError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Connexion...
                            </div>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>

                {/* Comptes de démonstration */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Comptes de démonstration
                    </h3>
                    <div className="space-y-2">
                        {demoAccounts.map((account, index) => (
                            <button
                                key={index}
                                onClick={() => handleDemoLogin(account)}
                                disabled={isLoading}
                                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-900">{account.name}</p>
                                        <p className="text-sm text-gray-600">{account.role}</p>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {account.email}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        © 2024 MediFlow. Plateforme sécurisée avec blockchain Hedera.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

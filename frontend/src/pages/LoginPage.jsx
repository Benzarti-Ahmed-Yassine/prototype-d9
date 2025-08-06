import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'patient'
    });

    const { login, register, loading, error, clearError } = useAuth();
    const navigate = useNavigate();

    const demoAccounts = [
        { email: 'doctor@hospital.com', password: 'demo123', role: 'Médecin', name: 'Dr. Martin Dubois' },
        { email: 'pharmacist@pharmacy.com', password: 'demo123', role: 'Pharmacien', name: 'Marie Pharmacien' },
        { email: 'driver@delivery.com', password: 'demo123', role: 'Livreur', name: 'Jean Livreur' },
        { email: 'patient@email.com', password: 'demo123', role: 'Patient', name: 'Sophie Patient' },
        { email: 'admin@mediflow.com', password: 'demo123', role: 'Admin', name: 'Admin MediFlow' }
    ];

    const handleLogin = async (e) => {
        e.preventDefault();
        if (clearError) clearError();

        const result = await login(formData);
        if (result.success) {
            navigate('/dashboard');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (clearError) clearError();

        const result = await register(registerData);
        if (result.success) {
            navigate('/dashboard');
        }
    };

    const handleDemoLogin = async (account) => {
        if (clearError) clearError();
        const result = await login({ email: account.email, password: account.password });
        if (result.success) {
            navigate('/dashboard');
        }
    };

    const handleInputChange = (e, isRegister = false) => {
        const { name, value } = e.target;
        if (isRegister) {
            setRegisterData(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {isRegistering ? 'Créer un compte' : 'Connexion à MediFlow'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Plateforme de gestion numérique des médicaments
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="ml-3">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Form */}
                <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
                    {!isRegistering ? (
                        // Login Form
                        <form onSubmit={handleLogin} className="space-y-6">
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
                                    onChange={(e) => handleInputChange(e)}
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
                                    onChange={(e) => handleInputChange(e)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : null}
                                Se connecter
                            </button>
                        </form>
                    ) : (
                        // Register Form
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nom complet
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={registerData.name}
                                    onChange={(e) => handleInputChange(e, true)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Votre nom complet"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={registerData.email}
                                    onChange={(e) => handleInputChange(e, true)}
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
                                    value={registerData.password}
                                    onChange={(e) => handleInputChange(e, true)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    Rôle
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={registerData.role}
                                    onChange={(e) => handleInputChange(e, true)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Médecin</option>
                                    <option value="pharmacist">Pharmacien</option>
                                    <option value="driver">Livreur</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : null}
                                Créer le compte
                            </button>
                        </form>
                    )}

                    {/* Toggle Form */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                clearError();
                            }}
                            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                        >
                            {isRegistering 
                                ? 'Déjà un compte ? Se connecter' 
                                : 'Pas de compte ? S\'inscrire'
                            }
                        </button>
                    </div>
                </div>

                {/* Demo Accounts */}
                {!isRegistering && (
                    <div className="bg-white py-6 px-6 shadow-lg rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Comptes de démonstration</h3>
                        <div className="space-y-2">
                            {demoAccounts.map((account, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDemoLogin(account)}
                                    disabled={loading}
                                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{account.name}</p>
                                            <p className="text-xs text-gray-500">{account.role}</p>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {account.email}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;

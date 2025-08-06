import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getRoleColor = (role) => {
        const colors = {
            doctor: 'bg-blue-100 text-blue-800',
            pharmacist: 'bg-green-100 text-green-800',
            driver: 'bg-yellow-100 text-yellow-800',
            patient: 'bg-purple-100 text-purple-800',
            admin: 'bg-red-100 text-red-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    const getRoleLabel = (role) => {
        const labels = {
            doctor: 'Médecin',
            pharmacist: 'Pharmacien',
            driver: 'Livreur',
            patient: 'Patient',
            admin: 'Administrateur'
        };
        return labels[role] || role;
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo et titre */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">MediFlow</span>
                        </div>
                    </div>

                    {/* Navigation centrale */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Tableau de bord
                        </button>
                        
                        {(user?.role === 'doctor' || user?.role === 'admin') && (
                            <button
                                onClick={() => navigate('/create-prescription')}
                                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Nouvelle prescription
                            </button>
                        )}
                    </div>

                    {/* Profil utilisateur */}
                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="flex items-center space-x-3">
                                {/* Badge du rôle */}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                    {getRoleLabel(user.role)}
                                </span>

                                {/* Informations utilisateur */}
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                    {user.isDemo && (
                                        <p className="text-xs text-orange-600 font-medium">Compte démo</p>
                                    )}
                                </div>

                                {/* Avatar */}
                                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-700">
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>

                                {/* Bouton de déconnexion */}
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors"
                                    title="Se déconnecter"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu mobile */}
            <div className="md:hidden border-t border-gray-200">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md text-base font-medium"
                    >
                        Tableau de bord
                    </button>
                    
                    {(user?.role === 'doctor' || user?.role === 'admin') && (
                        <button
                            onClick={() => navigate('/create-prescription')}
                            className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md text-base font-medium"
                        >
                            Nouvelle prescription
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

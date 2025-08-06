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

    const getRoleDisplayName = (role) => {
        const roleNames = {
            doctor: 'Médecin',
            pharmacist: 'Pharmacien',
            driver: 'Livreur',
            patient: 'Patient',
            admin: 'Administrateur'
        };
        return roleNames[role] || role;
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

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo et titre */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                                </svg>
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">MediFlow</span>
                        </div>

                        {/* Navigation links */}
                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Tableau de bord
                            </button>
                            
                            {(user?.role === 'doctor' || user?.role === 'admin') && (
                                <button
                                    onClick={() => navigate('/create-prescription')}
                                    className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Nouvelle prescription
                                </button>
                            )}
                        </div>
                    </div>

                    {/* User menu */}
                    <div className="flex items-center space-x-4">
                        {/* User info */}
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                    {user?.firstName} {user?.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user?.email}
                                </div>
                            </div>
                            
                            {/* Role badge */}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                                {getRoleDisplayName(user?.role)}
                            </span>
                        </div>

                        {/* User avatar */}
                        <div className="relative">
                            <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {user?.firstName?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Logout button */}
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-indigo-600 hover:bg-gray-50 w-full text-left"
                    >
                        Tableau de bord
                    </button>
                    
                    {(user?.role === 'doctor' || user?.role === 'admin') && (
                        <button
                            onClick={() => navigate('/create-prescription')}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-indigo-600 hover:bg-gray-50 w-full text-left"
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

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { prescriptionService } from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPrescriptions();
    }, []);

    const loadPrescriptions = async () => {
        try {
            setLoading(true);
            const response = await prescriptionService.getAll();
            if (response.success) {
                setPrescriptions(response.data);
            } else {
                setError('Erreur lors du chargement des prescriptions');
            }
        } catch (error) {
            console.error('Error loading prescriptions:', error);
            setError('Erreur lors du chargement des prescriptions');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = {
            active: 'Active',
            completed: 'Terminée',
            cancelled: 'Annulée'
        };
        return labels[status] || status;
    };

    const getDashboardContent = () => {
        switch (user?.role) {
            case 'doctor':
                return (
                    <div className="space-y-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Mes prescriptions
                                </h3>
                                <div className="mt-2 max-w-xl text-sm text-gray-500">
                                    <p>Gérez vos prescriptions et suivez leur statut.</p>
                                </div>
                                <div className="mt-5">
                                    <button
                                        onClick={() => window.location.href = '/create-prescription'}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Nouvelle prescription
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'pharmacist':
                return (
                    <div className="space-y-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Prescriptions à traiter
                                </h3>
                                <div className="mt-2 max-w-xl text-sm text-gray-500">
                                    <p>Validez et préparez les médicaments prescrits.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'driver':
                return (
                    <div className="space-y-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Livraisons en cours
                                </h3>
                                <div className="mt-2 max-w-xl text-sm text-gray-500">
                                    <p>Gérez vos livraisons de médicaments.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'patient':
                return (
                    <div className="space-y-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Mes médicaments
                                </h3>
                                <div className="mt-2 max-w-xl text-sm text-gray-500">
                                    <p>Suivez vos prescriptions et traitements.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'admin':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Utilisateurs actifs
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    156
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Prescriptions totales
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {prescriptions.length}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Transactions Hedera
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    42
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center">
                        <p className="text-gray-500">Rôle non reconnu</p>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Bienvenue, {user?.firstName} {user?.lastName}
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Tableau de bord - {user?.role === 'doctor' ? 'Médecin' : 
                                              user?.role === 'pharmacist' ? 'Pharmacien' :
                                              user?.role === 'driver' ? 'Livreur' :
                                              user?.role === 'patient' ? 'Patient' :
                                              user?.role === 'admin' ? 'Administrateur' : user?.role}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 sm:px-0">
                    {getDashboardContent()}
                </div>

                {/* Prescriptions List */}
                {prescriptions.length > 0 && (
                    <div className="px-4 sm:px-0 mt-8">
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Prescriptions récentes
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Liste des prescriptions dans le système
                                </p>
                            </div>
                            <ul className="divide-y divide-gray-200">
                                {prescriptions.map((prescription) => (
                                    <li key={prescription.id}>
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {prescription.medication}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Patient: {prescription.patientName} • Médecin: {prescription.doctorName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {prescription.dosage} • {prescription.duration}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                                                        {getStatusLabel(prescription.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="px-4 sm:px-0 mt-4">
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { prescriptionService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreatePrescription = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        patientName: '',
        medication: '',
        dosage: '',
        duration: '',
        instructions: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await prescriptionService.create(formData);
            
            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                setError(response.message || 'Erreur lors de la création de la prescription');
            }
        } catch (error) {
            console.error('Create prescription error:', error);
            setError('Erreur lors de la création de la prescription');
        } finally {
            setLoading(false);
        }
    };

    // Vérifier les permissions
    if (user?.role !== 'doctor' && user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Accès non autorisé</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Seuls les médecins peuvent créer des prescriptions.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Retour au tableau de bord
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Prescription créée avec succès</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            La prescription a été enregistrée et auditée sur Hedera.
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                            Redirection automatique vers le tableau de bord...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Nouvelle prescription
                        </h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>Créez une nouvelle prescription pour un patient.</p>
                        </div>

                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
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

                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            <div>
                                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                                    Nom du patient
                                </label>
                                <input
                                    type="text"
                                    name="patientName"
                                    id="patientName"
                                    required
                                    value={formData.patientName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Nom complet du patient"
                                />
                            </div>

                            <div>
                                <label htmlFor="medication" className="block text-sm font-medium text-gray-700">
                                    Médicament
                                </label>
                                <input
                                    type="text"
                                    name="medication"
                                    id="medication"
                                    required
                                    value={formData.medication}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Nom du médicament et dosage"
                                />
                            </div>

                            <div>
                                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
                                    Posologie
                                </label>
                                <input
                                    type="text"
                                    name="dosage"
                                    id="dosage"
                                    required
                                    value={formData.dosage}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Ex: 1 comprimé 3 fois par jour"
                                />
                            </div>

                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                    Durée du traitement
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    id="duration"
                                    required
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Ex: 7 jours"
                                />
                            </div>

                            <div>
                                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                                    Instructions supplémentaires
                                </label>
                                <textarea
                                    name="instructions"
                                    id="instructions"
                                    rows={3}
                                    value={formData.instructions}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Instructions particulières pour le patient..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Création...
                                        </>
                                    ) : (
                                        'Créer la prescription'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePrescription;

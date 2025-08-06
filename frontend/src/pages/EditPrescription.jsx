import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { prescriptionService } from '../services/api';

const EditPrescription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [prescription, setPrescription] = useState(null);

    const [formData, setFormData] = useState({
        patientName: '',
        patientAge: '',
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        deliveryAddress: '',
        status: 'pending'
    });

    useEffect(() => {
        loadPrescription();
    }, [id]);

    const loadPrescription = async () => {
        try {
            setLoading(true);
            const response = await prescriptionService.getById(id);
            
            if (response.success) {
                const data = response.data;
                setPrescription(data);
                setFormData({
                    patientName: data.patientName || '',
                    patientAge: data.patientAge || '',
                    medication: data.medication || '',
                    dosage: data.dosage || '',
                    frequency: data.frequency || '',
                    duration: data.duration || '',
                    instructions: data.instructions || '',
                    deliveryAddress: data.deliveryAddress || '',
                    status: data.status || 'pending'
                });
            } else {
                setError('Prescription non trouvée');
            }
        } catch (error) {
            console.error('Error loading prescription:', error);
            setError('Erreur lors du chargement de la prescription');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const response = await prescriptionService.update(id, formData);
            
            if (response.success) {
                navigate('/dashboard', { 
                    state: { message: 'Prescription mise à jour avec succès' }
                });
            } else {
                setError(response.message || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Update prescription error:', error);
            setError('Erreur lors de la mise à jour de la prescription');
        } finally {
            setSaving(false);
        }
    };

    // Vérifier les permissions
    if (!loading && prescription && user?.role === 'doctor' && prescription.doctorId !== user.id) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Accès non autorisé</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Vous ne pouvez modifier que vos propres prescriptions.
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error && !prescription) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Erreur</h3>
                        <p className="mt-1 text-sm text-gray-500">{error}</p>
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

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Modifier la prescription
                                </h3>
                                <div className="mt-2 max-w-xl text-sm text-gray-500">
                                    <p>Modifiez les détails de la prescription.</p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                ID: {prescription?.id}
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    />
                                </div>

                                <div>
                                    <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700">
                                        Âge du patient
                                    </label>
                                    <input
                                        type="number"
                                        name="patientAge"
                                        id="patientAge"
                                        required
                                        min="1"
                                        max="120"
                                        value={formData.patientAge}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
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
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
                                        Dosage
                                    </label>
                                    <input
                                        type="text"
                                        name="dosage"
                                        id="dosage"
                                        required
                                        value={formData.dosage}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Ex: 500mg"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                                        Fréquence
                                    </label>
                                    <input
                                        type="text"
                                        name="frequency"
                                        id="frequency"
                                        required
                                        value={formData.frequency}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Ex: 3 fois par jour"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                        Durée
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
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Statut
                                </label>
                                <select
                                    name="status"
                                    id="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="pending">En attente</option>
                                    <option value="approved">Approuvée</option>
                                    <option value="dispensed">Dispensée</option>
                                    <option value="delivered">Livrée</option>
                                    <option value="completed">Terminée</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                                    Instructions
                                </label>
                                <textarea
                                    name="instructions"
                                    id="instructions"
                                    rows={3}
                                    value={formData.instructions}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Instructions particulières..."
                                />
                            </div>

                            <div>
                                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
                                    Adresse de livraison
                                </label>
                                <textarea
                                    name="deliveryAddress"
                                    id="deliveryAddress"
                                    rows={2}
                                    value={formData.deliveryAddress}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Adresse complète de livraison..."
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
                                    disabled={saving}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sauvegarde...
                                        </>
                                    ) : (
                                        'Sauvegarder les modifications'
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

export default EditPrescription;

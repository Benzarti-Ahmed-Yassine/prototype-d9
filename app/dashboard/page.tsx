'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Pill, Users, Truck, Activity } from 'lucide-react'
import Link from 'next/link'

interface Prescription {
  id: number
  patientName: string
  medication: string
  dosage: string
  duration: string
  doctorName: string
  status: 'active' | 'completed' | 'cancelled'
  createdAt: string
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPrescriptions()
  }, [])

  const loadPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPrescriptions(data)
      }
    } catch (error) {
      console.error('Error loading prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'completed': return 'Terminée'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'doctor': return 'Médecin'
      case 'pharmacist': return 'Pharmacien'
      case 'driver': return 'Livreur'
      case 'patient': return 'Patient'
      case 'admin': return 'Administrateur'
      default: return role
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Pill className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">MediFlow</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.name} ({getRoleLabel(user?.role || '')})
              </span>
              <Button variant="outline" onClick={logout}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenue, {user?.name}
            </h1>
            <p className="mt-2 text-gray-600">
              Tableau de bord - {getRoleLabel(user?.role || '')}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 sm:px-0 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Pill className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Prescriptions</p>
                    <p className="text-2xl font-semibold text-gray-900">{prescriptions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Actives</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {prescriptions.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Patients</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {new Set(prescriptions.map(p => p.patientName)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Truck className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Terminées</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {prescriptions.filter(p => p.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        {user?.role === 'doctor' && (
          <div className="px-4 sm:px-0 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>Gérez vos prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/prescriptions/create">
                  <Button className="inline-flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle prescription
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Prescriptions List */}
        <div className="px-4 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle>Prescriptions récentes</CardTitle>
              <CardDescription>Liste des prescriptions dans le système</CardDescription>
            </CardHeader>
            <CardContent>
              {prescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune prescription trouvée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{prescription.medication}</h3>
                          <p className="text-sm text-gray-500">
                            Patient: {prescription.patientName} • Médecin: {prescription.doctorName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {prescription.dosage} • {prescription.duration}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(prescription.status)}>
                            {getStatusLabel(prescription.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

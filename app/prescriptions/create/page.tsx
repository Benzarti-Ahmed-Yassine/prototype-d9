'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreatePrescriptionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.message || 'Erreur lors de la création de la prescription')
      }
    } catch (error) {
      console.error('Create prescription error:', error)
      setError('Erreur lors de la création de la prescription')
    } finally {
      setLoading(false)
    }
  }

  // Vérifier les permissions
  if (user?.role !== 'doctor' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Accès non autorisé</h3>
            <p className="text-gray-500 mb-4">
              Seuls les médecins peuvent créer des prescriptions.
            </p>
            <Link href="/dashboard">
              <Button>Retour au tableau de bord</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-green-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Prescription créée avec succès</h3>
            <p className="text-gray-500 mb-2">
              La prescription a été enregistrée et auditée sur Hedera.
            </p>
            <p className="text-xs text-gray-400">
              Redirection automatique vers le tableau de bord...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" className="inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nouvelle prescription</CardTitle>
            <CardDescription>Créez une nouvelle prescription pour un patient</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="patientName">Nom du patient</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={handleInputChange}
                    placeholder="Nom complet du patient"
                  />
                </div>

                <div>
                  <Label htmlFor="patientAge">Âge du patient</Label>
                  <Input
                    id="patientAge"
                    name="patientAge"
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={formData.patientAge}
                    onChange={handleInputChange}
                    placeholder="Âge"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="medication">Médicament</Label>
                <Input
                  id="medication"
                  name="medication"
                  type="text"
                  required
                  value={formData.medication}
                  onChange={handleInputChange}
                  placeholder="Nom du médicament et dosage"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    type="text"
                    required
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="Ex: 500mg"
                  />
                </div>

                <div>
                  <Label htmlFor="frequency">Fréquence</Label>
                  <Input
                    id="frequency"
                    name="frequency"
                    type="text"
                    required
                    value={formData.frequency}
                    onChange={handleInputChange}
                    placeholder="Ex: 3 fois par jour"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Durée</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="text"
                    required
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Ex: 7 jours"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instructions">Instructions supplémentaires</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  rows={3}
                  value={formData.instructions}
                  onChange={handleInputChange}
                  placeholder="Instructions particulières pour le patient..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Link href="/dashboard">
                  <Button variant="outline">Annuler</Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Création...' : 'Créer la prescription'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

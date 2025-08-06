import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Mock database for prescriptions
let prescriptions: any[] = [
  {
    id: 1,
    doctorId: 1,
    doctorName: 'Dr. Martin Dubois',
    patientName: 'Jean Dupont',
    patientEmail: 'jean.dupont@email.com',
    diagnosis: 'Infection respiratoire',
    medications: [
      {
        name: 'Amoxicilline',
        dosage: '500mg',
        frequency: '3x/jour',
        duration: '7 jours',
        instructions: 'À prendre avec de la nourriture'
      }
    ],
    status: 'active',
    createdAt: new Date().toISOString(),
    hederaTransactionId: 'demo-tx-001'
  }
]

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json(
      { message: 'Token invalide' },
      { status: 401 }
    )
  }

  // Filter prescriptions based on user role
  let filteredPrescriptions = prescriptions
  if (user.role === 'doctor') {
    filteredPrescriptions = prescriptions.filter(p => p.doctorId === user.id)
  } else if (user.role === 'patient') {
    filteredPrescriptions = prescriptions.filter(p => p.patientEmail === user.email)
  }

  return NextResponse.json({
    prescriptions: filteredPrescriptions
  })
}

export async function POST(request: NextRequest) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json(
      { message: 'Token invalide' },
      { status: 401 }
    )
  }

  if (user.role !== 'doctor') {
    return NextResponse.json(
      { message: 'Seuls les médecins peuvent créer des prescriptions' },
      { status: 403 }
    )
  }

  try {
    const { patientName, patientEmail, diagnosis, medications } = await request.json()

    if (!patientName || !patientEmail || !diagnosis || !medications || medications.length === 0) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    const newPrescription = {
      id: prescriptions.length + 1,
      doctorId: user.id,
      doctorName: user.name,
      patientName,
      patientEmail,
      diagnosis,
      medications,
      status: 'active',
      createdAt: new Date().toISOString(),
      hederaTransactionId: `demo-tx-${Date.now()}`
    }

    prescriptions.push(newPrescription)

    return NextResponse.json({
      message: 'Prescription créée avec succès',
      prescription: newPrescription
    })
  } catch (error) {
    console.error('Create prescription error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

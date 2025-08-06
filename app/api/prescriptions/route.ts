import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'mediflow-secret-key-2024'

// Demo prescriptions data
let prescriptions = [
  {
    id: 1,
    patientName: 'Sophie Patient',
    medication: 'Paracétamol 500mg',
    dosage: '500mg',
    frequency: '3 fois par jour',
    duration: '7 jours',
    doctorName: 'Dr. Martin Dubois',
    doctorId: 1,
    status: 'active',
    createdAt: new Date().toISOString(),
    instructions: 'Prendre après les repas'
  },
  {
    id: 2,
    patientName: 'Jean Dupont',
    medication: 'Amoxicilline 1g',
    dosage: '1g',
    frequency: '2 fois par jour',
    duration: '10 jours',
    doctorName: 'Dr. Martin Dubois',
    doctorId: 1,
    status: 'active',
    createdAt: new Date().toISOString(),
    instructions: 'Traitement antibiotique complet'
  }
]

let nextPrescriptionId = 3

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    throw new Error('Token d\'accès requis')
  }

  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch (error) {
    throw new Error('Token invalide')
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    
    let userPrescriptions = prescriptions

    // Filter based on user role
    if (user.role === 'patient') {
      userPrescriptions = prescriptions.filter(p => 
        p.patientName.toLowerCase().includes(user.name.toLowerCase())
      )
    } else if (user.role === 'doctor') {
      userPrescriptions = prescriptions.filter(p => p.doctorId === user.id)
    }

    return NextResponse.json(userPrescriptions)
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Erreur serveur' },
      { status: error.message === 'Token d\'accès requis' ? 401 : 403 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Seuls les médecins peuvent créer des prescriptions' },
        { status: 403 }
      )
    }

    const { patientName, patientAge, medication, dosage, frequency, duration, instructions } = await request.json()

    if (!patientName || !medication || !dosage || !frequency || !duration) {
      return NextResponse.json(
        { message: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    const newPrescription = {
      id: nextPrescriptionId++,
      patientName,
      patientAge,
      medication,
      dosage,
      frequency,
      duration,
      instructions: instructions || '',
      doctorName: user.name,
      doctorId: user.id,
      status: 'active',
      createdAt: new Date().toISOString()
    }

    prescriptions.push(newPrescription)

    // Simulate Hedera audit
    console.log('Hedera Audit: Prescription created', {
      prescriptionId: newPrescription.id,
      doctorId: user.id,
      patientName: patientName,
      medication: medication,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(newPrescription, { status: 201 })
  } catch (error: any) {
    console.error('Create prescription error:', error)
    return NextResponse.json(
      { message: error.message || 'Erreur serveur' },
      { status: error.message === 'Token d\'accès requis' ? 401 : 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Demo users data
const users = [
  {
    id: 1,
    email: 'doctor@hospital.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // demo123
    role: 'doctor',
    name: 'Dr. Martin Dubois'
  },
  {
    id: 2,
    email: 'pharmacist@pharmacy.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // demo123
    role: 'pharmacist',
    name: 'Marie Pharmacienne'
  },
  {
    id: 3,
    email: 'driver@delivery.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // demo123
    role: 'driver',
    name: 'Jean Livreur'
  },
  {
    id: 4,
    email: 'patient@email.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // demo123
    role: 'patient',
    name: 'Sophie Patient'
  },
  {
    id: 5,
    email: 'admin@mediflow.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // demo123
    role: 'admin',
    name: 'Admin MediFlow'
  }
]

const JWT_SECRET = process.env.JWT_SECRET || 'mediflow-secret-key-2024'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    const user = users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json(
        { message: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json(
        { message: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Simulate Hedera audit
    console.log('Hedera Audit: User login', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

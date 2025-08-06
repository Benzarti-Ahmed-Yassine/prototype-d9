import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'mediflow-secret-key-2024'

// In a real app, this would be stored in a database
let nextUserId = 6

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // In a real app, check if user already exists in database
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = {
      id: nextUserId++,
      email,
      password: hashedPassword,
      name,
      role
    }

    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role,
        name: newUser.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Simulate Hedera audit
    console.log('Hedera Audit: User registration', {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

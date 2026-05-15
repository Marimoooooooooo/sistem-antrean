import { NextResponse } from 'next/server';

// POST /api/auth/login - Admin login
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === adminUsername && password === adminPassword) {
      return NextResponse.json({
        success: true,
        message: 'Login berhasil',
        user: {
          username: adminUsername,
          role: 'admin',
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Username atau password salah.' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

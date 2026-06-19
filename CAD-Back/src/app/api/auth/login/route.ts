import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/crypto';
import { SESSION_COOKIE } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const JWT_SECRET = process.env.JWT_SECRET || 'secret_alfa_cad_2026';
const IS_PROD = process.env.NODE_ENV === 'production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 400 });
    }

    const { email, password } = result.data;

    const user = await prisma.adminUser.findUnique({ where: { email } });

    if (!user) {
      // Comparación falsa para evitar timing attacks y enumeración de usuarios
      verifyPassword(password, '00000000000000000000000000000000:' + '0'.repeat(128));
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 });
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email }, JWT_SECRET);

    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    // Guardar JWT en cookie httpOnly — JavaScript nunca puede leerla
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,                // ← no accesible desde JS
      secure: IS_PROD,               // ← solo HTTPS en producción
      sameSite: 'strict',            // ← bloquea CSRF
      maxAge: 60 * 60 * 8,          // ← 8 horas
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}

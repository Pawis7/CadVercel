import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'crypto';

/**
 * Genera un hash seguro usando scrypt (nativo de Node.js).
 * Formato: salt:hash
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verifica una contraseña contra un hash guardado.
 * Usa timingSafeEqual para prevenir ataques de tiempo.
 */
export function verifyPassword(password: string, hash: string): boolean {
  try {
    const [salt, key] = hash.split(':');
    if (!salt || !key) return false;
    
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = scryptSync(password, salt, 64);
    
    return timingSafeEqual(keyBuffer, derivedKey);
  } catch (e) {
    return false;
  }
}

/**
 * Crea un JWT minimalista (Header.Payload.Signature) usando HMAC-SHA256.
 * Zero dependencies.
 */
export function signToken(payload: object, secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const data = Buffer.from(JSON.stringify({ 
    ...payload, 
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60) // 8 horas
  })).toString('base64url');
  
  const signature = createHmac('sha256', secret)
    .update(`${header}.${data}`)
    .digest('base64url');
    
  return `${header}.${data}.${signature}`;
}

/**
 * Verifica un JWT firmado con HMAC-SHA256 y devuelve el payload.
 * Devuelve null si la firma no es válida o el token está mal formado.
 */
export function verifyToken(token: string, secret: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, data, signature] = parts;
    const expected = createHmac('sha256', secret)
      .update(`${header}.${data}`)
      .digest('base64url');

    const expectedBuf = Buffer.from(expected);
    const sigBuf = Buffer.from(signature);
    if (expectedBuf.length !== sigBuf.length) return null;
    if (!timingSafeEqual(expectedBuf, sigBuf)) return null;

    return JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
  } catch {
    return null;
  }
}

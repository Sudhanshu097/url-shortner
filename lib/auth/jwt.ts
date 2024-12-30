import { SignJWT, jwtVerify } from 'jose';
import { logger } from '@/lib/logger';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function createToken(payload: any): Promise<string> {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);
    
    return token;
  } catch (error) {
    logger.error({ error }, 'Error creating JWT token');
    throw new Error('Failed to create token');
  }
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    logger.error({ error }, 'Error verifying JWT token');
    return null;
  }
}
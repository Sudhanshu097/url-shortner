import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { User } from '@prisma/client';

export async function getSession(): Promise<{ user: User } | null> {
  const sessionToken = cookies().get('session_token')?.value;
  
  if (!sessionToken) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { 
      token: sessionToken,
      expiresAt: { gt: new Date() }
    },
    include: { user: true }
  });

  if (!session) {
    return null;
  }

  return { user: session.user };
}

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt
    }
  });

  return token;
}
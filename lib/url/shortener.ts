import { customAlphabet } from 'nanoid';
import { isValidUrl, sanitizeUrl } from './validator';
import { prisma } from '@/lib/db';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

export async function createShortUrl({
  url,
  customSlug,
  userId,
  teamId,
  expiresAt,
  password,
  title,
  description,
  tags,
  folderId
}: {
  url: string;
  customSlug?: string;
  userId?: string;
  teamId?: string;
  expiresAt?: Date;
  password?: string;
  title?: string;
  description?: string;
  tags?: string[];
  folderId?: string;
}) {
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL');
  }

  const sanitizedUrl = sanitizeUrl(url);
  const shortCode = customSlug || nanoid();

  if (customSlug) {
    const existing = await prisma.url.findUnique({
      where: { shortCode: customSlug }
    });
    if (existing) {
      throw new Error('Custom slug already taken');
    }
  }

  return prisma.url.create({
    data: {
      originalUrl: sanitizedUrl,
      shortCode,
      userId,
      teamId,
      expiresAt,
      password,
      title,
      description,
      folderId,
      tags: tags ? {
        connectOrCreate: tags.map(tag => ({
          where: { name_userId_teamId: { name: tag, userId: userId || null, teamId: teamId || null } },
          create: { name: tag }
        }))
      } : undefined
    },
    include: {
      tags: true
    }
  });
}
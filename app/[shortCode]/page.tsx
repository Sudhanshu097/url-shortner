import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { UrlCache } from '@/lib/redis/cache';
import { logger } from '@/lib/logger';

export default async function RedirectPage({
  params,
}: {
  params: { shortCode: string };
}) {
  try {
    // Try to get URL from cache first
    const cachedUrl = await UrlCache.get(params.shortCode);
    if (cachedUrl) {
      redirect(cachedUrl);
    }

    // If not in cache, fetch from database
    const url = await prisma.url.findUnique({
      where: { shortCode: params.shortCode },
    });

    if (!url) {
      logger.info({ shortCode: params.shortCode }, 'URL not found');
      redirect('/404');
    }

    // Cache the URL for future requests
    await UrlCache.set(params.shortCode, url.originalUrl);

    // Update click count
    await prisma.url.update({
      where: { id: url.id },
      data: { clicks: { increment: 1 } },
    });

    redirect(url.originalUrl);
  } catch (error) {
    logger.error({ error, shortCode: params.shortCode }, 'Error processing redirect');
    redirect('/error');
  }
}
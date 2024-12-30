import { prisma } from '@/lib/db';
import { UAParser } from 'ua-parser-js';

export async function trackClick({
  urlId,
  ip,
  userAgent,
  referer
}: {
  urlId: string;
  ip?: string;
  userAgent?: string;
  referer?: string;
}) {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice().type || 'desktop';
  const browser = parser.getBrowser().name;
  
  // In a real app, we'd use a geolocation service here
  const country = 'Unknown';
  const city = 'Unknown';

  return prisma.click.create({
    data: {
      urlId,
      ip,
      userAgent,
      referer,
      country,
      city,
      device,
      browser
    }
  });
}

export async function getUrlStats(urlId: string) {
  const [totalClicks, clicksByCountry, clicksByDevice, clicksByBrowser] = await Promise.all([
    prisma.click.count({ where: { urlId } }),
    prisma.click.groupBy({
      by: ['country'],
      where: { urlId },
      _count: true
    }),
    prisma.click.groupBy({
      by: ['device'],
      where: { urlId },
      _count: true
    }),
    prisma.click.groupBy({
      by: ['browser'],
      where: { urlId },
      _count: true
    })
  ]);

  return {
    totalClicks,
    clicksByCountry,
    clicksByDevice,
    clicksByBrowser
  };
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateShortCode, urlSchema } from '@/lib/utils/url';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const limiter = await rateLimit(req);
    if (!limiter.success) {
      return new NextResponse('Rate limit exceeded', { status: 429 });
    }

    const body = await req.json();
    const result = urlSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    const { url, customSlug } = result.data;
    const shortCode = customSlug || generateShortCode();

    if (customSlug) {
      const existing = await prisma.url.findUnique({
        where: { shortCode: customSlug },
      });
      if (existing) {
        return NextResponse.json(
          { error: 'Custom slug already taken' },
          { status: 400 }
        );
      }
    }

    const shortened = await prisma.url.create({
      data: {
        originalUrl: url,
        shortCode,
      },
    });

    return NextResponse.json(shortened);
  } catch (error) {
    console.error('Error creating shortened URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
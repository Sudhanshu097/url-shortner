import { nanoid } from 'nanoid';
import { z } from 'zod';

export const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  customSlug: z.string().optional(),
});

export type UrlInput = z.infer<typeof urlSchema>;

export function generateShortCode() {
  return nanoid(6);
}

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeUrl(url: string) {
  const sanitized = url.trim();
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    return `https://${sanitized}`;
  }
  return sanitized;
}
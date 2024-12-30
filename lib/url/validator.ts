import { z } from 'zod';

export const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  customSlug: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  password: z.string().optional(),
  tags: z.array(z.string()).optional(),
  folderId: z.string().optional()
});

export type UrlInput = z.infer<typeof urlSchema>;

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeUrl(url: string): string {
  const sanitized = url.trim();
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    return `https://${sanitized}`;
  }
  return sanitized;
}
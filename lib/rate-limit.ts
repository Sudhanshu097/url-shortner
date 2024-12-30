const rateLimit = new Map();

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  req: Request,
  limit = 10,
  window = 60000
): Promise<RateLimitResult> {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowStart = now - window;

  const requests = rateLimit.get(ip) || [];
  const recentRequests = requests.filter((time: number) => time > windowStart);

  if (recentRequests.length >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil((windowStart + window - now) / 1000),
    };
  }

  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);

  return {
    success: true,
    limit,
    remaining: limit - recentRequests.length,
    reset: Math.ceil((windowStart + window - now) / 1000),
  };
}
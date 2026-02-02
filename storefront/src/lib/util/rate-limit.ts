import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Rate limiter instance using Upstash Redis
 * Configured with sliding window: 5 requests per minute per IP
 */
let ratelimit: Ratelimit | null = null

/**
 * Get or create the rate limiter instance
 * Lazy initialization to avoid build-time errors when env vars are missing
 */
function getRateLimiter(): Ratelimit | null {
  if (ratelimit) return ratelimit

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!redisUrl || !redisToken) {
    console.warn('Rate limiting disabled: UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not configured')
    return null
  }

  try {
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
      analytics: true,
      prefix: 'bea:ratelimit',
    })

    return ratelimit
  } catch (error) {
    console.error('Failed to initialize rate limiter:', error)
    return null
  }
}

/**
 * Get client IP from request
 * Handles various proxy headers (Vercel, Cloudflare, etc.)
 */
function getClientIp(request: NextRequest): string {
  // Vercel/Next.js
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  // Cloudflare
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Real IP header
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback
  return 'anonymous'
}

/**
 * Rate limit response for when limit is exceeded
 */
export function rateLimitExceededResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { status: 429 }
  )
}

/**
 * Check rate limit for a request
 * @param request - The incoming request
 * @param identifier - Optional custom identifier (defaults to IP)
 * @returns Object with success boolean and remaining requests info
 */
export async function checkRateLimit(
  request: NextRequest,
  identifier?: string
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  const limiter = getRateLimiter()

  // If rate limiting is not configured, allow all requests
  if (!limiter) {
    return { success: true }
  }

  const id = identifier || getClientIp(request)

  try {
    const result = await limiter.limit(id)
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // On error, allow the request to proceed
    return { success: true }
  }
}

/**
 * Rate limit middleware for API routes
 * Usage: const rateLimitResult = await checkRateLimit(request)
 *        if (!rateLimitResult.success) return rateLimitExceededResponse()
 */
export async function withRateLimit(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  identifier?: string
): Promise<NextResponse> {
  const result = await checkRateLimit(request, identifier)

  if (!result.success) {
    return rateLimitExceededResponse()
  }

  return handler()
}

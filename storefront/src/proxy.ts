import { NextRequest, NextResponse } from 'next/server'

// Single region: always use 'us'
const COUNTRY_CODE = 'us'

/**
 * Proxy to handle URL prefixing with country code and onboarding/cart status.
 * Simplified for single region (USD only) - always uses 'us'.
 */
export async function proxy(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const isOnboarding = searchParams.get('onboarding') === 'true'
  const cartId = searchParams.get('cart_id')
  const checkoutStep = searchParams.get('step')
  const onboardingCookie = request.cookies.get('_medusa_onboarding')
  const cartIdCookie = request.cookies.get('_medusa_cart_id')

  const urlCountryCode = request.nextUrl.pathname.split('/')[1]?.toLowerCase()
  const urlHasCountryCode = urlCountryCode === COUNTRY_CODE

  // If URL already has /us prefix and no special handling needed, continue
  if (
    urlHasCountryCode &&
    (!isOnboarding || onboardingCookie) &&
    (!cartId || cartIdCookie)
  ) {
    return NextResponse.next()
  }

  // Build redirect path
  let redirectPath = request.nextUrl.pathname

  // If the URL doesn't have the country code, we need to add it
  // But first, strip any existing invalid country code prefix
  if (!urlHasCountryCode && redirectPath !== '/') {
    // Check if first segment looks like a 2-letter country code
    const firstSegment = urlCountryCode
    if (firstSegment && firstSegment.length === 2 && /^[a-z]{2}$/.test(firstSegment)) {
      // Remove the invalid country code prefix
      redirectPath = '/' + request.nextUrl.pathname.split('/').slice(2).join('/')
    }
  }

  if (redirectPath === '/') {
    redirectPath = ''
  }

  const queryString = request.nextUrl.search ? request.nextUrl.search : ''

  let redirectUrl = `${request.nextUrl.origin}/${COUNTRY_CODE}${redirectPath}${queryString}`
  let response = NextResponse.redirect(redirectUrl, 307)

  // If a cart_id is in the params, we set it as a cookie and redirect to the address step.
  if (cartId && !checkoutStep) {
    redirectUrl = `${redirectUrl}&step=address`
    response = NextResponse.redirect(redirectUrl, 307)
    response.cookies.set('_medusa_cart_id', cartId, { maxAge: 60 * 60 * 24 })
  }

  // Set a cookie to indicate that we're onboarding. This is used to show the onboarding flow.
  if (isOnboarding) {
    response.cookies.set('_medusa_onboarding', 'true', {
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

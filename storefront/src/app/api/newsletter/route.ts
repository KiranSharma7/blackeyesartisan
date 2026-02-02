import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { validateEmail } from '@lib/util/validator'
import { checkRateLimit, rateLimitExceededResponse } from '@lib/util/rate-limit'

// Initialize Resend lazily to avoid build-time errors when env vars are missing
let resend: Resend | null = null
function getResend(): Resend | null {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

interface NewsletterRequestBody {
  email: string
  source?: 'footer' | 'notify_me' | 'checkout'
  productTitle?: string
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = await checkRateLimit(request)
    if (!rateLimitResult.success) {
      return rateLimitExceededResponse()
    }

    const body: NewsletterRequestBody = await request.json()
    const { email, source = 'footer', productTitle } = body

    // Validate email using shared validator
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check if Resend is configured
    const resendClient = getResend()
    if (!resendClient) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Newsletter service is not configured' },
        { status: 500 }
      )
    }

    // If no audience ID, we can still send welcome emails but skip audience
    let alreadySubscribed = false
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (audienceId) {
      try {
        // Add contact to Resend audience
        await resendClient.contacts.create({
          email,
          audienceId: audienceId,
          unsubscribed: false,
        })
      } catch (audienceError: unknown) {
        // Check if contact already exists
        const errorMessage = audienceError instanceof Error ? audienceError.message : String(audienceError)
        if (errorMessage?.includes('already exists') || errorMessage?.includes('Contact already exists')) {
          alreadySubscribed = true
        } else {
          console.error('Error adding to audience:', audienceError)
          // Continue anyway - we'll still try to send the welcome email
        }
      }
    }

    // Send appropriate welcome email based on source
    const emailSubject =
      source === 'notify_me'
        ? `We'll notify you when ${productTitle || 'this item'} is back!`
        : 'Welcome to Black Eyes Artisan!'

    const emailContent =
      source === 'notify_me'
        ? `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #18181B; font-size: 24px; margin-bottom: 16px;">
              You're on the list!
            </h1>
            <p style="color: #18181B; font-size: 16px; line-height: 1.6;">
              Thanks for signing up! We'll send you an email when <strong>${productTitle || 'this item'}</strong> is back in stock.
            </p>
            <p style="color: #18181B; font-size: 16px; line-height: 1.6;">
              In the meantime, check out our other handcrafted pieces.
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 24px;">
              — Black Eyes Artisan
            </p>
          </div>
        `
        : `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #18181B; font-size: 24px; margin-bottom: 16px;">
              Welcome to the family!
            </h1>
            <p style="color: #18181B; font-size: 16px; line-height: 1.6;">
              Thanks for joining the Black Eyes Artisan community. You'll be the first to know about new drops, restocks, and exclusive pieces.
            </p>
            <p style="color: #18181B; font-size: 16px; line-height: 1.6;">
              Every piece we create is handcrafted with intention. We hope you find something that speaks to you.
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 24px;">
              — Black Eyes Artisan
            </p>
          </div>
        `

    // Only send welcome email for new subscribers
    if (!alreadySubscribed) {
      try {
        await resendClient.emails.send({
          from: 'Black Eyes Artisan <hello@blackeyesartisan.shop>',
          to: email,
          subject: emailSubject,
          html: emailContent,
        })
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError)
        // Don't fail the whole request if email fails - contact was still added
      }
    }

    return NextResponse.json({
      success: true,
      alreadySubscribed,
      message: alreadySubscribed
        ? "You're already subscribed!"
        : 'Successfully subscribed!',
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}

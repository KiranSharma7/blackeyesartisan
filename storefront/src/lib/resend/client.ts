import { Resend } from 'resend'

// Initialize Resend lazily to avoid build-time errors when env vars are missing
let resend: Resend | null = null

export function getResendClient(): Resend | null {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

// Email configuration
export const EMAIL_CONFIG = {
  from: 'Black Eyes Artisan <hello@blackeyesartisan.shop>',
  replyTo: 'hello@blackeyesartisan.shop',
}

// Email types for type safety
export interface OrderEmailData {
  orderId: string
  displayId: number
  email: string
  customerName: string
  items: Array<{
    title: string
    quantity: number
    unitPrice: number
    thumbnail?: string | null
  }>
  subtotal: number
  shippingTotal: number
  total: number
  currencyCode: string
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2?: string | null
    city: string
    province?: string | null
    postalCode: string
    countryCode: string
    phone?: string | null
  }
  handlingTimeDays?: number
  dutiesDisclaimer?: string
}

export interface ShippingEmailData {
  orderId: string
  displayId: number
  email: string
  customerName: string
  trackingNumber: string
  trackingUrl?: string
  carrier: string
  items: Array<{
    title: string
    quantity: number
    thumbnail?: string | null
  }>
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2?: string | null
    city: string
    province?: string | null
    postalCode: string
    countryCode: string
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  data: OrderEmailData
): Promise<{ success: boolean; error?: string }> {
  const client = getResendClient()

  if (!client) {
    console.error('Resend client not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const html = generateOrderConfirmationHtml(data)

    await client.emails.send({
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      to: data.email,
      subject: `Order Confirmed - #${data.displayId}`,
      html,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send shipping notification email
 */
export async function sendShippingNotificationEmail(
  data: ShippingEmailData
): Promise<{ success: boolean; error?: string }> {
  const client = getResendClient()

  if (!client) {
    console.error('Resend client not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const html = generateShippingNotificationHtml(data)

    await client.emails.send({
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      to: data.email,
      subject: `Your Order Has Shipped - #${data.displayId}`,
      html,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send shipping notification email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Format currency amount
 */
function formatCurrency(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100)
}

/**
 * Generate order confirmation email HTML
 */
function generateOrderConfirmationHtml(data: OrderEmailData): string {
  const handlingTime = data.handlingTimeDays || 5
  const dutiesDisclaimer =
    data.dutiesDisclaimer ||
    'International orders may be subject to customs duties and taxes upon delivery. These fees are the responsibility of the recipient.'

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
          <div style="display: flex; align-items: center;">
            ${
              item.thumbnail
                ? `<img src="${item.thumbnail}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border: 1px solid #e5e5e5; margin-right: 12px;" />`
                : ''
            }
            <div>
              <p style="margin: 0; font-weight: 600; color: #18181B;">${item.title}</p>
              <p style="margin: 4px 0 0; font-size: 14px; color: #666;">Qty: ${item.quantity}</p>
            </div>
          </div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; text-align: right; font-weight: 600;">
          ${formatCurrency(item.unitPrice * item.quantity, data.currencyCode)}
        </td>
      </tr>
    `
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 2px solid #18181B; max-width: 600px;">
          <!-- Header -->
          <tr>
            <td style="background-color: #18181B; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #FAFAF9; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                BLACK EYES ARTISAN
              </h1>
            </td>
          </tr>

          <!-- Success Banner -->
          <tr>
            <td style="padding: 40px 32px; text-align: center; background-color: #A3E635;">
              <div style="display: inline-block; width: 60px; height: 60px; background-color: #18181B; border-radius: 50%; line-height: 60px;">
                <span style="color: #FAFAF9; font-size: 28px;">✓</span>
              </div>
              <h2 style="margin: 16px 0 0; color: #18181B; font-size: 28px; font-weight: 700; text-transform: uppercase;">
                Order Confirmed!
              </h2>
              <p style="margin: 8px 0 0; color: #18181B; font-size: 16px;">
                Order #${data.displayId}
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 32px 16px;">
              <p style="margin: 0; color: #18181B; font-size: 16px; line-height: 1.6;">
                Hey ${data.customerName},
              </p>
              <p style="margin: 12px 0 0; color: #18181B; font-size: 16px; line-height: 1.6;">
                Thanks for your order! We're excited to get your handcrafted piece on its way to you.
              </p>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 16px 32px;">
              <h3 style="margin: 0 0 16px; color: #18181B; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #18181B; padding-bottom: 8px;">
                Order Details
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Order Summary -->
          <tr>
            <td style="padding: 16px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatCurrency(data.subtotal, data.currencyCode)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Shipping</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatCurrency(data.shippingTotal, data.currencyCode)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-top: 2px solid #18181B; font-size: 18px; font-weight: 700; text-transform: uppercase;">Total</td>
                  <td style="padding: 12px 0; border-top: 2px solid #18181B; text-align: right; font-size: 18px; font-weight: 700;">${formatCurrency(data.total, data.currencyCode)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 16px 32px;">
              <h3 style="margin: 0 0 16px; color: #18181B; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #18181B; padding-bottom: 8px;">
                Shipping To
              </h3>
              <p style="margin: 0; color: #18181B; line-height: 1.6;">
                <strong>${data.shippingAddress.firstName} ${data.shippingAddress.lastName}</strong><br>
                ${data.shippingAddress.address1}<br>
                ${data.shippingAddress.address2 ? `${data.shippingAddress.address2}<br>` : ''}
                ${data.shippingAddress.city}${data.shippingAddress.province ? `, ${data.shippingAddress.province}` : ''} ${data.shippingAddress.postalCode}<br>
                ${data.shippingAddress.countryCode.toUpperCase()}
                ${data.shippingAddress.phone ? `<br>Phone: ${data.shippingAddress.phone}` : ''}
              </p>
            </td>
          </tr>

          <!-- Handling Time Notice -->
          <tr>
            <td style="padding: 16px 32px;">
              <div style="background-color: #FEF08A; border: 2px solid #18181B; padding: 16px; border-radius: 8px;">
                <p style="margin: 0 0 8px; font-weight: 700; color: #18181B;">
                  ⏱ Estimated Handling Time: ${handlingTime} business days
                </p>
                <p style="margin: 0; color: #18181B; font-size: 14px;">
                  Each piece is handcrafted to order. You'll receive a shipping confirmation email with tracking once your order ships.
                </p>
              </div>
            </td>
          </tr>

          <!-- Duties Disclaimer (for international) -->
          ${
            data.shippingAddress.countryCode.toLowerCase() !== 'us'
              ? `
          <tr>
            <td style="padding: 16px 32px;">
              <div style="background-color: #f5f5f5; border: 1px solid #e5e5e5; padding: 16px; border-radius: 8px;">
                <p style="margin: 0; color: #666; font-size: 13px;">
                  <strong>International Shipping Notice:</strong> ${dutiesDisclaimer}
                </p>
              </div>
            </td>
          </tr>
          `
              : ''
          }

          <!-- Footer -->
          <tr>
            <td style="padding: 32px; background-color: #18181B; text-align: center;">
              <p style="margin: 0; color: #FAFAF9; font-size: 14px;">
                Questions? Reply to this email or visit us at
              </p>
              <a href="https://www.blackeyesartisan.shop" style="color: #A3E635; text-decoration: none; font-weight: 600;">
                www.blackeyesartisan.shop
              </a>
              <p style="margin: 24px 0 0; color: #666; font-size: 12px;">
                © ${new Date().getFullYear()} Black Eyes Artisan. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * Generate shipping notification email HTML
 */
function generateShippingNotificationHtml(data: ShippingEmailData): string {
  const trackingUrl =
    data.trackingUrl ||
    `https://www.fedex.com/fedextrack/?trknbr=${data.trackingNumber}`

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5;">
          <div style="display: flex; align-items: center;">
            ${
              item.thumbnail
                ? `<img src="${item.thumbnail}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border: 1px solid #e5e5e5; margin-right: 12px;" />`
                : ''
            }
            <div>
              <p style="margin: 0; font-weight: 600; color: #18181B;">${item.title}</p>
              <p style="margin: 4px 0 0; font-size: 14px; color: #666;">Qty: ${item.quantity}</p>
            </div>
          </div>
        </td>
      </tr>
    `
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order Has Shipped</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 2px solid #18181B; max-width: 600px;">
          <!-- Header -->
          <tr>
            <td style="background-color: #18181B; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #FAFAF9; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                BLACK EYES ARTISAN
              </h1>
            </td>
          </tr>

          <!-- Success Banner -->
          <tr>
            <td style="padding: 40px 32px; text-align: center; background-color: #A3E635;">
              <div style="display: inline-block; width: 60px; height: 60px; background-color: #18181B; border-radius: 50%; line-height: 60px;">
                <span style="color: #FAFAF9; font-size: 28px;">📦</span>
              </div>
              <h2 style="margin: 16px 0 0; color: #18181B; font-size: 28px; font-weight: 700; text-transform: uppercase;">
                Your Order Has Shipped!
              </h2>
              <p style="margin: 8px 0 0; color: #18181B; font-size: 16px;">
                Order #${data.displayId}
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 32px 16px;">
              <p style="margin: 0; color: #18181B; font-size: 16px; line-height: 1.6;">
                Hey ${data.customerName},
              </p>
              <p style="margin: 12px 0 0; color: #18181B; font-size: 16px; line-height: 1.6;">
                Great news! Your handcrafted piece is on its way. Here's your tracking info:
              </p>
            </td>
          </tr>

          <!-- Tracking Info -->
          <tr>
            <td style="padding: 16px 32px;">
              <div style="background-color: #f5f5f5; border: 2px solid #18181B; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 8px; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  ${data.carrier} Tracking Number
                </p>
                <p style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #18181B; letter-spacing: 1px;">
                  ${data.trackingNumber}
                </p>
                <a href="${trackingUrl}" style="display: inline-block; background-color: #18181B; color: #FAFAF9; padding: 12px 24px; text-decoration: none; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px;">
                  Track Your Package
                </a>
              </div>
            </td>
          </tr>

          <!-- Items Shipped -->
          <tr>
            <td style="padding: 16px 32px;">
              <h3 style="margin: 0 0 16px; color: #18181B; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #18181B; padding-bottom: 8px;">
                Items Shipped
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 16px 32px;">
              <h3 style="margin: 0 0 16px; color: #18181B; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #18181B; padding-bottom: 8px;">
                Shipping To
              </h3>
              <p style="margin: 0; color: #18181B; line-height: 1.6;">
                <strong>${data.shippingAddress.firstName} ${data.shippingAddress.lastName}</strong><br>
                ${data.shippingAddress.address1}<br>
                ${data.shippingAddress.address2 ? `${data.shippingAddress.address2}<br>` : ''}
                ${data.shippingAddress.city}${data.shippingAddress.province ? `, ${data.shippingAddress.province}` : ''} ${data.shippingAddress.postalCode}<br>
                ${data.shippingAddress.countryCode.toUpperCase()}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px; background-color: #18181B; text-align: center;">
              <p style="margin: 0; color: #FAFAF9; font-size: 14px;">
                Questions about your shipment? Reply to this email or visit us at
              </p>
              <a href="https://www.blackeyesartisan.shop" style="color: #A3E635; text-decoration: none; font-weight: 600;">
                www.blackeyesartisan.shop
              </a>
              <p style="margin: 24px 0 0; color: #666; font-size: 12px;">
                © ${new Date().getFullYear()} Black Eyes Artisan. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

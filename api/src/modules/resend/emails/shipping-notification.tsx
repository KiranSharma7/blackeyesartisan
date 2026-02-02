import {
  Text,
  Column,
  Container,
  Heading,
  Html,
  Img,
  Row,
  Section,
  Head,
  Preview,
  Body,
  Link,
  Hr,
  Button
} from "@react-email/components"
import { BigNumberValue, CustomerDTO, OrderDTO } from "@medusajs/framework/types"

type ShippingNotificationEmailProps = {
  order: OrderDTO & {
    customer: CustomerDTO
  }
  trackingNumber: string
  trackingUrl?: string
  carrier?: string
}

function ShippingNotificationEmailComponent({
  order,
  trackingNumber,
  trackingUrl,
  carrier = 'FedEx'
}: ShippingNotificationEmailProps) {
  const customerName = order.customer?.first_name || order.shipping_address?.first_name || 'there'
  const trackingLink = trackingUrl || `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`

  return (
    <Html>
      <Head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
          `}
        </style>
      </Head>
      <Preview>{`Your order #${order.display_id} has shipped - Black Eyes Artisan`}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>BLACK EYES ARTISAN</Text>
          </Section>

          {/* Success Banner */}
          <Section style={successBanner}>
            <Text style={packageIcon}>&#128230;</Text>
            <Heading style={successHeading}>Your Order Has Shipped!</Heading>
            <Text style={orderNumber}>Order #{order.display_id}</Text>
          </Section>

          {/* Greeting */}
          <Section style={content}>
            <Text style={greeting}>Hey {customerName},</Text>
            <Text style={messageText}>
              Great news! Your handcrafted piece is on its way. Here's your tracking info:
            </Text>
          </Section>

          {/* Tracking Info */}
          <Section style={content}>
            <div style={trackingBox}>
              <Text style={trackingLabel}>{carrier} Tracking Number</Text>
              <Text style={trackingNumberStyle}>{trackingNumber}</Text>
              <Link href={trackingLink} style={trackButton}>
                Track Your Package
              </Link>
            </div>
          </Section>

          {/* Items Shipped */}
          <Section style={content}>
            <Heading style={sectionHeading}>Items Shipped</Heading>
            <Hr style={headingUnderline} />

            {order.items?.map((item) => (
              <Row key={item.id} style={itemRow}>
                <Column style={itemImageCol}>
                  {item.thumbnail && (
                    <Img
                      src={item.thumbnail}
                      alt={item.product_title ?? ''}
                      style={itemImage}
                      width={50}
                      height={50}
                    />
                  )}
                </Column>
                <Column style={itemDetailsCol}>
                  <Text style={itemTitle}>{item.product_title}</Text>
                  <Text style={itemQty}>Qty: {item.quantity}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Shipping Address */}
          {order.shipping_address && (
            <Section style={content}>
              <Heading style={sectionHeading}>Shipping To</Heading>
              <Hr style={headingUnderline} />
              <Text style={addressText}>
                <strong>{order.shipping_address.first_name} {order.shipping_address.last_name}</strong>
              </Text>
              <Text style={addressText}>{order.shipping_address.address_1}</Text>
              {order.shipping_address.address_2 && (
                <Text style={addressText}>{order.shipping_address.address_2}</Text>
              )}
              <Text style={addressText}>
                {order.shipping_address.city}
                {order.shipping_address.province ? `, ${order.shipping_address.province}` : ''} {order.shipping_address.postal_code}
              </Text>
              <Text style={addressText}>{order.shipping_address.country_code?.toUpperCase()}</Text>
            </Section>
          )}

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions about your shipment? Reply to this email or visit us at
            </Text>
            <Link href="https://www.blackeyesartisan.shop" style={footerLink}>
              www.blackeyesartisan.shop
            </Link>
            <Text style={copyright}>
              &copy; {new Date().getFullYear()} Black Eyes Artisan. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f5f5f5',
  padding: '40px 20px',
}

const container = {
  backgroundColor: '#ffffff',
  border: '2px solid #18181B',
  maxWidth: '600px',
  margin: '0 auto',
}

const header = {
  backgroundColor: '#18181B',
  padding: '24px',
  textAlign: 'center' as const,
}

const logo = {
  color: '#FAFAF9',
  fontSize: '24px',
  fontWeight: '700',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  margin: '0',
}

const successBanner = {
  backgroundColor: '#A3E635',
  padding: '40px 32px',
  textAlign: 'center' as const,
}

const packageIcon = {
  fontSize: '48px',
  margin: '0',
}

const successHeading = {
  color: '#18181B',
  fontSize: '28px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  margin: '16px 0 0',
}

const orderNumber = {
  color: '#18181B',
  fontSize: '16px',
  margin: '8px 0 0',
}

const content = {
  padding: '16px 32px',
}

const greeting = {
  color: '#18181B',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 12px',
}

const messageText = {
  color: '#18181B',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0',
}

const trackingBox = {
  backgroundColor: '#f5f5f5',
  border: '2px solid #18181B',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
}

const trackingLabel = {
  color: '#666',
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 8px',
}

const trackingNumberStyle = {
  color: '#18181B',
  fontSize: '20px',
  fontWeight: '700',
  letterSpacing: '1px',
  margin: '0 0 16px',
}

const trackButton = {
  display: 'inline-block',
  backgroundColor: '#18181B',
  color: '#FAFAF9',
  padding: '12px 24px',
  textDecoration: 'none',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  borderRadius: '4px',
}

const sectionHeading = {
  color: '#18181B',
  fontSize: '18px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 8px',
}

const headingUnderline = {
  borderTop: '2px solid #18181B',
  margin: '0 0 16px',
}

const itemRow = {
  padding: '8px 0',
  borderBottom: '1px solid #e5e5e5',
}

const itemImageCol = {
  width: '60px',
  verticalAlign: 'top' as const,
}

const itemImage = {
  border: '1px solid #e5e5e5',
  objectFit: 'cover' as const,
}

const itemDetailsCol = {
  paddingLeft: '12px',
  verticalAlign: 'top' as const,
}

const itemTitle = {
  color: '#18181B',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
}

const itemQty = {
  color: '#666',
  fontSize: '13px',
  margin: '4px 0 0',
}

const addressText = {
  color: '#18181B',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
}

const footer = {
  backgroundColor: '#18181B',
  padding: '32px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#FAFAF9',
  fontSize: '14px',
  margin: '0',
}

const footerLink = {
  color: '#A3E635',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
}

const copyright = {
  color: '#666',
  fontSize: '12px',
  margin: '24px 0 0',
}

export const shippingNotificationEmail = (props: ShippingNotificationEmailProps) => (
  <ShippingNotificationEmailComponent {...props} />
)

// Mock data for preview
const mockData = {
  "order": {
    "id": "order_01JSNXDH9BPJWWKVW03B9E9KW8",
    "display_id": 1,
    "email": "customer@example.com",
    "currency_code": "usd",
    "total": 8999,
    "items": [
      {
        "id": "ordli_01JSNXDH9C47KZ43WQ3TBFXZA9",
        "thumbnail": "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=200",
        "product_title": "Handcrafted Leather Belt",
        "quantity": 1,
      }
    ],
    "shipping_address": {
      "first_name": "John",
      "last_name": "Doe",
      "address_1": "123 Main Street",
      "address_2": "Apt 4B",
      "city": "New York",
      "country_code": "us",
      "province": "NY",
      "postal_code": "10001",
    },
    "customer": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "customer@example.com",
    }
  },
  "trackingNumber": "123456789012",
  "carrier": "FedEx"
}

// @ts-ignore
export default () => <ShippingNotificationEmailComponent {...mockData} />

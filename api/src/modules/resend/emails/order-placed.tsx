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
  Hr
} from "@react-email/components"
import { BigNumberValue, CustomerDTO, OrderDTO } from "@medusajs/framework/types"

type OrderPlacedEmailProps = {
  order: OrderDTO & {
    customer: CustomerDTO
  }
  handlingTimeDays?: number
  dutiesDisclaimer?: string
}

function OrderPlacedEmailComponent({
  order,
  handlingTimeDays = 5,
  dutiesDisclaimer = "International orders may be subject to customs duties and taxes upon delivery. These fees are the responsibility of the recipient."
}: OrderPlacedEmailProps) {
  const isInternational = order.shipping_address?.country_code?.toLowerCase() !== 'us'
  const customerName = order.customer?.first_name || order.shipping_address?.first_name || 'there'

  const formatter = new Intl.NumberFormat([], {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    currency: order.currency_code,
  })

  const formatPrice = (price: BigNumberValue) => {
    if (typeof price === "number") {
      return formatter.format(price)
    }

    if (typeof price === "string") {
      return formatter.format(parseFloat(price))
    }

    return price?.toString() || ""
  }

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
      <Preview>Your order #{order.display_id} has been confirmed - Black Eyes Artisan</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>BLACK EYES ARTISAN</Text>
          </Section>

          {/* Success Banner */}
          <Section style={successBanner}>
            <div style={checkCircle}>
              <Text style={checkMark}>&#10003;</Text>
            </div>
            <Heading style={successHeading}>Order Confirmed!</Heading>
            <Text style={orderNumber}>Order #{order.display_id}</Text>
          </Section>

          {/* Greeting */}
          <Section style={content}>
            <Text style={greeting}>Hey {customerName},</Text>
            <Text style={messageText}>
              Thanks for your order! We're excited to get your handcrafted piece on its way to you.
            </Text>
          </Section>

          {/* Order Items */}
          <Section style={content}>
            <Heading style={sectionHeading}>Order Details</Heading>
            <Hr style={headingUnderline} />

            {order.items?.map((item) => (
              <Row key={item.id} style={itemRow}>
                <Column style={itemImageCol}>
                  {item.thumbnail && (
                    <Img
                      src={item.thumbnail}
                      alt={item.product_title ?? ''}
                      style={itemImage}
                      width={60}
                      height={60}
                    />
                  )}
                </Column>
                <Column style={itemDetailsCol}>
                  <Text style={itemTitle}>{item.product_title}</Text>
                  {item.variant_title && item.variant_title !== 'Default' && (
                    <Text style={itemVariant}>{item.variant_title}</Text>
                  )}
                  <Text style={itemQty}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={itemPriceCol}>
                  <Text style={itemPrice}>{formatPrice(item.total)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Order Summary */}
          <Section style={content}>
            <Row style={summaryRow}>
              <Column style={summaryLabel}>
                <Text style={summaryText}>Subtotal</Text>
              </Column>
              <Column style={summaryValue}>
                <Text style={summaryText}>{formatPrice(order.item_total)}</Text>
              </Column>
            </Row>
            {order.shipping_methods?.map((method) => (
              <Row style={summaryRow} key={method.id}>
                <Column style={summaryLabel}>
                  <Text style={summaryText}>{method.name || 'Shipping'}</Text>
                </Column>
                <Column style={summaryValue}>
                  <Text style={summaryText}>{formatPrice(method.total)}</Text>
                </Column>
              </Row>
            ))}
            {order.tax_total > 0 && (
              <Row style={summaryRow}>
                <Column style={summaryLabel}>
                  <Text style={summaryText}>Tax</Text>
                </Column>
                <Column style={summaryValue}>
                  <Text style={summaryText}>{formatPrice(order.tax_total)}</Text>
                </Column>
              </Row>
            )}
            <Hr style={totalDivider} />
            <Row style={totalRow}>
              <Column style={summaryLabel}>
                <Text style={totalText}>TOTAL</Text>
              </Column>
              <Column style={summaryValue}>
                <Text style={totalText}>{formatPrice(order.total)}</Text>
              </Column>
            </Row>
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
              {order.shipping_address.phone && (
                <Text style={addressText}>Phone: {order.shipping_address.phone}</Text>
              )}
            </Section>
          )}

          {/* Handling Time Notice */}
          <Section style={content}>
            <div style={noticeBox}>
              <Text style={noticeTitle}>Estimated Handling Time: {handlingTimeDays} business days</Text>
              <Text style={noticeText}>
                Each piece is handcrafted to order. You'll receive a shipping confirmation email with tracking once your order ships.
              </Text>
            </div>
          </Section>

          {/* Duties Disclaimer (international only) */}
          {isInternational && (
            <Section style={content}>
              <div style={disclaimerBox}>
                <Text style={disclaimerTitle}>International Shipping Notice</Text>
                <Text style={disclaimerText}>{dutiesDisclaimer}</Text>
              </div>
            </Section>
          )}

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions? Reply to this email or visit us at
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

const checkCircle = {
  display: 'inline-block',
  width: '60px',
  height: '60px',
  backgroundColor: '#18181B',
  borderRadius: '50%',
  lineHeight: '60px',
  textAlign: 'center' as const,
}

const checkMark = {
  color: '#FAFAF9',
  fontSize: '28px',
  margin: '0',
  lineHeight: '60px',
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
  padding: '12px 0',
  borderBottom: '1px solid #e5e5e5',
}

const itemImageCol = {
  width: '70px',
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

const itemVariant = {
  color: '#666',
  fontSize: '13px',
  margin: '4px 0 0',
}

const itemQty = {
  color: '#666',
  fontSize: '13px',
  margin: '4px 0 0',
}

const itemPriceCol = {
  textAlign: 'right' as const,
  verticalAlign: 'top' as const,
}

const itemPrice = {
  color: '#18181B',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
}

const summaryRow = {
  padding: '8px 0',
}

const summaryLabel = {
  width: '50%',
}

const summaryValue = {
  width: '50%',
  textAlign: 'right' as const,
}

const summaryText = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
}

const totalDivider = {
  borderTop: '2px solid #18181B',
  margin: '12px 0',
}

const totalRow = {
  padding: '4px 0',
}

const totalText = {
  color: '#18181B',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
}

const addressText = {
  color: '#18181B',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
}

const noticeBox = {
  backgroundColor: '#FEF08A',
  border: '2px solid #18181B',
  borderRadius: '8px',
  padding: '16px',
}

const noticeTitle = {
  color: '#18181B',
  fontSize: '14px',
  fontWeight: '700',
  margin: '0 0 8px',
}

const noticeText = {
  color: '#18181B',
  fontSize: '14px',
  margin: '0',
}

const disclaimerBox = {
  backgroundColor: '#f5f5f5',
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  padding: '16px',
}

const disclaimerTitle = {
  color: '#666',
  fontSize: '13px',
  fontWeight: '700',
  margin: '0 0 8px',
}

const disclaimerText = {
  color: '#666',
  fontSize: '13px',
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

export const orderPlacedEmail = (props: OrderPlacedEmailProps) => (
  <OrderPlacedEmailComponent {...props} />
)

// Mock data for preview
const mockOrder = {
  "order": {
    "id": "order_01JSNXDH9BPJWWKVW03B9E9KW8",
    "display_id": 1,
    "email": "customer@example.com",
    "currency_code": "usd",
    "total": 8999,
    "subtotal": 7999,
    "discount_total": 0,
    "shipping_total": 1000,
    "tax_total": 0,
    "item_subtotal": 7999,
    "item_total": 7999,
    "item_tax_total": 0,
    "customer_id": "cus_01JSNXD6VQC1YH56E4TGC81NWX",
    "items": [
      {
        "id": "ordli_01JSNXDH9C47KZ43WQ3TBFXZA9",
        "title": "Standard",
        "subtitle": "Handcrafted Leather Belt",
        "thumbnail": "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=200",
        "variant_id": "variant_01JSNXAQCZ5X81A3NRSVFJ3ZHQ",
        "product_id": "prod_01JSNXAQBQ6MFV5VHKN420NXQW",
        "product_title": "Handcrafted Leather Belt",
        "variant_title": "Standard",
        "quantity": 1,
        "unit_price": 7999,
        "subtotal": 7999,
        "total": 7999,
      }
    ],
    "shipping_address": {
      "id": "caaddr_01JSNXD6W0TGPH2JQD18K97B25",
      "first_name": "John",
      "last_name": "Doe",
      "address_1": "123 Main Street",
      "address_2": "Apt 4B",
      "city": "New York",
      "country_code": "us",
      "province": "NY",
      "postal_code": "10001",
      "phone": "+1 555-123-4567",
    },
    "billing_address": {
      "id": "caaddr_01JSNXD6W0V7RNZH63CPG26K5W",
      "first_name": "John",
      "last_name": "Doe",
      "address_1": "123 Main Street",
      "address_2": "Apt 4B",
      "city": "New York",
      "country_code": "us",
      "province": "NY",
      "postal_code": "10001",
      "phone": "+1 555-123-4567",
    },
    "shipping_methods": [
      {
        "id": "ordsm_01JSNXDH9B9DDRQXJT5J5AE5V1",
        "name": "Standard Shipping",
        "amount": 1000,
        "total": 1000,
      }
    ],
    "customer": {
      "id": "cus_01JSNXD6VQC1YH56E4TGC81NWX",
      "first_name": "John",
      "last_name": "Doe",
      "email": "customer@example.com",
    }
  }
}

// @ts-ignore
export default () => <OrderPlacedEmailComponent {...mockOrder} />

import type { Core } from '@strapi/strapi';

type DocumentSeed = {
  uid: string;
  title: string;
  pageContent: string;
};

const PRIVACY_POLICY_CONTENT = `# Privacy Policy

**Last Updated: January 2026**

BlackEyesArtisan ("we", "us", or "our") respects your privacy and is committed to protecting your personal data.

## Information We Collect

- **Contact Information**: Name, email, phone number, shipping address
- **Payment Information**: Processed securely through Stripe (we do not store credit card details)
- **Order History**: Products purchased, order dates, shipping details

## How We Use Your Information

- Process and fulfill your orders
- Send order confirmations and shipping updates
- Respond to customer service inquiries
- Send newsletters (only if you've subscribed)

## Data Sharing

We share data only with:
- **FedEx**: For shipping and delivery
- **Stripe**: For payment processing
- **Resend**: For transactional emails

## Your Rights

You may request access to, correction of, or deletion of your personal data by contacting us at support@blackeyesartisan.shop.

## Contact Us

For privacy-related questions, contact us at: support@blackeyesartisan.shop`;

const TERMS_AND_CONDITIONS_CONTENT = `# Terms & Conditions

**Last Updated: January 2026**

Welcome to BlackEyesArtisan. By using our website and purchasing our products, you agree to these terms.

## Age Requirement

You must be 18 years or older to browse and purchase from this site. By entering, you confirm you meet this requirement.

## Products

All products are handmade glass art pieces. Each piece is unique and may have slight variations from photos.

## Orders & Payment

- All prices are in USD
- Payment is processed securely via Stripe
- Orders are processed within 3-5 business days

## Shipping

- All orders ship via FedEx International Priority from Nepal
- A valid phone number is required for FedEx delivery
- Shipping times vary by destination (typically 5-10 business days)
- International duties and taxes are the buyer's responsibility

## Returns & Refunds

Due to the handmade and fragile nature of our products, we do not accept returns. If your item arrives damaged, please contact us within 48 hours with photos.

## Contact

Questions? Contact us at: support@blackeyesartisan.shop`;

const SHIPPING_POLICY_CONTENT = `# Shipping Policy

**Last Updated: January 2026**

## Processing Time

All orders are processed within **3-5 business days**. Each piece is carefully inspected and packaged to ensure safe delivery.

## Shipping Method

We ship exclusively via **FedEx International Priority** from Nepal.

## Delivery Times

- **North America**: 5-7 business days
- **Europe**: 5-7 business days
- **Asia-Pacific**: 3-5 business days
- **Rest of World**: 7-10 business days

## Phone Number Requirement

**A valid phone number is required for all orders.** FedEx requires this for international deliveries and may contact you regarding delivery.

## Duties & Taxes

**International orders may be subject to import duties and taxes.** These charges are:
- Determined by your country's customs office
- NOT included in our shipping fees
- The buyer's responsibility to pay upon delivery

## Tracking

You will receive a tracking number via email once your order ships. Track your package on the FedEx website.

## Lost or Damaged Packages

If your package is lost or arrives damaged:
1. Contact us within 48 hours
2. Provide photos of any damage
3. We will work with FedEx to resolve the issue

## Contact

Shipping questions? Email us at: support@blackeyesartisan.shop`;

const RETURN_POLICY_CONTENT = `# Return & Refund Policy

**Last Updated: January 2026**

## Handmade Art Policy

Due to the **handmade and fragile nature** of our glass art pieces, we do not accept returns for change of mind.

## Damaged Items

If your item arrives damaged:

1. **Document immediately**: Take photos of the packaging and damaged item
2. **Contact us within 48 hours**: Email support@blackeyesartisan.shop with:
   - Your order number
   - Photos of the damage
   - Description of the issue
3. **We will respond within 24 hours** with resolution options

## Resolution Options

For verified damage claims, we offer:
- **Full refund** for the item
- **Replacement** (subject to availability)
- **Store credit** for future purchase

## Non-Eligible Returns

We cannot accept returns for:
- Change of mind after purchase
- Minor variations in handmade pieces (color, pattern)
- Items damaged after delivery
- Claims made more than 48 hours after delivery

## Cancellations

Orders can be cancelled within **24 hours** of placement if not yet processed. Once processing begins, cancellation is not possible.

## Contact

Return questions? Email us at: support@blackeyesartisan.shop`;

const contentTypesToEnable = [
  'api::global-setting.global-setting',
  'api::shipping-policy.shipping-policy',
  'api::return-policy.return-policy',
  'api::privacy-policy.privacy-policy',
  'api::terms-and-condition.terms-and-condition',
  'api::about-us.about-us',
  'api::homepage.homepage',
  'api::faq.faq',
  'api::collection.collection',
  'api::blog.blog',
];

const documentsToSeed: DocumentSeed[] = [
  {
    uid: 'api::privacy-policy.privacy-policy',
    title: 'Privacy Policy',
    pageContent: PRIVACY_POLICY_CONTENT,
  },
  {
    uid: 'api::terms-and-condition.terms-and-condition',
    title: 'Terms & Conditions',
    pageContent: TERMS_AND_CONDITIONS_CONTENT,
  },
  {
    uid: 'api::shipping-policy.shipping-policy',
    title: 'Shipping Policy',
    pageContent: SHIPPING_POLICY_CONTENT,
  },
  {
    uid: 'api::return-policy.return-policy',
    title: 'Return Policy',
    pageContent: RETURN_POLICY_CONTENT,
  },
];

async function enablePublicFind(strapi: Core.Strapi, apiUid: string) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    strapi.log.warn('Public role not found, skipping permission setup');
    return;
  }

  const existingPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
    where: {
      role: publicRole.id,
      action: `${apiUid}.find`,
    },
  });

  if (existingPermission) {
    return;
  }

  await strapi.db.query('plugin::users-permissions.permission').create({
    data: {
      action: `${apiUid}.find`,
      role: publicRole.id,
    },
  });
  strapi.log.info(`Enabled public find permission for ${apiUid}`);
}

async function seedPublishedDocument(strapi: Core.Strapi, seed: DocumentSeed) {
  const existingDocument = await strapi.documents(seed.uid).findFirst({});

  if (existingDocument) {
    return;
  }

  const createdDocument = await strapi.documents(seed.uid).create({
    data: {
      PageContent: seed.pageContent,
    },
  });

  await strapi.documents(seed.uid).publish({
    documentId: createdDocument.documentId,
  });

  strapi.log.info(`Seeded ${seed.title}`);
}

async function seedGlobalSettings(strapi: Core.Strapi) {
  const globalSettings = await strapi.documents('api::global-setting.global-setting').findFirst({});

  if (globalSettings) {
    return;
  }

  await strapi.documents('api::global-setting.global-setting').create({
    data: {
      ageGateEnabled: true,
      ageGateTtlDays: 30,
      ageGateTitle: 'Age Verification Required',
      ageGateMessage:
        'You must be 18 years or older to enter this site. By entering, you confirm that you are of legal age to view and purchase tobacco accessories.',
      handlingTimeDays: 3,
      dutiesDisclaimer:
        "International orders may be subject to import duties and taxes, which are the responsibility of the buyer. These charges are determined by your local customs office and are not included in our shipping fees.",
      announcementBarEnabled: true,
      announcementBarText: 'Free shipping on orders over $150 USD',
      announcementBarLink: '/collections',
      shippingPolicyNote:
        'All orders ship via FedEx International Priority from Nepal. A valid phone number is required for delivery. Please allow 3-5 business days for order processing before shipment.',
    },
  });

  strapi.log.info('Seeded Global Settings with default values');
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await Promise.all(
      contentTypesToEnable.map(async (apiUid) => {
        try {
          await enablePublicFind(strapi, apiUid);
        } catch (error) {
          strapi.log.warn(`Failed to enable public find for ${apiUid}: ${error}`);
        }
      })
    );

    await seedGlobalSettings(strapi);

    await Promise.all(
      documentsToSeed.map(async (seed) => {
        try {
          await seedPublishedDocument(strapi, seed);
        } catch (error) {
          strapi.log.warn(`Failed to seed ${seed.title}: ${error}`);
        }
      })
    );
  },
};

# Strapi Content API Contract

**Version**: Strapi 4.x
**Base URL**: `https://cms.blackeyesartisan.shop/api`
**Authentication**: Read-only API Token (Bearer token)

## Overview

The storefront consumes content from Strapi CMS for pages, policies, and global settings. All content is read-only from the storefront's perspective.

## Authentication

All requests must include the API token:

```http
Authorization: Bearer {STRAPI_READ_TOKEN}
```

## Content Types

### Global Settings (Singleton)

Settings that apply site-wide, configured once in Strapi.

```http
GET /api/global-settings
```

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "ageGateTtl": 30,
      "handlingTime": "5-7 business days",
      "dutiesDisclaimer": "International orders may be subject to import duties and taxes, which are the responsibility of the buyer. These charges are not included in the item price or shipping cost.",
      "currencySymbol": "$",
      "siteTitle": "Black Eyes Artisan",
      "siteDescription": "Handcrafted glass pipes from Nepal",
      "createdAt": "2026-01-15T00:00:00.000Z",
      "updatedAt": "2026-01-20T10:00:00.000Z",
      "publishedAt": "2026-01-15T00:00:00.000Z"
    }
  },
  "meta": {}
}
```

**TypeScript Type**:
```typescript
interface GlobalSettings {
  ageGateTtl: number          // Days to persist age verification
  handlingTime: string        // Display text for handling time
  dutiesDisclaimer: string    // Legal disclaimer for duties/taxes
  currencySymbol: string      // Currency symbol (USD: "$")
  siteTitle: string           // SEO site title
  siteDescription: string     // SEO site description
}
```

### Announcement Bar (Singleton)

Optional site-wide announcement banner.

```http
GET /api/announcement-bar
```

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "message": "Free shipping on orders over $100!",
      "isActive": true,
      "linkUrl": "/collections/new-arrivals",
      "linkText": "Shop Now",
      "backgroundColor": null,
      "createdAt": "2026-01-20T00:00:00.000Z",
      "updatedAt": "2026-01-25T10:00:00.000Z",
      "publishedAt": "2026-01-20T00:00:00.000Z"
    }
  },
  "meta": {}
}
```

**TypeScript Type**:
```typescript
interface AnnouncementBar {
  message: string
  isActive: boolean
  linkUrl: string | null
  linkText: string | null
  backgroundColor: string | null  // Hex color or null for default
}
```

### Pages (Collection)

Content pages like About, Contact, etc.

#### List All Pages

```http
GET /api/pages
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `filters[slug][$eq]` | string | Filter by exact slug |
| `populate` | string | Relations to populate (e.g., "seo,seo.ogImage") |
| `pagination[page]` | number | Page number |
| `pagination[pageSize]` | number | Results per page |

#### Get Page by Slug

```http
GET /api/pages?filters[slug][$eq]=about&populate=seo,seo.ogImage
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "About Black Eyes Artisan",
        "slug": "about",
        "content": "## Our Story\n\nBlack Eyes Artisan was born in the mountains of Nepal...",
        "seo": {
          "id": 1,
          "metaTitle": "About Us | Black Eyes Artisan",
          "metaDescription": "Learn about Black Eyes Artisan, handcrafted glass pipes made in Nepal.",
          "ogImage": {
            "data": {
              "id": 1,
              "attributes": {
                "url": "https://res.cloudinary.com/dllzefagw/image/upload/about-og.jpg",
                "width": 1200,
                "height": 630,
                "alternativeText": "Black Eyes Artisan workshop"
              }
            }
          }
        },
        "createdAt": "2026-01-10T00:00:00.000Z",
        "updatedAt": "2026-01-15T10:00:00.000Z",
        "publishedAt": "2026-01-10T00:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

**TypeScript Type**:
```typescript
interface Page {
  id: number
  title: string
  slug: string
  content: string  // Markdown or rich text
  seo: {
    metaTitle: string
    metaDescription: string
    ogImage: StrapiMedia | null
  } | null
}

interface StrapiMedia {
  url: string
  width: number
  height: number
  alternativeText: string | null
}
```

### Policies (Collection)

Legal and informational policy pages.

#### List All Policies

```http
GET /api/policies
```

#### Get Policy by Slug

```http
GET /api/policies?filters[slug][$eq]=shipping
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Shipping Policy",
        "slug": "shipping",
        "content": "## Shipping Information\n\n### Processing Time\n\nAll orders are handmade...",
        "category": "shipping",
        "createdAt": "2026-01-10T00:00:00.000Z",
        "updatedAt": "2026-01-15T10:00:00.000Z",
        "publishedAt": "2026-01-10T00:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

**TypeScript Type**:
```typescript
interface Policy {
  id: number
  title: string
  slug: string
  content: string
  category: "shipping" | "returns" | "privacy" | "terms"
}
```

**Expected Policies**:
| Slug | Category | Title |
|------|----------|-------|
| `shipping` | shipping | Shipping Policy |
| `returns` | returns | Returns & Refunds |
| `privacy` | privacy | Privacy Policy |
| `terms` | terms | Terms of Service |

## Webhook: Content Revalidation

When content is updated in Strapi, trigger Next.js revalidation.

### Strapi Webhook Configuration

**Event**: `entry.publish`, `entry.update`, `entry.unpublish`
**URL**: `https://www.blackeyesartisan.shop/api/revalidate`
**Method**: POST

### Webhook Payload

```json
{
  "event": "entry.update",
  "createdAt": "2026-01-29T12:00:00.000Z",
  "model": "page",
  "entry": {
    "id": 1,
    "slug": "about"
  }
}
```

### Storefront Revalidation Endpoint

```http
POST /api/revalidate
x-strapi-webhook-secret: {STRAPI_WEBHOOK_SECRET}
```

**Request Body** (from Strapi):
```json
{
  "event": "entry.update",
  "model": "page",
  "entry": {
    "id": 1,
    "slug": "about"
  }
}
```

**Response** (200 OK):
```json
{
  "revalidated": true,
  "paths": ["/about"]
}
```

## Error Handling

### Not Found (404)

```json
{
  "data": null,
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Not Found",
    "details": {}
  }
}
```

### Empty Result

When filtering returns no results:
```json
{
  "data": [],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 0,
      "total": 0
    }
  }
}
```

### Unauthorized (401)

```json
{
  "data": null,
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Missing or invalid credentials",
    "details": {}
  }
}
```

## Content Type Schemas (Strapi Admin)

These schemas should be configured in Strapi:

### global-settings (Single Type)
```json
{
  "kind": "singleType",
  "collectionName": "global_settings",
  "attributes": {
    "ageGateTtl": { "type": "integer", "default": 30, "required": true },
    "handlingTime": { "type": "string", "required": true },
    "dutiesDisclaimer": { "type": "text", "required": true },
    "currencySymbol": { "type": "string", "default": "$" },
    "siteTitle": { "type": "string", "required": true },
    "siteDescription": { "type": "text" }
  }
}
```

### announcement-bar (Single Type)
```json
{
  "kind": "singleType",
  "collectionName": "announcement_bars",
  "attributes": {
    "message": { "type": "string", "required": true },
    "isActive": { "type": "boolean", "default": false },
    "linkUrl": { "type": "string" },
    "linkText": { "type": "string" },
    "backgroundColor": { "type": "string" }
  }
}
```

### page (Collection Type)
```json
{
  "kind": "collectionType",
  "collectionName": "pages",
  "attributes": {
    "title": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "title", "required": true },
    "content": { "type": "richtext", "required": true },
    "seo": { "type": "component", "component": "shared.seo" }
  }
}
```

### policy (Collection Type)
```json
{
  "kind": "collectionType",
  "collectionName": "policies",
  "attributes": {
    "title": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "title", "required": true },
    "content": { "type": "richtext", "required": true },
    "category": {
      "type": "enumeration",
      "enum": ["shipping", "returns", "privacy", "terms"],
      "required": true
    }
  }
}
```

### shared.seo (Component)
```json
{
  "collectionName": "components_shared_seos",
  "attributes": {
    "metaTitle": { "type": "string", "required": true, "maxLength": 60 },
    "metaDescription": { "type": "text", "required": true, "maxLength": 160 },
    "ogImage": { "type": "media", "allowedTypes": ["images"] }
  }
}
```

## Caching Strategy

| Content Type | Cache Duration | Revalidation |
|--------------|----------------|--------------|
| Global Settings | 5 minutes | On webhook |
| Announcement Bar | 1 minute | On webhook |
| Pages | 1 hour | On webhook |
| Policies | 1 hour | On webhook |

```typescript
// Example fetch with ISR
async function getPage(slug: string) {
  const res = await fetch(
    `${STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}`,
    {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      next: { revalidate: 3600, tags: [`page-${slug}`] }
    }
  )
  return res.json()
}
```

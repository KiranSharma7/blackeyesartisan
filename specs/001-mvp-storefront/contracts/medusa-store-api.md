# Medusa Store API Contract

**Version**: Medusa 2.0
**Base URL**: `https://api.blackeyesartisan.shop`
**Authentication**: Publishable API Key (header: `x-publishable-api-key`)

## Overview

The storefront communicates with Medusa backend exclusively through the Store API. This document defines the endpoints used and their expected request/response formats.

## Authentication

All requests must include the publishable API key:

```http
x-publishable-api-key: pk_xxxxxxxxxxxxx
```

## Products

### List Products

```http
GET /store/products
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `expand` | string | Comma-separated relations to expand (e.g., "variants,images,collection") |
| `limit` | number | Max results (default: 100) |
| `offset` | number | Pagination offset |
| `collection_id` | string[] | Filter by collection IDs |
| `handle` | string | Filter by product handle (slug) |
| `is_giftcard` | boolean | Filter gift cards (set to false) |

**Response** (200 OK):
```json
{
  "products": [
    {
      "id": "prod_01ABC123",
      "title": "Aurora Spoon",
      "subtitle": "Handblown borosilicate glass",
      "description": "A unique piece featuring aurora-inspired color work...",
      "handle": "aurora-spoon",
      "status": "published",
      "thumbnail": "https://res.cloudinary.com/dllzefagw/image/upload/...",
      "images": [
        {
          "id": "img_01ABC",
          "url": "https://res.cloudinary.com/dllzefagw/image/upload/..."
        }
      ],
      "variants": [
        {
          "id": "variant_01ABC",
          "title": "Default",
          "sku": "AUR-SPOON-001",
          "inventory_quantity": 1,
          "allow_backorder": false,
          "manage_inventory": true,
          "prices": [
            {
              "id": "price_01ABC",
              "amount": 4500,
              "currency_code": "usd"
            }
          ]
        }
      ],
      "collection": {
        "id": "col_01ABC",
        "title": "Spoons",
        "handle": "spoons"
      },
      "created_at": "2026-01-15T10:00:00.000Z",
      "updated_at": "2026-01-20T15:30:00.000Z"
    }
  ],
  "count": 1,
  "offset": 0,
  "limit": 100
}
```

### Get Single Product

```http
GET /store/products/{id}
```

**Response**: Same as single product object above

## Collections

### List Collections

```http
GET /store/collections
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `expand` | string | Relations to expand |
| `limit` | number | Max results |
| `offset` | number | Pagination offset |
| `handle` | string | Filter by handle |

**Response** (200 OK):
```json
{
  "collections": [
    {
      "id": "col_01ABC",
      "title": "Spoons",
      "handle": "spoons",
      "metadata": {},
      "created_at": "2026-01-10T00:00:00.000Z",
      "updated_at": "2026-01-10T00:00:00.000Z"
    }
  ],
  "count": 1,
  "offset": 0,
  "limit": 100
}
```

### Get Collection with Products

```http
GET /store/collections/{id}?expand=products
```

## Cart Operations

### Create Cart

```http
POST /store/carts
```

**Request Body**:
```json
{
  "region_id": "reg_01ABC"
}
```

**Response** (201 Created):
```json
{
  "cart": {
    "id": "cart_01ABC123",
    "region_id": "reg_01ABC",
    "email": null,
    "items": [],
    "subtotal": 0,
    "shipping_total": 0,
    "tax_total": 0,
    "total": 0,
    "created_at": "2026-01-29T12:00:00.000Z"
  }
}
```

### Get Cart

```http
GET /store/carts/{id}
```

**Response** (200 OK):
```json
{
  "cart": {
    "id": "cart_01ABC123",
    "email": "customer@example.com",
    "billing_address": null,
    "shipping_address": {
      "first_name": "John",
      "last_name": "Doe",
      "address_1": "123 Main St",
      "city": "New York",
      "province": "NY",
      "postal_code": "10001",
      "country_code": "us",
      "phone": "+1234567890"
    },
    "items": [
      {
        "id": "item_01ABC",
        "title": "Aurora Spoon",
        "description": "Handblown borosilicate glass",
        "thumbnail": "https://...",
        "quantity": 1,
        "unit_price": 4500,
        "variant_id": "variant_01ABC",
        "subtotal": 4500,
        "total": 4500
      }
    ],
    "region": {
      "id": "reg_01ABC",
      "name": "International",
      "currency_code": "usd"
    },
    "shipping_methods": [],
    "subtotal": 4500,
    "shipping_total": 0,
    "tax_total": 0,
    "total": 4500
  }
}
```

### Add Line Item

```http
POST /store/carts/{id}/line-items
```

**Request Body**:
```json
{
  "variant_id": "variant_01ABC",
  "quantity": 1
}
```

**Response** (200 OK): Returns updated cart

**Error Response** (400 Bad Request):
```json
{
  "message": "Insufficient inventory for variant variant_01ABC"
}
```

### Update Line Item

```http
POST /store/carts/{cart_id}/line-items/{item_id}
```

**Request Body**:
```json
{
  "quantity": 2
}
```

### Remove Line Item

```http
DELETE /store/carts/{cart_id}/line-items/{item_id}
```

### Update Cart (Email, Addresses)

```http
POST /store/carts/{id}
```

**Request Body**:
```json
{
  "email": "customer@example.com",
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_1": "123 Main St",
    "address_2": "Apt 4B",
    "city": "New York",
    "province": "NY",
    "postal_code": "10001",
    "country_code": "us",
    "phone": "+1234567890"
  },
  "billing_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_1": "123 Main St",
    "city": "New York",
    "province": "NY",
    "postal_code": "10001",
    "country_code": "us",
    "phone": "+1234567890"
  }
}
```

### Add Shipping Method

```http
POST /store/carts/{id}/shipping-methods
```

**Request Body**:
```json
{
  "option_id": "so_01ABC"
}
```

### Create Payment Sessions

```http
POST /store/carts/{id}/payment-sessions
```

**Response**: Returns cart with available payment sessions

### Set Payment Session

```http
POST /store/carts/{id}/payment-session
```

**Request Body**:
```json
{
  "provider_id": "stripe"
}
```

### Complete Cart (Checkout)

```http
POST /store/carts/{id}/complete
```

**Response** (200 OK):
```json
{
  "type": "order",
  "data": {
    "id": "order_01ABC",
    "display_id": 1001,
    "status": "pending",
    "email": "customer@example.com",
    "items": [...],
    "shipping_address": {...},
    "subtotal": 4500,
    "shipping_total": 2500,
    "tax_total": 0,
    "total": 7000,
    "created_at": "2026-01-29T12:30:00.000Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "type": "cart",
  "data": {
    "id": "cart_01ABC",
    "...": "..."
  },
  "error": "Payment failed: Card declined"
}
```

## Orders

### Get Order

```http
GET /store/orders/{id}
```

**Response** (200 OK):
```json
{
  "order": {
    "id": "order_01ABC",
    "display_id": 1001,
    "status": "completed",
    "fulfillment_status": "shipped",
    "email": "customer@example.com",
    "shipping_address": {...},
    "items": [...],
    "fulfillments": [
      {
        "id": "ful_01ABC",
        "tracking_numbers": ["794644790132"],
        "tracking_links": [
          {
            "tracking_number": "794644790132",
            "url": "https://www.fedex.com/fedextrack/?trknbr=794644790132"
          }
        ],
        "shipped_at": "2026-01-30T10:00:00.000Z"
      }
    ],
    "total": 7000,
    "created_at": "2026-01-29T12:30:00.000Z"
  }
}
```

## Regions

### List Regions

```http
GET /store/regions
```

**Response** (200 OK):
```json
{
  "regions": [
    {
      "id": "reg_01ABC",
      "name": "International",
      "currency_code": "usd",
      "countries": [
        { "iso_2": "us", "name": "United States" },
        { "iso_2": "ca", "name": "Canada" },
        { "iso_2": "gb", "name": "United Kingdom" }
      ]
    }
  ]
}
```

## Shipping Options

### List Shipping Options for Cart

```http
GET /store/shipping-options/{cart_id}
```

**Response** (200 OK):
```json
{
  "shipping_options": [
    {
      "id": "so_01ABC",
      "name": "International Flat Rate (FedEx)",
      "amount": 2500,
      "is_return": false
    }
  ]
}
```

## Error Handling

All error responses follow this format:

```json
{
  "message": "Human-readable error message",
  "type": "error_type",
  "code": "ERROR_CODE"
}
```

Common error codes:
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `not_found` | 404 | Resource not found |
| `invalid_data` | 400 | Validation error |
| `insufficient_inventory` | 400 | Not enough stock |
| `payment_failed` | 400 | Payment processing error |
| `unauthorized` | 401 | Missing or invalid API key |

## Rate Limiting

| Endpoint Type | Limit |
|---------------|-------|
| Read (GET) | 100 req/min |
| Write (POST/PUT/DELETE) | 50 req/min |

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706529600
```

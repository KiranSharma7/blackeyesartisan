'use client'

import { useState, useMemo } from 'react'
import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import { isProductSoldOut } from '@lib/util/inventory'
import ProductImageGallery from '../image-gallery'
import VariantSelector from '../variant-selector'
import AddToCartButton from '../add-to-cart'
import SoldBadge from '../sold-badge'
import NotifyMeForm from '@modules/newsletter/components/notify-me-form'

interface ProductDetailProps {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default function ProductDetail({
  product,
  countryCode,
}: ProductDetailProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants?.[0]?.id || ''
  )

  const selectedVariant = useMemo(() => {
    return product.variants?.find((v) => v.id === selectedVariantId)
  }, [product.variants, selectedVariantId])

  const price = useMemo(() => {
    if (!selectedVariant?.calculated_price) return null
    return {
      amount: selectedVariant.calculated_price.calculated_amount,
      currency_code: selectedVariant.calculated_price.currency_code || 'usd',
    }
  }, [selectedVariant])

  const inStock = (selectedVariant?.inventory_quantity ?? 0) > 0
  const soldOut = isProductSoldOut(product)

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      {/* Image Gallery - Left Column */}
      <div className="lg:col-span-7 lg:sticky lg:top-32">
        <ProductImageGallery
          images={product.images || null}
          title={product.title || 'Product'}
        />
      </div>

      {/* Product Info - Right Column */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        {/* Title with SOLD badge for sold-out products */}
        <div>
          <div className="flex items-start gap-3 mb-2">
            <h1 className="font-display font-bold text-4xl md:text-5xl uppercase">
              {product.title}
            </h1>
            {soldOut && <SoldBadge size="lg" className="mt-2 shrink-0" />}
          </div>
          {price && (
            <p className="text-2xl font-bold">
              {convertToLocale({
                amount: price.amount,
                currency_code: price.currency_code,
              })}
            </p>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-base font-medium opacity-70 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Variant Selector */}
        {product.variants && product.variants.length > 1 && (
          <VariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariantId}
            onSelect={setSelectedVariantId}
          />
        )}

        {/* Add to Cart or Notify Me Form */}
        {soldOut ? (
          <NotifyMeForm productTitle={product.title || 'this product'} />
        ) : (
          <AddToCartButton
            variantId={selectedVariantId}
            countryCode={countryCode}
            inStock={inStock}
          />
        )}

        {/* Product Details Accordion */}
        <div className="border-t-2 border-ink/10 pt-6 space-y-4">
          {product.material && (
            <div className="flex justify-between text-sm">
              <span className="font-medium text-ink/60">Material</span>
              <span className="font-bold">{product.material}</span>
            </div>
          )}
          {product.weight && (
            <div className="flex justify-between text-sm">
              <span className="font-medium text-ink/60">Weight</span>
              <span className="font-bold">{product.weight}g</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="font-medium text-ink/60">Availability</span>
            <span
              className={`font-bold ${
                soldOut
                  ? 'text-acid'
                  : inStock
                  ? 'text-green-600'
                  : 'text-sun'
              }`}
            >
              {soldOut
                ? 'Sold Out'
                : inStock
                ? 'In Stock'
                : 'Selected variant unavailable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

import { HttpTypes } from '@medusajs/types'

/**
 * Check if a product is completely sold out (all variants have 0 inventory)
 * @param product - The product to check
 * @returns true if ALL variants have inventory_quantity === 0, false otherwise
 */
export function isProductSoldOut(product: HttpTypes.StoreProduct): boolean {
  // No variants means we can't determine stock status - assume available
  if (!product.variants || product.variants.length === 0) {
    return false
  }

  // Product is sold out only if ALL variants have zero inventory
  return product.variants.every(
    (variant) => (variant.inventory_quantity ?? 0) === 0
  )
}

/**
 * Check if a specific variant is sold out
 * @param variant - The variant to check
 * @returns true if inventory_quantity === 0
 */
export function isVariantSoldOut(
  variant: HttpTypes.StoreProductVariant | null | undefined
): boolean {
  if (!variant) return true
  return (variant.inventory_quantity ?? 0) === 0
}

/**
 * Get the total inventory count across all variants
 * @param product - The product to check
 * @returns Total inventory across all variants
 */
export function getTotalInventory(product: HttpTypes.StoreProduct): number {
  if (!product.variants || product.variants.length === 0) {
    return 0
  }

  return product.variants.reduce(
    (total, variant) => total + (variant.inventory_quantity ?? 0),
    0
  )
}

/**
 * Check if product has low stock (less than threshold)
 * @param product - The product to check
 * @param threshold - The threshold for low stock (default: 5)
 * @returns true if total inventory is > 0 but <= threshold
 */
export function isLowStock(
  product: HttpTypes.StoreProduct,
  threshold: number = 5
): boolean {
  const total = getTotalInventory(product)
  return total > 0 && total <= threshold
}

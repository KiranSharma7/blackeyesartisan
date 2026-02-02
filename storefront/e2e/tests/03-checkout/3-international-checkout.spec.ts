import { test, expect } from '@playwright/test'
import helpers from '../../utils/tests-helpers'

/**
 * E2E Tests for International Checkout with Required Phone Validation (US6)
 *
 * Tests:
 * 1. Checkout with US address and valid phone
 * 2. Checkout with international address (UK) and valid phone
 * 3. Phone validation error for invalid format
 * 4. Country selection updates phone placeholder
 * 5. Duties disclaimer displays correctly
 */

test.describe('International Checkout with Phone Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to shop and add a product to cart
    await page.goto('/us/shop')
    await helpers.waitForPageLoad(page)

    // Click on first product
    const firstProduct = page.locator('[data-testid="product-link"]').first()
    await firstProduct.click()
    await helpers.waitForPageLoad(page)

    // Add to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart")')
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click()
      // Wait for cart drawer or redirect
      await page.waitForTimeout(1000)
    }

    // Go to checkout
    await page.goto('/us/checkout')
    await helpers.waitForPageLoad(page)
  })

  test('should complete checkout with US address and valid phone', async ({
    page,
  }) => {
    // Fill shipping form
    await page.getByTestId('shipping-email-input').fill('test@example.com')
    await page.getByTestId('shipping-first-name-input').fill('John')
    await page.getByTestId('shipping-last-name-input').fill('Doe')
    await page.getByTestId('shipping-address-input').fill('123 Main St')
    await page.getByTestId('shipping-city-input').fill('New York')
    await page.getByTestId('shipping-postal-code-input').fill('10001')

    // Select US country (should already be default)
    await page.getByTestId('shipping-country-select').selectOption('us')

    // Fill valid US phone number
    await page.getByTestId('shipping-phone-input').fill('555-123-4567')

    // Submit form
    await page.locator('button:has-text("Continue to Shipping")').click()

    // Should proceed to delivery step
    await page.waitForURL(/checkout\?step=delivery/, { timeout: 10000 })
    expect(page.url()).toContain('step=delivery')
  })

  test('should complete checkout with UK address and valid phone', async ({
    page,
  }) => {
    // Fill shipping form
    await page.getByTestId('shipping-email-input').fill('uk.customer@example.com')
    await page.getByTestId('shipping-first-name-input').fill('James')
    await page.getByTestId('shipping-last-name-input').fill('Smith')
    await page.getByTestId('shipping-address-input').fill('10 Downing Street')
    await page.getByTestId('shipping-city-input').fill('London')
    await page.getByTestId('shipping-postal-code-input').fill('SW1A 2AA')

    // Select UK country
    await page.getByTestId('shipping-country-select').selectOption('gb')
    await page.waitForTimeout(500) // Wait for phone input to update

    // Fill valid UK phone number
    await page.getByTestId('shipping-phone-input').fill('7911 123456')

    // Submit form
    await page.locator('button:has-text("Continue to Shipping")').click()

    // Should proceed to delivery step
    await page.waitForURL(/checkout\?step=delivery/, { timeout: 10000 })
    expect(page.url()).toContain('step=delivery')
  })

  test('should show error for invalid phone format', async ({ page }) => {
    // Fill shipping form with invalid phone
    await page.getByTestId('shipping-email-input').fill('test@example.com')
    await page.getByTestId('shipping-first-name-input').fill('John')
    await page.getByTestId('shipping-last-name-input').fill('Doe')
    await page.getByTestId('shipping-address-input').fill('123 Main St')
    await page.getByTestId('shipping-city-input').fill('New York')
    await page.getByTestId('shipping-postal-code-input').fill('10001')

    // Select US country
    await page.getByTestId('shipping-country-select').selectOption('us')

    // Fill invalid phone number (too short)
    await page.getByTestId('shipping-phone-input').fill('123')

    // Blur the phone input to trigger validation
    await page.getByTestId('shipping-phone-input').blur()
    await page.waitForTimeout(500)

    // Should show validation error
    const phoneError = page.locator('text=Please enter a valid phone number')
    await expect(phoneError).toBeVisible({ timeout: 5000 })
  })

  test('should update phone placeholder when country changes', async ({
    page,
  }) => {
    // Get initial placeholder (US)
    const phoneInput = page.getByTestId('shipping-phone-input')

    // Select different countries and check placeholder updates
    await page.getByTestId('shipping-country-select').selectOption('gb')
    await page.waitForTimeout(500)

    // The calling code display should show +44 for UK
    const callingCodeDisplay = page.locator('text=+44')
    await expect(callingCodeDisplay).toBeVisible()

    // Change to Japan
    await page.getByTestId('shipping-country-select').selectOption('jp')
    await page.waitForTimeout(500)

    // The calling code display should show +81 for Japan
    const japanCallingCode = page.locator('text=+81')
    await expect(japanCallingCode).toBeVisible()

    // Change back to US
    await page.getByTestId('shipping-country-select').selectOption('us')
    await page.waitForTimeout(500)

    // The calling code display should show +1 for US
    const usCallingCode = page.locator('text=+1')
    await expect(usCallingCode).toBeVisible()
  })

  test('should display duties disclaimer in checkout summary', async ({
    page,
  }) => {
    // Check that duties disclaimer is visible in checkout summary
    const dutiesDisclaimer = page.locator('text=International Orders')
    await expect(dutiesDisclaimer).toBeVisible()

    // Check for disclaimer text (either from CMS or default)
    const disclaimerText = page.locator(
      'text=duties and taxes may apply'
    )
    await expect(disclaimerText).toBeVisible()
  })

  test('should display international shipping title when international country selected', async ({
    page,
  }) => {
    // Fill shipping form
    await page.getByTestId('shipping-email-input').fill('test@example.com')
    await page.getByTestId('shipping-first-name-input').fill('Hans')
    await page.getByTestId('shipping-last-name-input').fill('Mueller')
    await page.getByTestId('shipping-address-input').fill('Alexanderplatz 1')
    await page.getByTestId('shipping-city-input').fill('Berlin')
    await page.getByTestId('shipping-postal-code-input').fill('10178')

    // Select Germany
    await page.getByTestId('shipping-country-select').selectOption('de')
    await page.waitForTimeout(500)

    // Fill valid German phone number
    await page.getByTestId('shipping-phone-input').fill('30 12345678')

    // Submit form
    await page.locator('button:has-text("Continue to Shipping")').click()

    // Wait for delivery step
    await page.waitForURL(/checkout\?step=delivery/, { timeout: 10000 })

    // Now the duties disclaimer should show "International Shipping" since we have an international address
    const internationalShipping = page.locator('text=International Shipping')
    await expect(internationalShipping).toBeVisible()
  })

  test('should require phone number (not submit without it)', async ({
    page,
  }) => {
    // Fill shipping form WITHOUT phone
    await page.getByTestId('shipping-email-input').fill('test@example.com')
    await page.getByTestId('shipping-first-name-input').fill('John')
    await page.getByTestId('shipping-last-name-input').fill('Doe')
    await page.getByTestId('shipping-address-input').fill('123 Main St')
    await page.getByTestId('shipping-city-input').fill('New York')
    await page.getByTestId('shipping-postal-code-input').fill('10001')
    await page.getByTestId('shipping-country-select').selectOption('us')

    // Don't fill phone - leave it empty

    // Submit form
    await page.locator('button:has-text("Continue to Shipping")').click()

    // Wait a bit for validation
    await page.waitForTimeout(500)

    // Should show phone required error
    const phoneError = page.locator(
      'text=Phone number is required for international shipping'
    )
    await expect(phoneError).toBeVisible({ timeout: 5000 })

    // Should NOT navigate to delivery step
    expect(page.url()).not.toContain('step=delivery')
  })
})

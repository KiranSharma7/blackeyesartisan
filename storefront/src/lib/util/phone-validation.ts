/**
 * Phone Validation Utilities with International Support
 * Uses libphonenumber-js for country-aware phone validation
 */
import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
  CountryCode,
  getExampleNumber,
  AsYouType,
} from 'libphonenumber-js'
import examples from 'libphonenumber-js/mobile/examples'

/**
 * Country to phone code mapping for placeholder generation
 */
export const COUNTRY_PHONE_CODES: Record<string, string> = {
  us: '+1',
  ca: '+1',
  gb: '+44',
  au: '+61',
  de: '+49',
  fr: '+33',
  es: '+34',
  it: '+39',
  jp: '+81',
  nl: '+31',
  mx: '+52',
  br: '+55',
  nz: '+64',
  at: '+43',
  be: '+32',
  ch: '+41',
  dk: '+45',
  fi: '+358',
  ie: '+353',
  no: '+47',
  pl: '+48',
  pt: '+351',
  se: '+46',
  sg: '+65',
  kr: '+82',
  hk: '+852',
}

/**
 * Validates a phone number for a specific country
 * @param phone - The phone number string to validate
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., 'us', 'gb')
 * @returns true if valid, false otherwise
 */
export const validatePhone = (phone: string, countryCode: string): boolean => {
  if (!phone || typeof phone !== 'string') return false

  const country = countryCode.toUpperCase() as CountryCode

  try {
    return isValidPhoneNumber(phone, country)
  } catch {
    // If country code is invalid, try parsing without country
    return isValidPhoneNumber(phone)
  }
}

/**
 * Validates phone and returns an error message if invalid
 * @param phone - The phone number string to validate
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns null if valid, error message string if invalid
 */
export const validatePhoneWithMessage = (
  phone: string,
  countryCode: string
): string | null => {
  if (!phone || typeof phone !== 'string' || phone.trim() === '') {
    return 'Phone number is required for international shipping'
  }

  const country = countryCode.toUpperCase() as CountryCode

  try {
    if (!isValidPhoneNumber(phone, country)) {
      const example = getPhonePlaceholder(countryCode)
      return `Please enter a valid phone number (e.g., ${example})`
    }
  } catch {
    return 'Please enter a valid phone number'
  }

  return null
}

/**
 * Parses and formats a phone number to E.164 international format
 * @param phone - The phone number string
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Formatted phone number or original string if parsing fails
 */
export const formatPhoneE164 = (phone: string, countryCode: string): string => {
  if (!phone) return ''

  const country = countryCode.toUpperCase() as CountryCode

  try {
    const parsed = parsePhoneNumberFromString(phone, country)
    if (parsed && parsed.isValid()) {
      return parsed.format('E.164')
    }
  } catch {
    // Return original if parsing fails
  }

  return phone
}

/**
 * Formats a phone number for display (national format)
 * @param phone - The phone number string
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Formatted phone number or original string if parsing fails
 */
export const formatPhoneNational = (
  phone: string,
  countryCode: string
): string => {
  if (!phone) return ''

  const country = countryCode.toUpperCase() as CountryCode

  try {
    const parsed = parsePhoneNumberFromString(phone, country)
    if (parsed && parsed.isValid()) {
      return parsed.formatNational()
    }
  } catch {
    // Return original if parsing fails
  }

  return phone
}

/**
 * Formats a phone number for international display
 * @param phone - The phone number string
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Formatted phone number or original string if parsing fails
 */
export const formatPhoneInternational = (
  phone: string,
  countryCode: string
): string => {
  if (!phone) return ''

  const country = countryCode.toUpperCase() as CountryCode

  try {
    const parsed = parsePhoneNumberFromString(phone, country)
    if (parsed && parsed.isValid()) {
      return parsed.formatInternational()
    }
  } catch {
    // Return original if parsing fails
  }

  return phone
}

/**
 * Gets a placeholder phone number for a specific country
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Example phone number formatted for display
 */
export const getPhonePlaceholder = (countryCode: string): string => {
  const country = countryCode.toUpperCase() as CountryCode

  try {
    const example = getExampleNumber(country, examples)
    if (example) {
      return example.formatInternational()
    }
  } catch {
    // Fallback to simple format
  }

  // Fallback placeholders
  const code = COUNTRY_PHONE_CODES[countryCode.toLowerCase()] || '+1'
  return `${code} 555 123 4567`
}

/**
 * Formats phone input as user types (for real-time formatting)
 * @param phone - Current phone input value
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Partially formatted phone string
 */
export const formatPhoneAsYouType = (
  phone: string,
  countryCode: string
): string => {
  if (!phone) return ''

  const country = countryCode.toUpperCase() as CountryCode

  try {
    const formatter = new AsYouType(country)
    return formatter.input(phone)
  } catch {
    return phone
  }
}

/**
 * Gets the phone country calling code
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Country calling code with + prefix (e.g., '+1', '+44')
 */
export const getCountryCallingCode = (countryCode: string): string => {
  return COUNTRY_PHONE_CODES[countryCode.toLowerCase()] || '+1'
}

/**
 * Validates if a string looks like it might be a phone number
 * Less strict than full validation - used for preliminary checks
 * @param value - String to check
 * @returns true if it looks like a phone number
 */
export const looksLikePhoneNumber = (value: string): boolean => {
  if (!value) return false
  // Remove all non-digit characters except + for country code
  const digits = value.replace(/[^\d+]/g, '')
  // Should have at least 7 digits and start with optional +
  return /^\+?\d{7,15}$/.test(digits)
}

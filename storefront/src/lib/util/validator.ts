import validator from 'validator'
import * as Yup from 'yup'

export type ValidationError = {
  field: string
  message: string
}

/**
 * Email validation regex - matches standard email format
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates an email address format
 * @param email - The email string to validate
 * @returns true if valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false
  return EMAIL_REGEX.test(email.trim())
}

/**
 * Validates email and returns an error message if invalid
 * @param email - The email string to validate
 * @returns null if valid, error message string if invalid
 */
export const validateEmailWithMessage = (email: string): string | null => {
  if (!email || typeof email !== 'string') {
    return 'Email is required'
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Please enter a valid email address'
  }
  return null
}

export const validatePhoneNumber = (number) => {
  const isValidPhoneNumber = validator.isMobilePhone(number)
  return isValidPhoneNumber
}

export const validatePassword = (password: string): string[] => {
  const unmetRequirements: string[] = []

  if (password.length < 8) {
    unmetRequirements.push('At least 8 characters')
  }
  if (!/[a-z]/.test(password)) {
    unmetRequirements.push('One lowercase letter')
  }
  if (!/[A-Z]/.test(password)) {
    unmetRequirements.push('One uppercase letter')
  }
  if (
    !/[0-9]/.test(password) &&
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    unmetRequirements.push('One number or symbol')
  }

  return unmetRequirements
}

const billingFormValidationSchema = Yup.object({
  first_name: Yup.string().required('Please enter first name'),
  last_name: Yup.string().required('Please enter last name'),
  address_1: Yup.string().required('Please enter address'),
  city: Yup.string().required('Please enter city'),
  country_code: Yup.string().required('Please select country'),
  postal_code: Yup.string().required('Please enter postal code'),
  phone: Yup.number().required('Please enter phone number'),
})

export const checkoutFormValidationSchema = Yup.object({
  shipping_address: Yup.object({
    first_name: Yup.string().required('Please enter first name'),
    last_name: Yup.string().required('Please enter last name'),
    address_1: Yup.string().required('Please enter address'),
    city: Yup.string().required('Please enter city'),
    country_code: Yup.string().required('Please select country'),
    postal_code: Yup.string().required('Please enter postal code'),
    phone: Yup.number()
      .required('Please enter phone number')
      .typeError('Phone number must contain only digits'),
  }),
  billing_address: Yup.object().when('same_as_shipping', {
    is: false,
    then: () => billingFormValidationSchema,
    otherwise: () => Yup.object().notRequired(),
  }),
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter email'),
  same_as_shipping: Yup.boolean(),
})

export const userShippingAddressFormValidationSchema = Yup.object({
  first_name: Yup.string().required('Please enter first name'),
  last_name: Yup.string().required('Please enter last name'),
  address_1: Yup.string().required('Please enter address'),
  city: Yup.string().required('Please enter city'),
  country_code: Yup.string().required('Please select country'),
  postal_code: Yup.string().required('Please enter postal code'),
  phone: Yup.number()
    .required('Please enter phone number')
    .typeError('Phone number must contain only digits'),
  company: Yup.string().optional(),
  is_default_shipping: Yup.boolean().optional(),
  province: Yup.string().optional(),
})

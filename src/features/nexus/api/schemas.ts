/**
 * Nexus Admin Zod Schemas
 * Validation schemas for forms and API payloads
 */

import { z } from 'zod';

// ============================================
// Utility Validators
// ============================================

/**
 * Luhn algorithm check for credit card validation.
 * @param cardNumber - Credit card number string (digits only)
 * @returns true if valid according to Luhn algorithm
 */
export function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// ============================================
// Settings Wizard Schemas
// ============================================

/**
 * Step 1: Company Details Schema
 */
export const companyDetailsSchema = z.object({
  logo: z.union([
    z.instanceof(File).optional(),
    z.string().url().optional(),
  ]).optional(),
  name: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be at most 100 characters'),
  taxId: z.string()
    .min(5, 'Tax ID must be at least 5 characters')
    .max(20, 'Tax ID must be at most 20 characters')
    .regex(/^[A-Z0-9-]+$/i, 'Tax ID can only contain letters, numbers, and hyphens'),
});

export type CompanyDetailsSchema = z.infer<typeof companyDetailsSchema>;

/**
 * Step 2: Address Schema
 * Conditional validation: If country is US, state is required; otherwise, region is used.
 */
export const companyAddressSchema = z.object({
  street: z.string()
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address must be at most 200 characters'),
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be at most 100 characters'),
  country: z.string()
    .min(2, 'Country is required')
    .max(100, 'Country must be at most 100 characters'),
  state: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  postalCode: z.string()
    .min(3, 'Postal code must be at least 3 characters')
    .max(20, 'Postal code must be at most 20 characters'),
}).refine(
  (data) => {
    // If country is US, state is required
    if (data.country.toUpperCase() === 'US' || data.country.toUpperCase() === 'UNITED STATES') {
      return data.state && data.state.length > 0;
    }
    return true;
  },
  {
    message: 'State is required for US addresses',
    path: ['state'],
  }
);

export type CompanyAddressSchema = z.infer<typeof companyAddressSchema>;

/**
 * Step 3: Plan Selection Schema
 */
export const planSelectionSchema = z.object({
  plan: z.enum(['starter', 'professional', 'enterprise'], {
    message: 'Please select a plan',
  }),
});

export type PlanSelectionSchema = z.infer<typeof planSelectionSchema>;

/**
 * Step 4: Payment Details Schema
 * Includes Luhn algorithm validation for credit card number.
 */
export const paymentDetailsSchema = z.object({
  cardNumber: z.string()
    .min(13, 'Card number must be at least 13 digits')
    .max(19, 'Card number must be at most 19 digits')
    .regex(/^[\d\s-]+$/, 'Card number can only contain digits, spaces, and hyphens')
    .refine(
      (val) => isValidLuhn(val),
      { message: 'Invalid card number (failed Luhn check)' }
    ),
  cardholderName: z.string()
    .min(2, 'Cardholder name must be at least 2 characters')
    .max(100, 'Cardholder name must be at most 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Cardholder name can only contain letters, spaces, hyphens, and apostrophes'),
  expiryMonth: z.string()
    .regex(/^(0[1-9]|1[0-2])$/, 'Invalid expiry month (01-12)')
    .length(2, 'Expiry month must be 2 digits'),
  expiryYear: z.string()
    .regex(/^\d{2}$/, 'Invalid expiry year (YY format)')
    .length(2, 'Expiry year must be 2 digits')
    .refine(
      (val) => {
        const currentYear = new Date().getFullYear() % 100;
        const year = parseInt(val, 10);
        return year >= currentYear && year <= currentYear + 20;
      },
      { message: 'Card has expired or expiry year is too far in the future' }
    ),
  cvv: z.string()
    .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
    .min(3, 'CVV must be at least 3 digits')
    .max(4, 'CVV must be at most 4 digits'),
});

export type PaymentDetailsSchema = z.infer<typeof paymentDetailsSchema>;

/**
 * Complete Onboarding Wizard Schema
 */
export const onboardingWizardSchema = z.object({
  companyDetails: companyDetailsSchema,
  address: companyAddressSchema,
  planSelection: planSelectionSchema,
  paymentDetails: paymentDetailsSchema,
});

export type OnboardingWizardSchema = z.infer<typeof onboardingWizardSchema>;

// ============================================
// User Schemas
// ============================================

/**
 * User filter schema.
 */
export const userFiltersSchema = z.object({
  roles: z.array(z.enum(['admin', 'editor', 'viewer', 'member'])).optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended']).optional(),
  joinedDateRange: z.object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  }).optional(),
});

export type UserFiltersSchema = z.infer<typeof userFiltersSchema>;

/**
 * Bulk delete schema.
 */
export const bulkDeleteSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1, 'At least one user must be selected'),
});

export type BulkDeleteSchema = z.infer<typeof bulkDeleteSchema>;

/**
 * User status update schema (for inline edit).
 */
export const userStatusUpdateSchema = z.object({
  status: z.enum(['active', 'inactive', 'pending', 'suspended']),
});

export type UserStatusUpdateSchema = z.infer<typeof userStatusUpdateSchema>;

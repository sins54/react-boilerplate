/**
 * Nexus Admin Feature Module
 * Multi-Tenant SaaS Admin Portal
 */

// Types
export type {
  Organization,
  OrganizationState,
  NexusUser,
  UserRole,
  UserStatus,
  UserFilters,
  PaginatedUsersResponse,
  BulkDeleteRequest,
  BulkDeleteResponse,
  CompanyDetails,
  CompanyAddress,
  CompanyPlan,
  PlanSelection,
  PaymentDetails,
  OnboardingWizardData,
  RevenueDataPoint,
  UserLocation,
  AnalyticsData,
  NexusPermission,
} from './types';

export { VIEWER_PERMISSIONS, ADMIN_PERMISSIONS } from './types';

// Store
export {
  OrganizationProvider,
  useOrganization,
  useCurrentOrgId,
  getStoredOrgId,
  setStoredOrgId,
  removeStoredOrgId,
} from './store';

// Components
export {
  OrganizationSwitcher,
  createUserColumns,
} from './components';

// Schemas
export {
  isValidLuhn,
  companyDetailsSchema,
  companyAddressSchema,
  planSelectionSchema,
  paymentDetailsSchema,
  onboardingWizardSchema,
  userFiltersSchema,
  bulkDeleteSchema,
  userStatusUpdateSchema,
} from './api/schemas';

export type {
  CompanyDetailsSchema,
  CompanyAddressSchema,
  PlanSelectionSchema,
  PaymentDetailsSchema,
  OnboardingWizardSchema,
  UserFiltersSchema,
  BulkDeleteSchema,
  UserStatusUpdateSchema,
} from './api/schemas';

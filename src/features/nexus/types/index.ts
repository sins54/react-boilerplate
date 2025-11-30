/**
 * Nexus Admin Types
 * Type definitions for the Multi-Tenant SaaS Admin Portal
 */

// ============================================
// Organization Types
// ============================================

/**
 * Organization entity structure.
 */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  createdAt: string;
  memberCount: number;
}

/**
 * Organization state for context.
 */
export interface OrganizationState {
  currentOrg: Organization | null;
  organizations: Organization[];
  isLoading: boolean;
}

// ============================================
// User Types (for Mega User Table)
// ============================================

/**
 * User role options.
 */
export type UserRole = 'admin' | 'editor' | 'viewer' | 'member';

/**
 * User status options.
 */
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

/**
 * User entity structure for the Mega User Table.
 */
export interface NexusUser {
  id: string;
  avatar: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string | null;
  joinedAt: string;
  department?: string;
}

/**
 * User filter options.
 */
export interface UserFilters {
  roles?: UserRole[];
  status?: UserStatus;
  joinedDateRange?: {
    from: string;
    to: string;
  };
}

/**
 * Paginated users response.
 */
export interface PaginatedUsersResponse {
  data: NexusUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Bulk delete request payload.
 */
export interface BulkDeleteRequest {
  userIds: string[];
}

/**
 * Bulk delete response.
 */
export interface BulkDeleteResponse {
  deleted: number;
  failed: string[];
}

// ============================================
// Settings Wizard Types
// ============================================

/**
 * Company plan options.
 */
export type CompanyPlan = 'starter' | 'professional' | 'enterprise';

/**
 * Settings Wizard Step 1: Company Details.
 */
export interface CompanyDetails {
  logo?: File | string;
  name: string;
  taxId: string;
}

/**
 * Settings Wizard Step 2: Address.
 */
export interface CompanyAddress {
  street: string;
  city: string;
  country: string;
  state?: string;  // Required if country is US
  region?: string; // Used if country is not US
  postalCode: string;
}

/**
 * Settings Wizard Step 3: Plan Selection.
 */
export interface PlanSelection {
  plan: CompanyPlan;
}

/**
 * Settings Wizard Step 4: Payment Details.
 */
export interface PaymentDetails {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

/**
 * Complete Settings Wizard Form Data.
 */
export interface OnboardingWizardData {
  companyDetails: CompanyDetails;
  address: CompanyAddress;
  planSelection: PlanSelection;
  paymentDetails: PaymentDetails;
}

// ============================================
// Analytics Types
// ============================================

/**
 * Revenue data point.
 */
export interface RevenueDataPoint {
  timestamp: string;
  revenue: number;
  orders: number;
}

/**
 * User location data for map.
 */
export interface UserLocation {
  country: string;
  countryCode: string;
  users: number;
  percentage: number;
}

/**
 * Analytics dashboard data.
 */
export interface AnalyticsData {
  revenue: {
    current: number;
    change: number;
    chartData: RevenueDataPoint[];
  };
  users: {
    total: number;
    active: number;
    new: number;
    locations: UserLocation[];
  };
  lastUpdated: string;
}

// ============================================
// RBAC Types
// ============================================

/**
 * Nexus-specific permissions.
 */
export type NexusPermission =
  | 'VIEW_DASHBOARD'
  | 'VIEW_USERS'
  | 'EDIT_USERS'
  | 'DELETE_USERS'
  | 'VIEW_SETTINGS'
  | 'EDIT_SETTINGS'
  | 'VIEW_ANALYTICS';

/**
 * Viewer role permissions (limited).
 */
export const VIEWER_PERMISSIONS: NexusPermission[] = ['VIEW_DASHBOARD'];

/**
 * Admin role permissions (full).
 */
export const ADMIN_PERMISSIONS: NexusPermission[] = [
  'VIEW_DASHBOARD',
  'VIEW_USERS',
  'EDIT_USERS',
  'DELETE_USERS',
  'VIEW_SETTINGS',
  'EDIT_SETTINGS',
  'VIEW_ANALYTICS',
];

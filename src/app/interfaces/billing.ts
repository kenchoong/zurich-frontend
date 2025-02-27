/**
 * Billing related interfaces
 */

/**
 * Represents a billing record in the system
 */
export interface BillingRecord {
  id: number;
  productId: string;
  location: string;
  premiumPaidAmount: number;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a new billing record
 */
export interface CreateBillingRecord {
  productCode: string;
  location: string;
  premiumPaid: number;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
}

/**
 * Data for updating an existing billing record
 */
export interface UpdateBillingRecord {
  location: string;
  premiumPaid: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
}

/**
 * Filters for querying billing records
 */
export interface BillingRecordFilters {
  productCode?: string;
  location?: string;
}

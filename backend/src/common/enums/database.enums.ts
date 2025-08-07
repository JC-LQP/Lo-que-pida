// User roles enum
export enum UserRole {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

// Order status enum
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

// Payment provider enum
export enum PaymentProvider {
  STRIPE = 'stripe',
  KUSHKI = 'kushki',
  LOCAL = 'local',
}

// Payment status enum
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

// Product condition enum
export enum ProductCondition {
  NEW = 'NEW',
  USED = 'USED',
  REFURBISHED = 'REFURBISHED',
}

// Seller status enum
export enum SellerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

// Subscription billing cycle enum
export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

// Subscription plan enum
export enum SubscriptionPlan {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

// Subscription status enum
export enum SubscriptionStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
}

# Complete Database Schema Documentation

> **Generated on:** 2025-08-07T19:19:39.469Z
> **Source:** Schema File + Live Supabase Database
> **Project:** Lo-que-pida E-commerce Platform

---

## Overview

This document contains the **complete database schema** for the **Lo-que-pida** e-commerce platform, combining schema definitions with live database statistics.

### Schema Statistics
- **Total Tables:** 16
- **Total Enums:** 9
- **Total Columns:** 102
- **Database Type:** PostgreSQL (Supabase)

### Architecture
This is a comprehensive e-commerce platform supporting:
- **User Management** - Users, customers, sellers with role-based access
- **Product Catalog** - Categories, products, inventory management
- **Shopping Experience** - Carts, orders, order items
- **Payment Processing** - Multiple payment providers and statuses
- **Fulfillment** - Shipping, addresses, warehouses
- **Business Features** - Reviews, subscriptions, seller management

---

## Table of Contents

### Database Tables
- [addresses](#addresses)
- [cart_items](#cart-items)
- [carts](#carts)
- [categories](#categories)
- [customers](#customers)
- [inventory](#inventory)
- [order_items](#order-items)
- [orders](#orders)
- [payments](#payments)
- [product_reviews](#product-reviews)
- [products](#products)
- [sellers](#sellers)
- [shipping_info](#shipping-info)
- [subscriptions](#subscriptions)
- [users](#users)
- [warehouse](#warehouse)

### Enums
- [Database Enums](#database-enums)

---

## Database Enums

The database uses several enumerated types to enforce data integrity and provide predefined value sets:

### orders_status_enum
**Values:** `pending` | `processing` | `shipped` | `delivered` | `cancelled`

### payments_provider_enum
**Values:** `stripe` | `kushki` | `local`

### payments_status_enum
**Values:** `pending` | `paid` | `failed`

### products_condition_enum
**Values:** `NEW` | `USED` | `REFURBISHED`

### sellers_status_enum
**Values:** `active` | `inactive` | `banned`

### subscriptions_billingcycle_enum
**Values:** `monthly` | `yearly`

### subscriptions_plan_enum
**Values:** `basic` | `premium` | `enterprise`

### subscriptions_status_enum
**Values:** `paid` | `unpaid`

### users_role_enum
**Values:** `customer` | `seller` | `admin`

---

## addresses

Customer delivery and billing addresses.
**Row Count:** 1 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `recipientName` | character | ❌ | `-` | - |
| `streetAddress` | character | ❌ | `-` | - |
| `city` | character | ❌ | `-` | - |
| `province` | character | ❌ | `-` | - |
| `country` | character | ❌ | `-` | - |
| `postalCode` | character | ✅ | `-` | - |
| `phoneNumber` | character | ✅ | `-` | - |
| `isDefault` | boolean | ❌ | `false` | - |
| `customer_id` | uuid | ❌ | `-` | 🔗 Foreign Key |
| `created_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `updated_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
### Sample Data

```json
[
  {
    "id": "46fe0539-e6f5-4636-8cef-a3f1ced78002",
    "recipientName": "Jane Doe",
    "streetAddress": "123 Main Street, Apt 4B",
    "city": "New York",
    "province": "NY",
    "country": "USA",
    "postalCode": "10001",
    "phoneNumber": "+1-555-0123",
    "isDefault": true,
    "customer_id": "772a3d10-6cb8-4fdc-b8e9-ffe97a31018c",
    "created_at": "2025-08-07T16:10:42.888312",
    "updated_at": "2025-08-07T16:10:42.888312"
  }
]
```

---

## cart_items

Individual items within shopping carts.
**Row Count:** 2 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `quantity` | integer | ❌ | `1` | - |
| `cartId` | uuid | ✅ | `-` | - |
| `productId` | uuid | ✅ | `-` | - |
### Sample Data

```json
[
  {
    "id": "2007c29c-ff14-471b-b098-2e59a5a59b42",
    "quantity": 1,
    "cartId": "97026e44-ab1d-4d83-94d8-b888b64a9490",
    "productId": "973aa063-e418-483d-a84c-20ba35be2b36"
  },
  {
    "id": "3ce01e66-d6f5-4b5c-ab59-096ba00a01bb",
    "quantity": 2,
    "cartId": "97026e44-ab1d-4d83-94d8-b888b64a9490",
    "productId": "148649c2-e90d-47ec-b98d-5127ca5f0087"
  }
]
```

---

## carts

Shopping cart sessions for customers.
**Row Count:** 1 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `created_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `customerId` | uuid | ❌ | `-` | - |
### Sample Data

```json
[
  {
    "id": "97026e44-ab1d-4d83-94d8-b888b64a9490",
    "created_at": "2025-08-07T16:10:55.065901",
    "customerId": "772a3d10-6cb8-4fdc-b8e9-ffe97a31018c"
  }
]
```

---

## categories

Product categorization with hierarchical support.
**Row Count:** 1 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `name` | character | ❌ | `-` | - |
| `description` | character | ✅ | `-` | - |
| `parentId` | uuid | ✅ | `-` | - |
### Sample Data

```json
[
  {
    "id": "86830b5f-39ee-409b-9ab2-a84948dadfb6",
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "parentId": null
  }
]
```

---

## customers

Customer profiles linked to user accounts.
**Row Count:** 1 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `created_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `user_id` | uuid | ✅ | `-` | 🔗 Foreign Key |
### Sample Data

```json
[
  {
    "id": "772a3d10-6cb8-4fdc-b8e9-ffe97a31018c",
    "created_at": "2025-08-07T15:48:11.588576",
    "user_id": "70079b86-36cb-4524-89f3-a17462a578ba"
  }
]
```

---

## inventory

Stock management and availability tracking.
**Row Count:** 2 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `stock` | integer | ❌ | `-` | - |
| `reserved_stock` | integer | ❌ | `0` | - |
| `sold_stock` | integer | ❌ | `0` | - |
| `created_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `updated_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `categoryId` | uuid | ❌ | `-` | - |
### Sample Data

```json
[
  {
    "id": "e8eaa352-1f45-4d03-8bd5-8fe1f32abc5a",
    "stock": 100,
    "reserved_stock": 0,
    "sold_stock": 0,
    "created_at": "2025-08-07T15:41:31.364957",
    "updated_at": "2025-08-07T15:41:31.364957",
    "categoryId": "86830b5f-39ee-409b-9ab2-a84948dadfb6"
  },
  {
    "id": "0742140b-906f-4ca3-9f6f-f48b7a511193",
    "stock": 100,
    "reserved_stock": 0,
    "sold_stock": 0,
    "created_at": "2025-08-07T15:52:02.520573",
    "updated_at": "2025-08-07T15:52:02.520573",
    "categoryId": "86830b5f-39ee-409b-9ab2-a84948dadfb6"
  }
]
```

---

## order_items

Line items within customer orders.
**Row Count:** 2 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `order_id` | uuid | ❌ | `-` | 🔗 Foreign Key |
| `product_id` | uuid | ❌ | `-` | 🔗 Foreign Key |
| `quantity` | integer | ❌ | `-` | - |
| `unit_price` | numeric(10 | ❌ | `-` | - |
### Sample Data

```json
[
  {
    "order_id": "7708e643-4dc6-4810-bce9-45693ed24289",
    "product_id": "973aa063-e418-483d-a84c-20ba35be2b36",
    "quantity": 2,
    "unit_price": 799.99
  },
  {
    "order_id": "a9505c2e-2fae-4354-930c-9a8b32bf1af8",
    "product_id": "973aa063-e418-483d-a84c-20ba35be2b36",
    "quantity": 2,
    "unit_price": 799.99
  }
]
```

---

## orders

Customer orders with status tracking.
**Row Count:** 2 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `status` | public.orders_status_enum | ❌ | `pending::public.orders_status_enum` | 🏷️ Enum |
| `total` | numeric(10 | ❌ | `-` | - |
| `created_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `updated_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `customer_id` | uuid | ✅ | `-` | 🔗 Foreign Key |
### Sample Data

```json
[
  {
    "id": "7708e643-4dc6-4810-bce9-45693ed24289",
    "status": "shipped",
    "total": 1599.98,
    "created_at": "2025-08-07T15:48:34.562331",
    "updated_at": "2025-08-07T15:48:34.562331",
    "customer_id": "772a3d10-6cb8-4fdc-b8e9-ffe97a31018c"
  },
  {
    "id": "a9505c2e-2fae-4354-930c-9a8b32bf1af8",
    "status": "processing",
    "total": 1599.98,
    "created_at": "2025-08-07T16:27:13.416272",
    "updated_at": "2025-08-07T16:27:13.416272",
    "customer_id": "772a3d10-6cb8-4fdc-b8e9-ffe97a31018c"
  }
]
```

---

## payments

Payment processing and transaction records.
**Row Count:** 1 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `provider` | public.payments_provider_enum | ❌ | `-` | 🏷️ Enum |
| `status` | public.payments_status_enum | ❌ | `pending::public.payments_status_enum` | 🏷️ Enum |
| `transaction_id` | character | ✅ | `-` | 🔗 Foreign Key |
| `created_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `order_id` | uuid | ✅ | `-` | 🔗 Foreign Key |
### Sample Data

```json
[
  {
    "id": "e9b2cd19-a1aa-464a-8c88-b042aa97ef27",
    "provider": "stripe",
    "status": "paid",
    "transaction_id": "txn_1754584040511",
    "created_at": "2025-08-07T16:27:20.539037",
    "order_id": "a9505c2e-2fae-4354-930c-9a8b32bf1af8"
  }
]
```

---

## product_reviews

Customer reviews and ratings for products.
**Row Count:** 1 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `rating` | integer | ❌ | `-` | - |
| `comment` | text | ❌ | `-` | - |
| `created_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `updated_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `userId` | uuid | ❌ | `-` | - |
| `productId` | uuid | ❌ | `-` | - |
### Sample Data

```json
[
  {
    "id": "b063ed9c-d005-40e6-a4a0-5d5b30463f23",
    "rating": 2,
    "comment": "Great product! Fast delivery and excellent quality. Highly recommended!",
    "created_at": "2025-08-07T16:11:27.658331",
    "updated_at": "2025-08-07T16:11:27.658331",
    "userId": "70079b86-36cb-4524-89f3-a17462a578ba",
    "productId": "973aa063-e418-483d-a84c-20ba35be2b36"
  }
]
```

---

## products

Product catalog with pricing and inventory links.
**Row Count:** 2 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `name` | character | ❌ | `-` | - |
| `description` | character | ✅ | `-` | - |
| `price` | numeric(10 | ❌ | `-` | - |
| `condition` | public.products_condition_enum | ❌ | `-` | 🏷️ Enum |
| `created_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `updated_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `sellerId` | uuid | ✅ | `-` | - |
| `inventoryId` | uuid | ✅ | `-` | - |
### Sample Data

```json
[
  {
    "id": "973aa063-e418-483d-a84c-20ba35be2b36",
    "name": "Smartphone X1",
    "description": "Latest smartphone with amazing features",
    "price": 799.99,
    "condition": "NEW",
    "created_at": "2025-08-07T15:41:31.719382",
    "updated_at": "2025-08-07T15:41:31.719382",
    "sellerId": null,
    "inventoryId": "e8eaa352-1f45-4d03-8bd5-8fe1f32abc5a"
  },
  {
    "id": "148649c2-e90d-47ec-b98d-5127ca5f0087",
    "name": "Smartphone X1",
    "description": "Latest smartphone with amazing features",
    "price": 799.99,
    "condition": "NEW",
    "created_at": "2025-08-07T15:52:02.860888",
    "updated_at": "2025-08-07T15:52:02.860888",
    "sellerId": "2ed5b7b0-756b-42d3-95d6-0badc8fbd755",
    "inventoryId": "0742140b-906f-4ca3-9f6f-f48b7a511193"
  }
]
```

---

## sellers

Seller/merchant profiles with store information.
**Row Count:** 1 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `store_name` | character | ❌ | `-` | - |
| `store_description` | text | ✅ | `-` | - |
| `store_logo` | character | ✅ | `-` | - |
| `status` | public.sellers_status_enum | ❌ | `active::public.sellers_status_enum` | 🏷️ Enum |
| `created_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `user_id` | uuid | ❌ | `-` | 🔗 Foreign Key |
| `subscription_id` | uuid | ✅ | `-` | 🔗 Foreign Key |
### Sample Data

```json
[
  {
    "id": "2ed5b7b0-756b-42d3-95d6-0badc8fbd755",
    "store_name": "Electronics Store 1754581696656",
    "store_description": "Your one-stop shop for electronics",
    "store_logo": null,
    "status": "active",
    "created_at": "2025-08-07T15:48:16.716142",
    "user_id": "c3f9c3d9-fdf1-438b-9f34-462c5ffefd24",
    "subscription_id": "8fc02815-4528-45f3-8509-f171e139cd47"
  }
]
```

---

## shipping_info

Shipping details and tracking information.
**Row Count:** 1 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `shipping_method` | character | ❌ | `-` | - |
| `tracking_number` | character | ✅ | `-` | - |
| `carrier_name` | character | ✅ | `-` | - |
| `order_id` | uuid | ✅ | `-` | 🔗 Foreign Key |
| `address_id` | uuid | ✅ | `-` | 🔗 Foreign Key |
| `estimated_delivery_date` | timestamp | ✅ | `-` | - |
### Sample Data

```json
[
  {
    "id": "a817f6db-d3ba-4ea4-b74e-3f052e7cf099",
    "shipping_method": "Express Delivery",
    "tracking_number": "TRACK1754583049549",
    "carrier_name": "FedEx",
    "order_id": "7708e643-4dc6-4810-bce9-45693ed24289",
    "address_id": "46fe0539-e6f5-4636-8cef-a3f1ced78002",
    "estimated_delivery_date": "2025-08-10T16:10:49.549"
  }
]
```

---

## subscriptions

Seller subscription plans and billing.
**Row Count:** 1 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `plan` | public.subscriptions_plan_enum | ❌ | `-` | 🏷️ Enum |
| `billingCycle` | public.subscriptions_billingcycle_enum | ❌ | `-` | 🏷️ Enum |
| `status` | public.subscriptions_status_enum | ❌ | `unpaid::public.subscriptions_status_enum` | 🏷️ Enum |
| `start_date` | timestamp | ❌ | `-` | - |
| `end_date` | timestamp | ❌ | `-` | - |
| `created_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `sellerId` | uuid | ✅ | `-` | - |
### Sample Data

```json
[
  {
    "id": "8fc02815-4528-45f3-8509-f171e139cd47",
    "plan": "premium",
    "billingCycle": "monthly",
    "status": "paid",
    "start_date": "2025-08-07T16:11:47.234",
    "end_date": "2025-09-06T16:11:47.234",
    "created_at": "2025-08-07T16:11:47.30279",
    "sellerId": "2ed5b7b0-756b-42d3-95d6-0badc8fbd755"
  }
]
```

---

## users

Core user accounts with authentication and role management.
**Row Count:** 2 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `email` | character | ❌ | `-` | 📧 Email |
| `full_name` | character | ✅ | `-` | - |
| `role` | public.users_role_enum | ❌ | `-` | 🏷️ Enum |
| `is_verified` | boolean | ❌ | `false` | - |
| `created_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `firebase_uid` | character | ✅ | `-` | - |
| `profile_image` | text | ✅ | `-` | - |
### Sample Data

```json
[
  {
    "id": "70079b86-36cb-4524-89f3-a17462a578ba",
    "email": "test@example.com",
    "full_name": "Test User",
    "role": "customer",
    "is_verified": true,
    "created_at": "2025-08-07T15:38:26.547038",
    "firebase_uid": "test_1754581106281",
    "profile_image": null
  },
  {
    "id": "c3f9c3d9-fdf1-438b-9f34-462c5ffefd24",
    "email": "seller1754581696499@example.com",
    "full_name": "John Seller",
    "role": "seller",
    "is_verified": true,
    "created_at": "2025-08-07T15:48:16.564653",
    "firebase_uid": "seller_1754581696499",
    "profile_image": null
  }
]
```

---

## warehouse

Fulfillment centers and inventory locations.
**Row Count:** 1 records
**Status:** ✅ Has Data

### Columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ❌ | `gen_random_uuid()` | - |
| `name` | character | ❌ | `-` | - |
| `created_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `updated_at` | timestamp | ❌ | `now()` | 📅 Timestamp |
| `seller_id` | uuid | ✅ | `-` | 🔗 Foreign Key |
| `address_id` | uuid | ❌ | `-` | 🔗 Foreign Key |
### Sample Data

```json
[
  {
    "id": "241a124c-0cba-4e02-b971-fe85beb5bcf2",
    "name": "Main Distribution Center",
    "created_at": "2025-08-07T16:11:35.736919",
    "updated_at": "2025-08-07T16:11:35.736919",
    "seller_id": "2ed5b7b0-756b-42d3-95d6-0badc8fbd755",
    "address_id": "46fe0539-e6f5-4636-8cef-a3f1ced78002"
  }
]
```

---

---

## Schema Analysis

### Key Relationships
- **Users** have roles (customer, seller, admin) and link to **customers** or **sellers**
- **Products** belong to **categories** and have **inventory** records
- **Orders** contain **order_items** and belong to **customers**
- **Carts** contain **cart_items** for shopping sessions
- **Sellers** have **subscriptions** and manage **warehouses**
- **Addresses** are used for both **customers** and **warehouses**

### Data Flow
1. **User Registration** → Creates **users** record
2. **Role Assignment** → Creates **customers** or **sellers** profile
3. **Product Management** → **Sellers** create **products** with **inventory**
4. **Shopping** → **Customers** add items to **carts**
5. **Checkout** → **Carts** become **orders** with **payments**
6. **Fulfillment** → **Orders** get **shipping_info** from **warehouses**

### Business Rules
- All tables use UUID primary keys for scalability
- Timestamps track creation and updates
- Enums enforce data integrity
- Foreign key relationships maintain referential integrity
- Soft deletes and status fields support business workflows

---

## Maintenance Notes

This documentation combines:
- **Schema structure** from database dump
- **Live data statistics** from Supabase queries
- **Business context** for understanding relationships

### How to Update
1. Export new schema: `pg_dump --schema-only`
2. Regenerate documentation
3. Review business logic changes
4. Update API endpoints as needed

---

*Generated by Lo-que-pida Enhanced Schema Generator*

# Complete Database Audit Report

**Generated:** Comprehensive analysis of entire codebase  
**Scope:** All backend API routes, frontend components, services, and database schema  
**Method:** Static code analysis of actual field usage

---

## Executive Summary

- **Total Tables:** 16
- **Fully Unused Tables:** 0 (but 1 table has no functional implementation)
- **Tables with Unused Fields:** 13
- **Total Unused Fields Identified:** 35+
- **Fields with Zero Usage:** 25
- **Fields with Display-Only Usage (No Business Logic):** 10

---

## A. Fields That Can Be Removed Immediately (Zero Dependency)

These fields have **zero usage** anywhere in the codebase - not in queries, filters, responses, business logic, or frontend.

| Table | Field | Type | Reason It's Unused | Why Safe to Remove |
|-------|-------|------|-------------------|-------------------|
| `brands` | `logo_url` | String? | Never queried, set, or displayed | No FK constraints, only relation exists |
| `brands` | `website_url` | String? | Never queried, set, or displayed | No FK constraints, only relation exists |
| `brands` | `description` | String? | Never queried, set, or displayed | No FK constraints, only relation exists |
| `brands` | `created_at` | DateTime? | Never queried, set, or displayed | No FK constraints, only relation exists |
| `cart_items` | `added_at` | DateTime? | Never queried, filtered, or displayed | No FK constraints |
| `categories` | `parent_id` | String? | Hierarchical categories not implemented | Has FK but no queries use it |
| `order_items` | `created_at` | DateTime? | Never queried, filtered, or displayed | No FK constraints |
| `products` | `compare_at_price_cents` | Int? | Never queried, set, or displayed | No FK constraints |
| `products` | `dimensions_cm` | Json? | Never queried, set, or displayed | No FK constraints |
| `products` | `is_trending` | Boolean? | Never queried, filtered, or displayed | No FK constraints |
| `products` | `published_at` | DateTime? | Never queried, set, or displayed | No FK constraints |
| `product_images` | `alt_text` | String? | Set during creation but never queried/displayed | No FK constraints |
| `product_images` | `uploaded_at` | DateTime? | Never queried, filtered, or displayed | No FK constraints |
| `product_specifications` | `sort_order` | Int? | Exists but not used in ordering queries | No FK constraints |
| `product_variants` | `image_url` | String? | Never queried, set, or displayed | No FK constraints |
| `product_variants` | `created_at` | DateTime? | Never queried, filtered, or displayed | No FK constraints |
| `reviews` | `helpful_count` | Int? | Helpful vote feature not implemented | No FK constraints |
| `reviews` | `updated_at` | DateTime? | Never queried, filtered, or displayed | No FK constraints |
| `user_addresses` | `type` | address_type? | Has default but never queried/filtered/used | No FK constraints |
| `users` | `email_verified` | Boolean? | Email verification not implemented | No FK constraints |
| `users` | `updated_at` | DateTime? | Never queried, filtered, or displayed | No FK constraints |
| `wishlists` | `added_at` | DateTime? | Never queried, filtered, or displayed | No FK constraints |

**Total: 22 fields safe to remove immediately**

---

## B. Fields That Are Unused BUT Have Dependencies

These fields are unused in business logic but have dependencies or are displayed (read-only).

| Table | Field | Dependency Type | Risk Level | Recommendation |
|-------|-------|----------------|------------|----------------|
| `categories` | `parent_id` | FK constraint to `categories.id` | **Medium** | Remove FK first, then field. Only if hierarchical categories not planned |
| `orders` | `coupon_id` | FK constraint to `coupons.id` | **Low** | Coupon relation exists but never set. Can remove FK and field if coupons not planned |
| `products` | `brand_id` | FK constraint to `brands.id` | **Medium** | Brand relation included but brand fields unused. Keep if brand management planned |
| `wishlists` | `user_id` | FK constraint to `users.id` | **High** | Part of composite PK. Table has no API but used in product deletion |
| `wishlists` | `product_id` | FK constraint to `products.id` | **High** | Part of composite PK. Table has no API but used in product deletion |

### Display-Only Fields (No Business Logic)

These fields are **displayed in frontend** but **never set or used in business logic**:

| Table | Field | Usage | Risk Level | Recommendation |
|-------|-------|-------|------------|----------------|
| `orders` | `discount_cents` | Displayed in admin order details | **Low** | Displayed but never calculated/set. Remove if discount logic not planned |
| `orders` | `billing_address` | Displayed in admin order details | **Low** | Displayed but never set during order creation. Remove if billing not needed |
| `orders` | `payment_gateway_ref` | Displayed in admin order details | **Low** | Displayed but never set. Remove if payment gateway integration not planned |
| `orders` | `shipped_at` | Displayed in admin order details | **Low** | Displayed but never set. Remove if shipping tracking not planned |
| `orders` | `delivered_at` | Displayed in admin order details | **Low** | Displayed but never set. Remove if delivery tracking not planned |
| `orders` | `notes` | Displayed in admin order details | **Low** | Displayed but never set. Remove if order notes not planned |
| `order_tracking` | `location` | Displayed in frontend | **Low** | Displayed but never set in API. Remove if location tracking not planned |
| `order_tracking` | `tracking_number` | Displayed in frontend | **Low** | Displayed but never set in API. Remove if tracking numbers not planned |
| `order_tracking` | `carrier` | Displayed in frontend | **Low** | Displayed but never set in API. Remove if carrier info not planned |
| `order_tracking` | `description` | Displayed in frontend | **Low** | Displayed but never set in API. Remove if tracking descriptions not planned |

**Total: 10 display-only fields**

---

## C. Tables That Are Fully Unused

### `coupons` Table

| Aspect | Status |
|--------|--------|
| **Queries** | Only included via relation in admin order queries |
| **API Endpoints** | None exist |
| **Creation Logic** | None - `coupon_id` never set during order creation |
| **Validation Logic** | None |
| **Business Logic** | None - discount calculation doesn't use coupons |
| **Frontend Usage** | Only displayed if coupon exists (but none ever created) |
| **Safe to Delete?** | **YES** - No functional implementation. Relation can be removed from orders table |

**Recommendation:** Remove `coupons` table entirely if coupon functionality is not planned. The relation in `orders.coupon_id` should also be removed.

### `wishlists` Table

| Aspect | Status |
|--------|--------|
| **Queries** | Only referenced in product deletion (`deleteMany`) |
| **API Endpoints** | None exist |
| **Creation Logic** | None |
| **Business Logic** | None - no wishlist functionality |
| **Frontend Usage** | None |
| **Safe to Delete?** | **PARTIALLY** - Used in product deletion cascade. Keep if wishlist feature planned, otherwise remove and update deletion logic |

**Recommendation:** If wishlist feature is not planned, remove table and update product deletion to not reference wishlists.

---

## D. Additional Analysis

### Fields Included But Never Consumed

These fields are included in queries via `include` but the returned data is never accessed:

1. **`brands` relation in products** - Included in admin product queries but brand fields (`logo_url`, `website_url`, `description`, `created_at`) are never accessed
2. **`coupons` relation in orders** - Included in admin order queries, displayed but never set or validated

### Hidden Dependencies

1. **`categories.parent_id`** - Has self-referential FK but no hierarchical category logic exists
2. **`wishlists` table** - Used in product deletion cascade but no wishlist API exists
3. **`orders.coupon_id`** - FK exists but coupon is never set during order creation

### Enums That Are Unused

1. **`promo_applies_to`** - Enum exists but no promotions table/model exists
2. **`promo_discount_type`** - Enum exists but no promotions table/model exists

These enums suggest planned features that were never implemented.

---

## E. Prioritized Cleanup Plan

### 🔴 High Priority (Remove Safely - Zero Usage)

**Immediate Action:** These can be removed without any impact.

1. **`brands` table fields:**
   - `logo_url`, `website_url`, `description`, `created_at`
   - **Impact:** None - fields never accessed
   - **Migration:** Simple column drops

2. **`products` table fields:**
   - `compare_at_price_cents`, `dimensions_cm`, `is_trending`, `published_at`
   - **Impact:** None - fields never used
   - **Migration:** Simple column drops

3. **`reviews` table fields:**
   - `helpful_count`, `updated_at`
   - **Impact:** None - features not implemented
   - **Migration:** Simple column drops

4. **`users` table fields:**
   - `email_verified`, `updated_at`
   - **Impact:** None - features not implemented
   - **Migration:** Simple column drops

5. **`cart_items.added_at`**
   - **Impact:** None
   - **Migration:** Simple column drop

6. **`order_items.created_at`**
   - **Impact:** None
   - **Migration:** Simple column drop

7. **`product_images.alt_text`, `uploaded_at`**
   - **Impact:** None (alt_text set but never read)
   - **Migration:** Simple column drops

8. **`product_variants.image_url`, `created_at`**
   - **Impact:** None
   - **Migration:** Simple column drops

9. **`product_specifications.sort_order`**
   - **Impact:** None (exists but not used in ordering)
   - **Migration:** Simple column drop

10. **`user_addresses.type`**
    - **Impact:** None (has default but never used)
    - **Migration:** Simple column drop

11. **`wishlists.added_at`**
    - **Impact:** None
    - **Migration:** Simple column drop

**Estimated Cleanup:** 22 fields across 11 tables

---

### 🟡 Medium Priority (Review Before Removal)

**Action Required:** Review business requirements before removal.

1. **`categories.parent_id`**
   - **Reason:** Hierarchical categories not implemented
   - **Risk:** Medium (has FK constraint)
   - **Decision:** Remove if hierarchical categories not planned
   - **Migration:** Drop FK first, then column

2. **`orders.coupon_id` + `coupons` table**
   - **Reason:** Coupon functionality not implemented
   - **Risk:** Low (relation exists but never set)
   - **Decision:** Remove if coupons not planned
   - **Migration:** Drop FK, drop coupon_id, drop coupons table

3. **`wishlists` table**
   - **Reason:** Wishlist functionality not implemented
   - **Risk:** Medium (used in product deletion)
   - **Decision:** Remove if wishlist feature not planned
   - **Migration:** Update product deletion logic, drop table

4. **Display-only order fields:**
   - `discount_cents`, `billing_address`, `payment_gateway_ref`, `shipped_at`, `delivered_at`, `notes`
   - **Reason:** Displayed but never set
   - **Risk:** Low
   - **Decision:** Remove if features not planned
   - **Migration:** Simple column drops (update frontend first)

5. **Display-only tracking fields:**
   - `location`, `tracking_number`, `carrier`, `description` in `order_tracking`
   - **Reason:** Displayed but never set
   - **Risk:** Low
   - **Decision:** Remove if advanced tracking not planned
   - **Migration:** Simple column drops (update frontend first)

**Estimated Cleanup:** 1 table + 15 fields across 2 tables

---

### 🟢 Low Priority (Keep If Future Features Planned)

**Recommendation:** Keep these if related features are planned.

1. **`products.brand_id` + `brands` table**
   - **Reason:** Brand relation exists, brand management may be planned
   - **Action:** Keep if brand management planned, otherwise remove

2. **Audit trail fields:**
   - `created_at` fields (if not already used)
   - **Reason:** Useful for analytics and audit trails
   - **Action:** Keep for future analytics

3. **Timestamp fields:**
   - Various `created_at`, `updated_at` fields
   - **Reason:** Useful for debugging and audit trails
   - **Action:** Keep if audit trails needed

---

## F. Migration Script Suggestions

### Prisma Migration (Recommended)

// Remove immediately (High Priority)
model brands {
  id          String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name        String     @unique @db.VarChar(150)
  slug        String     @unique @db.VarChar(150)
  // REMOVED: logo_url, website_url, description, created_at
  products    products[]
}

model cart_items {
  id                 String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  cart_id            String?           @db.Uuid
  product_id         String?           @db.Uuid
  variant_id         String?           @db.Uuid
  quantity           Int
  price_at_add_cents Int
  // REMOVED: added_at
  carts              carts?            @relation(fields: [cart_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
  products           products?         @relation(fields: [product_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
  product_variants   product_variants? @relation(fields: [variant_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
}

model products {
  id                     String                   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  sku                    String                   @unique @db.VarChar(100)
  name                   String                   @db.VarChar(255)
  slug                   String                   @unique @db.VarChar(255)
  short_description      String?
  full_description       String?
  category_id            String?                  @db.Uuid
  brand_id               String?                  @db.Uuid
  scale                  String?                  @db.VarChar(20)
  material               material_type?
  is_rc                  Boolean?                 @default(false)
  is_preorder            Boolean?                 @default(false)
  stock_quantity         Int?                     @default(0)
  price_cents            Int
  // REMOVED: compare_at_price_cents
  weight_grams           Decimal?                 @db.Decimal(8, 2)
  // REMOVED: dimensions_cm
  rating_avg             Decimal?                 @default(0) @db.Decimal(3, 2)
  review_count           Int?                     @default(0)
  is_featured            Boolean?                 @default(false)
  // REMOVED: is_trending
  status                 product_status?          @default(draft)
  // REMOVED: published_at
  created_at             DateTime?                @default(now()) @db.Timestamptz(6)
  updated_at             DateTime?                @default(now()) @db.Timestamptz(6)
  is_bestseller          Boolean?                 @default(false)
  filter_type            String?
  // ... relations
}

model product_images {
  id          String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  product_id  String?   @db.Uuid
  image_url   String
  // REMOVED: alt_text
  sort_order  Int?      @default(0)
  is_primary  Boolean?  @default(false)
  // REMOVED: uploaded_at
  products    products? @relation(fields: [product_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
}

model product_specifications {
  id         String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  product_id String?   @db.Uuid
  spec_key   String    @db.VarChar(100)
  spec_value String
  // REMOVED: sort_order
  products   products? @relation(fields: [product_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
}

model product_variants {
  id                     String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  product_id             String?       @db.Uuid
  sku_suffix             String?       @db.VarChar(50)
  variant_name           String?       @db.VarChar(150)
  price_adjustment_cents Int?          @default(0)
  stock_quantity         Int?          @default(0)
  // REMOVED: image_url
  // REMOVED: created_at
  cart_items             cart_items[]
  order_items            order_items[]
  products               products?     @relation(fields: [product_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
}

model reviews {
  id                   String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  product_id           String?   @db.Uuid
  user_id              String?
  rating               Int?
  title                String?   @db.VarChar(200)
  comment              String?
  is_verified_purchase Boolean?  @default(false)
  // REMOVED: helpful_count
  created_at           DateTime? @default(now()) @db.Timestamptz(6)
  // REMOVED: updated_at
  products             products? @relation(fields: [product_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
  users                users?    @relation(fields: [user_id], references: [id], onUpdate: NoAction)
}

model user_addresses {
  id             String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id        String?
  // REMOVED: type
  recipient_name String?       @db.VarChar(150)
  street_line1   String        @db.VarChar(255)
  street_line2   String?       @db.VarChar(255)
  city           String        @db.VarChar(100)
  state          String?       @db.VarChar(100)
  postal_code    String        @db.VarChar(20)
  country        String        @db.VarChar(100)
  is_default     Boolean?      @default(false)
  created_at     DateTime?     @default(now()) @db.Timestamptz(6)
  users          users?        @relation(fields: [user_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
}

model users {
  id                 String               @id
  email              String               @unique @db.VarChar(255)
  password_hash      String
  first_name         String?              @db.VarChar(100)
  last_name          String?              @db.VarChar(100)
  phone              String?              @db.VarChar(20)
  role               user_role?           @default(customer)
  is_active          Boolean?             @default(true)
  // REMOVED: email_verified
  created_at         DateTime?            @default(now()) @db.Timestamptz(6)
  // REMOVED: updated_at
  carts              carts[]
  orders             orders[]
  preorder_enquiries preorder_enquiries[]
  reviews            reviews[]
  user_addresses     user_addresses[]
  wishlists          wishlists[]
}

model wishlists {
  user_id    String
  product_id String    @db.Uuid
  // REMOVED: added_at
  products   products  @relation(fields: [product_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
  users      users     @relation(fields: [user_id], references: [id], onDelete: Cascade, onUpdate: NoAction)

  @@id([user_id, product_id])
}

// Remove categories.parent_id if hierarchical categories not needed
model categories {
  id               String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name             String       @unique @db.VarChar(100)
  slug             String       @unique @db.VarChar(100)
  description      String?
  image_url        String?
  // REMOVED: parent_id (if hierarchical categories not needed)
  sort_order       Int?         @default(0)
  is_active        Boolean?     @default(true)
  created_at       DateTime?    @default(now()) @db.Timestamptz(6)
  // REMOVED: categories relation if parent_id removed
  products         products[]
}

// Remove coupons table if not needed
// model coupons {
//   ... entire table
// }

// Remove coupon_id from orders if coupons removed
model orders {
  id                  String           @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  order_number        String           @unique @db.VarChar(20)
  user_id             String?
  guest_email         String?          @db.VarChar(255)
  status              order_status?    @default(pending)
  subtotal_cents      Int
  tax_cents           Int?             @default(0)
  shipping_cents      Int?             @default(0)
  // REMOVED: discount_cents (if discount logic not implemented)
  total_cents         Int
  // REMOVED: coupon_id (if coupons table removed)
  shipping_address    Json
  // REMOVED: billing_address (if billing not needed)
  payment_method      payment_method?
  payment_status      payment_status?  @default(pending)
  // REMOVED: payment_gateway_ref (if payment gateway not integrated)
  placed_at           DateTime?        @default(now()) @db.Timestamptz(6)
  // REMOVED: shipped_at, delivered_at (if tracking not implemented)
  // REMOVED: notes (if order notes not needed)
  order_items         order_items[]
  order_tracking      order_tracking[]
  // REMOVED: coupons relation
  users               users?           @relation(fields: [user_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
}

// Remove unused tracking fields if advanced tracking not needed
model order_tracking {
  id              String          @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  order_id        String?         @db.Uuid
  status          tracking_status
  // REMOVED: location
  // REMOVED: description
  // REMOVED: tracking_number
  // REMOVED: carrier
  tracked_at      DateTime?       @default(now()) @db.Timestamptz(6)
  orders          orders?         @relation(fields: [order_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
}

model order_items {
  id                String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  order_id          String?           @db.Uuid
  product_id        String?           @db.Uuid
  variant_id        String?           @db.Uuid
  product_name      String            @db.VarChar(255)
  product_sku       String            @db.VarChar(100)
  quantity          Int
  unit_price_cents  Int
  total_price_cents Int
  // REMOVED: created_at
  orders            orders?           @relation(fields: [order_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
  products          products?         @relation(fields: [product_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
  product_variants  product_variants? @relation(fields: [variant_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
}### SQL Migration Script (Alternative)

-- High Priority Removals (Zero Usage)
ALTER TABLE brands DROP COLUMN IF EXISTS logo_url;
ALTER TABLE brands DROP COLUMN IF EXISTS website_url;
ALTER TABLE brands DROP COLUMN IF EXISTS description;
ALTER TABLE brands DROP COLUMN IF EXISTS created_at;

ALTER TABLE cart_items DROP COLUMN IF EXISTS added_at;

ALTER TABLE order_items DROP COLUMN IF EXISTS created_at;

ALTER TABLE products DROP COLUMN IF EXISTS compare_at_price_cents;
ALTER TABLE products DROP COLUMN IF EXISTS dimensions_cm;
ALTER TABLE products DROP COLUMN IF EXISTS is_trending;
ALTER TABLE products DROP COLUMN IF EXISTS published_at;

ALTER TABLE product_images DROP COLUMN IF EXISTS alt_text;
ALTER TABLE product_images DROP COLUMN IF EXISTS uploaded_at;

ALTER TABLE product_specifications DROP COLUMN IF EXISTS sort_order;

ALTER TABLE product_variants DROP COLUMN IF EXISTS image_url;
ALTER TABLE product_variants DROP COLUMN IF EXISTS created_at;

ALTER TABLE reviews DROP COLUMN IF EXISTS helpful_count;
ALTER TABLE reviews DROP COLUMN IF EXISTS updated_at;

ALTER TABLE user_addresses DROP COLUMN IF EXISTS type;

ALTER TABLE users DROP COLUMN IF EXISTS email_verified;
ALTER TABLE users DROP COLUMN IF EXISTS updated_at;

ALTER TABLE wishlists DROP COLUMN IF EXISTS added_at;

-- Medium Priority Removals (Review First)
-- Only execute if features not planned:

-- Remove hierarchical categories
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_parent_id_fkey;
ALTER TABLE categories DROP COLUMN IF EXISTS parent_id;

-- Remove coupons (if not planned)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_coupon_id_fkey;
ALTER TABLE orders DROP COLUMN IF EXISTS coupon_id;
DROP TABLE IF EXISTS coupons;

-- Remove display-only order fields (if not planned)
ALTER TABLE orders DROP COLUMN IF EXISTS discount_cents;
ALTER TABLE orders DROP COLUMN IF EXISTS billing_address;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_gateway_ref;
ALTER TABLE orders DROP COLUMN IF EXISTS shipped_at;
ALTER TABLE orders DROP COLUMN IF EXISTS delivered_at;
ALTER TABLE orders DROP COLUMN IF EXISTS notes;

-- Remove display-only tracking fields (if not planned)
ALTER TABLE order_tracking DROP COLUMN IF EXISTS location;
ALTER TABLE order_tracking DROP COLUMN IF EXISTS description;
ALTER TABLE order_tracking DROP COLUMN IF EXISTS tracking_number;
ALTER TABLE order_tracking DROP COLUMN IF EXISTS carrier;

-- Remove wishlists table (if not planned)
-- First update product deletion logic to not reference wishlists
DROP TABLE IF EXISTS wishlists;---

## G. Warnings for Potential Hidden Dependencies

### ⚠️ Fields in Frontend But Not Set in Backend

These fields are **displayed in frontend** but **never set during creation/update**:

1. **`orders.discount_cents`** - Displayed in admin but never calculated
2. **`orders.billing_address`** - Displayed in admin but never set
3. **`orders.payment_gateway_ref`** - Displayed in admin but never set
4. **`orders.shipped_at`** - Displayed in admin but never set
5. **`orders.delivered_at`** - Displayed in admin but never set
6. **`orders.notes`** - Displayed in admin but never set
7. **`order_tracking.location`** - Displayed but never set
8. **`order_tracking.tracking_number`** - Displayed but never set
9. **`order_tracking.carrier`** - Displayed but never set
10. **`order_tracking.description`** - Displayed but never set

**Action Required:** Either implement the logic to set these fields OR remove them from frontend and database.

### ⚠️ Fields Included But Never Consumed

1. **`brands` relation** - Included in product queries but brand fields never accessed
2. **`coupons` relation** - Included in order queries, displayed but never set

**Action Required:** Either use these fields OR remove the includes to optimize queries.

### ⚠️ Enums Without Tables

1. **`promo_applies_to`** - Enum exists but no promotions table
2. **`promo_discount_type`** - Enum exists but no promotions table

**Action Required:** Remove unused enums if promotions feature not planned.

---

## H. Summary Statistics

### By Category

| Category | Count | Tables Affected |
|----------|-------|----------------|
| **Zero Usage Fields** | 22 | 11 |
| **Display-Only Fields** | 10 | 2 |
| **Unused Tables** | 1 | 1 |
| **Unused Enums** | 2 | 0 |
| **Total Cleanup Opportunities** | 35+ | 13 |

### By Priority

| Priority | Count | Risk Level |
|----------|-------|------------|
| **High (Remove Safely)** | 22 fields | Zero risk |
| **Medium (Review First)** | 1 table + 15 fields | Low-Medium risk |
| **Low (Keep If Planned)** | 0 | N/A |

---

## I. Recommended Action Plan

### Phase 1: Immediate Cleanup (High Priority)
1. Remove 22 zero-usage fields
2. Update Prisma schema
3. Generate and run migration
4. Test thoroughly

### Phase 2: Review & Decision (Medium Priority)
1. Review business requirements for:
   - Coupon functionality
   - Wishlist functionality
   - Hierarchical categories
   - Advanced order tracking
   - Billing addresses
   - Payment gateway integration
2. Make decisions on each feature
3. Remove unused features or implement missing logic

### Phase 3: Code Cleanup
1. Remove unused enum types
2. Remove unused includes from queries
3. Update frontend to remove references to removed fields
4. Clean up TypeScript interfaces

---

## J. Testing Checklist

After removing fields, test:

- [ ] Product creation/update
- [ ] Order creation
- [ ] Cart operations
- [ ] Admin order details page
- [ ] Admin product management
- [ ] Preorder functionality
- [ ] Review functionality
- [ ] User address management
- [ ] Category management
- [ ] Search functionality
- [ ] Product filtering

---

**End of Audit Report**

*This audit is based on static code analysis. Dynamic runtime behavior may reveal additional usage patterns. Always test thoroughly after schema changes.*
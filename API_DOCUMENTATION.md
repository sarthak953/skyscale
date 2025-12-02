# API Endpoints Documentation

This document summarizes all API endpoints available in the Skyscale ecommerce application.

All endpoints are part of the initial **v1** API (no explicit version segment in the URL). Authentication is handled via Clerk for protected routes, and session-based authentication for cart operations.

---

# Products Endpoints (`/api/products`)

## 1. Get All Products

- **Method**: `GET`
- **Path**: `/api/products`
- **Version**: v1 (unversioned path)
- **Description**: Fetch all published products with optional filtering by category, price range, scale, and filter types.
- **Auth**: Public (no authentication required)
- **Query Parameters**:
  - `categoryId` (optional): UUID or slug of category to filter by
  - `minPrice` (optional): Minimum price in cents (default: 0)
  - `maxPrice` (optional): Maximum price in cents (default: 999999)
  - `scale` (optional): Product scale to filter by
  - `filterTypes` (optional): Comma-separated list of filter types
- **Behavior**:
  - Only returns products with `status: 'published'` and `stock_quantity > 0`
  - Includes category and primary product image
  - Orders by creation date (newest first)
- **Success (200)**: Returns array of product objects with categories and product_images
- **Errors**:
  - 500: Server error

---

## 2. Get Product by Slug

- **Method**: `GET`
- **Path**: `/api/products/[slug]`
- **Version**: v1 (unversioned path)
- **Description**: Fetch a single product by its slug with full details including images, variants, and specifications.
- **Auth**: Public (no authentication required)
- **URL Params**:
  - `slug: string` – product slug identifier
- **Behavior**:
  - Only returns products with `status: 'published'`
  - Includes categories, product_images, product_variants, and product_specifications
- **Success (200)**: Returns complete product object with all relations
- **Errors**:
  - 404: Product not found
  - 500: Server error

---

## 3. Get Product by SKU

- **Method**: `GET`
- **Path**: `/api/products/image/[sku]`
- **Version**: v1 (unversioned path)
- **Description**: Fetch product details by SKU including images and specifications.
- **Auth**: Public (no authentication required)
- **URL Params**:
  - `sku: string` – product SKU identifier
- **Behavior**:
  - Returns selected product fields including images and specifications
  - Images ordered by sort_order
- **Success (200)**: Returns object with `product` field containing product data
- **Errors**:
  - 404: Product not found (returns `{ product: null }`)

---

# Admin Products Endpoints (`/api/admin/products`)

## 4. Get All Products (Admin)

- **Method**: `GET`
- **Path**: `/api/admin/products`
- **Version**: v1 (unversioned path)
- **Description**: Fetch all products for admin management, optionally filtered by category.
- **Auth**: Clerk session required (admin routes protected)
- **Query Parameters**:
  - `categoryId` (optional): UUID of category to filter by
- **Behavior**:
  - Returns all products regardless of status
  - Includes categories, product_images, product_specifications, and product_variants
- **Success (200)**: Returns array of complete product objects
- **Errors**:
  - 500: Server error

---

## 5. Create Product (Admin)

- **Method**: `POST`
- **Path**: `/api/admin/products`
- **Version**: v1 (unversioned path)
- **Description**: Create a new product with optional image and variants.
- **Auth**: Clerk session required (admin routes protected)
- **Request Body**:
  - `name: string` – required, product name
  - `imageUrl: string` (optional) – primary image URL
  - `variants: array` (optional) – array of variant objects with `name`, `price_adjustment`, `stock`
  - Other product fields: `short_description`, `full_description`, `category_id`, `scale`, `material`, `is_rc`, `is_preorder`, `stock_quantity`, `price_cents`, `weight_grams`, `is_featured`, `status`, `is_bestseller`, `filter_type`
- **Behavior**:
  - Generates slug from product name
  - Generates SKU as `SKU-{timestamp}`
  - Sets status to 'published' by default
  - Creates product image if imageUrl provided (with `product_id`, `image_url`, `is_primary`, `sort_order`)
  - Creates product variants if provided (with `product_id`, `variant_name`, `price_adjustment_cents`, `stock_quantity`, `sku_suffix`)
- **Success (201)**: Returns created product with all relations
- **Errors**:
  - 500: Server error

---

## 6. Update Product (Admin)

- **Method**: `PUT`
- **Path**: `/api/admin/products`
- **Version**: v1 (unversioned path)
- **Description**: Update an existing product's details.
- **Auth**: Clerk session required (admin routes protected)
- **Request Body**:
  - `id: string` – required, product ID
  - `imageUrl: string` (optional) – primary image URL (not processed in current implementation)
  - `variants: array` (optional) – array of variant objects (not processed in current implementation)
  - Other product fields as needed
- **Behavior**:
  - Updates product with provided data (excluding `imageUrl` and `variants`)
  - Updates `updated_at` timestamp automatically
  - Returns updated product with all relations
- **Success (200)**: Returns updated product object
- **Errors**:
  - 500: Server error

---

## 7. Delete Product (Admin)

- **Method**: `DELETE`
- **Path**: `/api/admin/products`
- **Version**: v1 (unversioned path)
- **Description**: Delete a product and handle related data cleanup.
- **Auth**: Clerk session required (admin routes protected)
- **Query Parameters**:
  - `id: string` – required, product ID to delete
- **Behavior**:
  - Uses transaction to safely delete product
  - Sets cart_items and order_items product_id to null (preserves order history)
  - Deletes the product record (cascades to product_images, product_specifications, product_variants)
- **Success (200)**: Returns `{ message: 'Product deleted successfully' }`
- **Errors**:
  - 400: Product ID required
  - 500: Server error

---

# Cart Endpoints (`/api/cart`)

## 8. Get Cart

- **Method**: `GET`
- **Path**: `/api/cart`
- **Version**: v1 (unversioned path)
- **Description**: Fetch current user's cart items with product details.
- **Auth**: Session-based (uses cart_session_id cookie)
- **Behavior**:
  - Retrieves or creates session ID from cookie
  - Returns cart items with product details and primary images
  - Calculates total price
  - Returns empty array if no cart exists
- **Success (200)**: Returns `{ items: array, total: number }`
- **Errors**:
  - 500: Server error

---

## 9. Add Item to Cart

- **Method**: `POST`
- **Path**: `/api/cart`
- **Version**: v1 (unversioned path)
- **Description**: Add a product (with optional variant) to the cart.
- **Auth**: Session-based (uses cart_session_id cookie)
- **Request Body**:
  - `productId: string` – required, product ID
  - `variantId: string` (optional) – product variant ID
  - `qty: number` – required, quantity to add
- **Behavior**:
  - Validates product exists and checks stock availability
  - Calculates price (base price + variant adjustment if applicable)
  - Creates cart if doesn't exist
  - Updates quantity if item already in cart, otherwise creates new cart item
  - Sets cart_session_id cookie (30 days expiry)
- **Success (200)**: Returns `{ success: true }`
- **Errors**:
  - 400: Insufficient stock (returns available quantity)
  - 404: Product not found
  - 500: Server error

---

## 10. Remove Item from Cart

- **Method**: `DELETE`
- **Path**: `/api/cart`
- **Version**: v1 (unversioned path)
- **Description**: Remove a specific item from the cart.
- **Auth**: Session-based (uses cart_session_id cookie)
- **Query Parameters**:
  - `itemId: string` – required, cart item ID to remove
- **Behavior**:
  - Deletes the cart item by ID
- **Success (200)**: Returns `{ success: true }`
- **Errors**:
  - 400: Item ID required
  - 500: Server error

---

# Orders Endpoints (`/api/orders`)

## 11. Get User Orders

- **Method**: `GET`
- **Path**: `/api/orders`
- **Version**: v1 (unversioned path)
- **Description**: Fetch all orders for the authenticated user, optionally filtered by status.
- **Auth**: Clerk session required
- **Query Parameters**:
  - `status` (optional): Filter by tracking status (e.g., 'OrderConfirmed', 'Shipped')
- **Behavior**:
  - Returns orders for authenticated user only
  - Includes order_items and order_tracking
  - Orders by placed_at (newest first)
  - Filters by latest tracking status if status parameter provided
- **Success (200)**: Returns array of order objects
- **Errors**:
  - 401: Unauthorized
  - 500: Server error

---

## 12. Get Order by ID

- **Method**: `GET`
- **Path**: `/api/orders/[id]`
- **Version**: v1 (unversioned path)
- **Description**: Fetch a single order by ID for the authenticated user.
- **Auth**: Clerk session required
- **URL Params**:
  - `id: string` – order ID
- **Behavior**:
  - Returns order only if it belongs to authenticated user
  - Includes order_items and order_tracking (ordered by tracked_at ascending)
- **Success (200)**: Returns complete order object
- **Errors**:
  - 401: Unauthorized
  - 404: Order not found
  - 500: Server error

---

## 13. Cancel Order

- **Method**: `POST`
- **Path**: `/api/orders/[id]/cancel`
- **Version**: v1 (unversioned path)
- **Description**: Cancel an order if it hasn't been shipped or delivered.
- **Auth**: Clerk session required
- **URL Params**:
  - `id: string` – order ID
- **Behavior**:
  - Validates order exists
  - Prevents cancellation if status is 'shipped' or 'delivered'
  - Updates order status to 'cancelled'
- **Success (200)**: Returns `{ message: 'Order cancelled successfully' }`
- **Errors**:
  - 400: Cannot cancel shipped/delivered order
  - 404: Order not found
  - 500: Server error

---

## 14. Update Order Tracking Status

- **Method**: `PATCH`
- **Path**: `/api/orders/[id]/updateStatus`
- **Version**: v1 (unversioned path)
- **Description**: Add a new tracking status entry for an order.
- **Auth**: Clerk session required
- **URL Params**:
  - `id: string` – order ID
- **Request Body**:
  - `tracking_status: string` – required, one of: 'OrderConfirmed', 'DesignInProgress', 'InReview', 'DesignApproved', 'InProduction', 'QualityCheck', 'Packaging', 'Shipped', 'Delivered', 'Completed'
- **Behavior**:
  - Creates new order_tracking entry with provided status
  - Sets tracked_at to current timestamp
- **Success (200)**: Returns `{ success: true }`
- **Errors**:
  - 500: Server error

---

# Admin Orders Endpoints (`/api/admin/orders`)

## 15. Get All Orders (Admin)

- **Method**: `GET`
- **Path**: `/api/admin/orders`
- **Version**: v1 (unversioned path)
- **Description**: Fetch all orders in the system for admin management.
- **Auth**: Clerk session required (admin routes protected)
- **Behavior**:
  - Returns all orders regardless of user
  - Includes order_items (with products and variants), order_tracking, users, and coupons
  - Orders by placed_at (newest first)
- **Success (200)**: Returns array of complete order objects
- **Errors**:
  - 500: Server error

---

## 16. Get Order by ID (Admin)

- **Method**: `GET`
- **Path**: `/api/admin/orders/[id]`
- **Version**: v1 (unversioned path)
- **Description**: Fetch a single order by ID with full details for admin.
- **Auth**: Clerk session required (admin routes protected)
- **URL Params**:
  - `id: string` – order ID
- **Behavior**:
  - Returns order with complete details
  - Includes order_items (with products and variants), order_tracking, users, and coupons
- **Success (200)**: Returns complete order object
- **Errors**:
  - 404: Order not found
  - 500: Server error

---

# Checkout Endpoints (`/api/checkout`)

## 17. Create Order

- **Method**: `POST`
- **Path**: `/api/checkout/create-order`
- **Version**: v1 (unversioned path)
- **Description**: Create an order from the current cart and process checkout.
- **Auth**: Session-based (uses cart_session_id cookie), optional Clerk authentication
- **Request Body**:
  - `address: object` – required, shipping address with fields: `name`, `email`, `phone`, `street_line1`, `street_line2`, `city`, `state`, `pincode`, `country`, `saveAddress` (boolean)
  - `paymentMethod: string` – required, one of: 'card', 'paypal', 'bank_transfer', 'cod'
- **Behavior**:
  - Validates cart exists and is not empty
  - Calculates subtotal, tax (18% GST), shipping (₹5), and total
  - Generates order number as `ORD-{timestamp}`
  - Creates or retrieves user via Clerk
  - Saves address if user authenticated and saveAddress is true
  - Creates order and order_items
  - Decreases product stock quantities
  - Clears cart items after order creation
- **Success (200)**: Returns `{ orderId: string, orderNumber: string, order: object }`
- **Errors**:
  - 400: No cart session found or cart is empty
  - 500: Server error

---

# Categories Endpoints (`/api/categories`)

## 18. Get All Categories

- **Method**: `GET`
- **Path**: `/api/categories`
- **Version**: v1 (unversioned path)
- **Description**: Fetch all active categories.
- **Auth**: Public (no authentication required)
- **Behavior**:
  - Returns only categories with `is_active: true`
  - Orders by sort_order (ascending)
- **Success (200)**: Returns array of category objects
- **Errors**:
  - 500: Server error

---

## 19. Get Category Filters

- **Method**: `GET`
- **Path**: `/api/categories/[id]/filters`
- **Version**: v1 (unversioned path)
- **Description**: Get unique filter types for products in a specific category.
- **Auth**: Public (no authentication required)
- **URL Params**:
  - `id: string` – category ID
- **Behavior**:
  - Returns distinct filter_type values for published products in the category
  - Filters out null values
- **Success (200)**: Returns array of unique filter type strings
- **Errors**:
  - 500: Server error

---

# Admin Categories Endpoints (`/api/admin/categories`)

## 20. Get All Categories (Admin)

- **Method**: `GET`
- **Path**: `/api/admin/categories`
- **Version**: v1 (unversioned path)
- **Description**: Fetch all categories with product counts for admin management.
- **Auth**: Clerk session required (admin routes protected)
- **Behavior**:
  - Returns all categories regardless of active status
  - Includes product count via `_count`
  - Orders by sort_order (ascending)
- **Success (200)**: Returns array of category objects with product counts
- **Errors**:
  - 500: Server error

---

## 21. Create Category (Admin)

- **Method**: `POST`
- **Path**: `/api/admin/categories`
- **Version**: v1 (unversioned path)
- **Description**: Create a new category.
- **Auth**: Clerk session required (admin routes protected)
- **Request Body**:
  - `name: string` – required, category name
  - `slug: string` – required, unique category slug
  - `description: string` (optional)
  - `image_url: string` (optional)
  - Other category fields as needed
- **Behavior**:
  - Sets `is_active: true` and `sort_order: 0` by default
  - Creates category record
- **Success (201)**: Returns created category object
- **Errors**:
  - 500: Server error

---

## 22. Delete Category (Admin)

- **Method**: `DELETE`
- **Path**: `/api/admin/categories`
- **Version**: v1 (unversioned path)
- **Description**: Delete a category.
- **Auth**: Clerk session required (admin routes protected)
- **Query Parameters**:
  - `id: string` – required, category ID to delete
- **Behavior**:
  - Deletes category by ID
- **Success (200)**: Returns `{ success: true }`
- **Errors**:
  - 400: Category ID required
  - 500: Server error

---

# Reviews Endpoints (`/api/reviews`)

## 23. Get Product Reviews

- **Method**: `GET`
- **Path**: `/api/reviews`
- **Version**: v1 (unversioned path)
- **Description**: Fetch all reviews for a specific product.
- **Auth**: Public (no authentication required)
- **Query Parameters**:
  - `productId: string` – required, product ID
- **Behavior**:
  - Returns reviews with user first_name and last_name
  - Orders by created_at (newest first)
- **Success (200)**: Returns array of review objects with user info
- **Errors**:
  - 400: Product ID required
  - 500: Server error

---

## 24. Create Review

- **Method**: `POST`
- **Path**: `/api/reviews`
- **Version**: v1 (unversioned path)
- **Description**: Create a new product review and update product rating.
- **Auth**: Clerk session required
- **Request Body**:
  - `productId: string` – required, product ID
  - `rating: number` – required, rating value
  - `title: string` (optional) – review title
  - `comment: string` (optional) – review comment
- **Behavior**:
  - Checks if user has purchased the product (delivered orders)
  - Sets `is_verified_purchase` based on purchase history
  - Creates review record
  - Recalculates product average rating and review count
  - Updates product rating_avg and review_count
- **Success (201)**: Returns created review object
- **Errors**:
  - 401: User not authenticated
  - 500: Server error

---

# Preorder Endpoints (`/api/preorder`)

## 25. Create Preorder Enquiry

- **Method**: `POST`
- **Path**: `/api/preorder`
- **Version**: v1 (unversioned path)
- **Description**: Submit a preorder enquiry with optional file attachments.
- **Auth**: Optional Clerk authentication (guest submissions allowed)
- **Request Body**:
  - `name: string` – required, customer name
  - `email: string` – required, customer email
  - `phone: string` – required, customer phone
  - `quantity: number` – required, must be > 0
  - `scale: string` (optional) – product scale
  - `description: string` – required, enquiry description
  - `files: array` (optional) – array of file objects with `url`, `name`, `type`, `size`
- **Behavior**:
  - Validates all required fields
  - Creates or retrieves user if authenticated via Clerk
  - Creates preorder_enquiries record with status 'new'
  - Creates preorder_files records if files provided
- **Success (200)**: Returns `{ message: string, preorderId: string }`
- **Errors**:
  - 400: Missing required fields or invalid quantity
  - 500: Server error

---

## 26. Get Preorder by ID

- **Method**: `GET`
- **Path**: `/api/preorder/[id]`
- **Version**: v1 (unversioned path)
- **Description**: Fetch a single preorder enquiry by ID (user's own preorders only).
- **Auth**: Clerk session required
- **URL Params**:
  - `id: string` – preorder ID
- **Behavior**:
  - Returns preorder only if it belongs to authenticated user
  - Includes preorder_files
- **Success (200)**: Returns complete preorder object
- **Errors**:
  - 403: Unauthorized (preorder belongs to different user)
  - 404: Preorder not found
  - 500: Server error

---

## 27. Get User Preorders

- **Method**: `GET`
- **Path**: `/api/preorder/my-preorders`
- **Version**: v1 (unversioned path)
- **Description**: Fetch all preorder enquiries for the authenticated user, optionally filtered by status.
- **Auth**: Clerk session required
- **Query Parameters**:
  - `status` (optional): Filter by status (e.g., 'new', 'reviewed', 'quoted', 'converted', 'closed')
- **Behavior**:
  - Returns preorders for authenticated user only
  - Includes preorder_files
  - Orders by created_at (newest first)
  - Filters by status if provided
- **Success (200)**: Returns array of preorder objects
- **Errors**:
  - 401: Unauthorized
  - 500: Server error

---

# Admin Preorders Endpoints (`/api/admin/preorders`)

## 28. Get All Preorders (Admin)

- **Method**: `GET`
- **Path**: `/api/admin/preorders`
- **Version**: v1 (unversioned path)
- **Description**: Fetch all preorder enquiries for admin management.
- **Auth**: Clerk session required (admin routes protected)
- **Behavior**:
  - Returns all preorders regardless of user
  - Includes users and preorder_files
  - Orders by created_at (newest first)
- **Success (200)**: Returns array of complete preorder objects
- **Errors**:
  - 500: Server error

---

## 29. Get Preorder by ID (Admin)

- **Method**: `GET`
- **Path**: `/api/admin/preorders/[id]`
- **Version**: v1 (unversioned path)
- **Description**: Fetch a single preorder enquiry by ID for admin.
- **Auth**: Clerk session required (admin routes protected)
- **URL Params**:
  - `id: string` – preorder ID
- **Behavior**:
  - Returns preorder with complete details
  - Includes users and preorder_files
- **Success (200)**: Returns complete preorder object
- **Errors**:
  - 404: Preorder not found
  - 500: Server error

---

## 30. Update Preorder Status (Admin)

- **Method**: `PATCH`
- **Path**: `/api/admin/preorders/[id]`
- **Version**: v1 (unversioned path)
- **Description**: Update the status of a preorder enquiry.
- **Auth**: Clerk session required (admin routes protected)
- **URL Params**:
  - `id: string` – preorder ID
- **Request Body**:
  - `status: string` – required, one of: 'new', 'reviewed', 'quoted', 'converted', 'closed'
- **Behavior**:
  - Updates preorder status
  - Updates updated_at timestamp
  - Returns updated preorder with relations
- **Success (200)**: Returns updated preorder object
- **Errors**:
  - 500: Server error

---

# User Addresses Endpoints (`/api/user-addresses`)

## 31. Get User Addresses

- **Method**: `GET`
- **Path**: `/api/user-addresses`
- **Version**: v1 (unversioned path)
- **Description**: Fetch all saved addresses for the authenticated user.
- **Auth**: Clerk session required
- **Behavior**:
  - Returns empty array if user not authenticated
  - Returns addresses ordered by created_at (newest first)
- **Success (200)**: Returns `{ addresses: array }`
- **Errors**:
  - 500: Server error

---

## 32. Create User Address

- **Method**: `POST`
- **Path**: `/api/user-addresses`
- **Version**: v1 (unversioned path)
- **Description**: Save a new address for the authenticated user.
- **Auth**: Clerk session required
- **Request Body**:
  - `email: string` (optional)
  - `address: object` – required, address object with fields: `name`, `street_line1`, `street_line2`, `city`, `state`, `pincode`, `country`
  - `isDefault: boolean` (optional) – set as default address
- **Behavior**:
  - Sets all other addresses to non-default if isDefault is true
  - Creates new address record
- **Success (200)**: Returns `{ address: object }`
- **Errors**:
  - 401: User not authenticated
  - 500: Server error

---

## 33. Update User Address

- **Method**: `PUT`
- **Path**: `/api/user-addresses`
- **Version**: v1 (unversioned path)
- **Description**: Update an existing address for the authenticated user.
- **Auth**: Clerk session required
- **Request Body**:
  - `id: string` – required, address ID
  - `address: object` – required, address object with fields: `name`, `street_line1`, `street_line2`, `city`, `state`, `pincode`, `country`
  - `isDefault: boolean` (optional) – set as default address
- **Behavior**:
  - Sets all other addresses to non-default if isDefault is true
  - Updates address record (only user's own addresses)
- **Success (200)**: Returns `{ address: object }`
- **Errors**:
  - 401: User not authenticated
  - 500: Server error

---

## 34. Delete User Address

- **Method**: `DELETE`
- **Path**: `/api/user-addresses`
- **Version**: v1 (unversioned path)
- **Description**: Delete a saved address for the authenticated user.
- **Auth**: Clerk session required
- **Query Parameters**:
  - `id: string` – required, address ID to delete
- **Behavior**:
  - Deletes address (only user's own addresses)
- **Success (200)**: Returns `{ success: true }`
- **Errors**:
  - 400: Address ID required
  - 401: User not authenticated
  - 500: Server error

---

# Utility Endpoints

## 35. Search Products

- **Method**: `GET`
- **Path**: `/api/search`
- **Version**: v1 (unversioned path)
- **Description**: Search for products by name, description, or SKU.
- **Auth**: Public (no authentication required)
- **Query Parameters**:
  - `q: string` – required, search query (minimum 2 characters)
- **Behavior**:
  - Searches in product name, short_description, and SKU (case-insensitive)
  - Only returns published products
  - Includes primary product image
  - Limits results to 5 products
- **Success (200)**: Returns array of matching product objects
- **Errors**:
  - 500: Server error

---

## 36. Get Best Sellers

- **Method**: `GET`
- **Path**: `/api/best-sellers`
- **Version**: v1 (unversioned path)
- **Description**: Fetch all bestseller products with formatted data.
- **Auth**: Public (no authentication required)
- **Behavior**:
  - Returns products with `is_bestseller: true` and `status: 'published'`
  - Includes primary product image
  - Formats price from cents to currency units
  - Formats image URLs
- **Success (200)**: Returns array of formatted product objects with `id`, `name`, `slug`, `price`, `image`
- **Errors**: None (returns empty array if no bestsellers)

---

## 37. Get Available Scales

- **Method**: `GET`
- **Path**: `/api/scales`
- **Version**: v1 (unversioned path)
- **Description**: Get list of available product scales.
- **Auth**: Public (no authentication required)
- **Behavior**:
  - Returns hardcoded list of scales: ['1:18', '1:24', '1:48', '1:72', '1:100', '1:200', '1:700']
- **Success (200)**: Returns array of scale strings
- **Errors**: None

---

## 38. Upload Image

- **Method**: `POST`
- **Path**: `/api/upload`
- **Version**: v1 (unversioned path)
- **Description**: Upload an image file to the server.
- **Auth**: Public (no authentication required)
- **Request Body**: FormData with field `image` containing the file
- **Behavior**:
  - Validates file exists
  - Generates unique filename with timestamp
  - Saves file to `public/uploads/` directory
  - Sanitizes filename
- **Success (200)**: Returns `{ url: string, message: string }`
- **Errors**:
  - 400: No file uploaded
  - 500: Server error

---

## 39. Contact Form Submission

- **Method**: `POST`
- **Path**: `/api/contact`
- **Version**: v1 (unversioned path)
- **Description**: Submit a contact form message.
- **Auth**: Public (no authentication required)
- **Request Body**:
  - `name: string` – required
  - `email: string` – required
  - `subject: string` – required
  - `message: string` – required
- **Behavior**:
  - Currently just returns success (email sending not implemented)
  - Placeholder for future email integration
- **Success (200)**: Returns `{ success: true }`
- **Errors**:
  - 400: Invalid request

---

## 40. Seed Categories

- **Method**: `POST`
- **Path**: `/api/seed-categories`
- **Version**: v1 (unversioned path)
- **Description**: Seed initial categories into the database (one-time operation).
- **Auth**: Public (no authentication required)
- **Behavior**:
  - Checks if categories already exist
  - Creates 12 default categories if none exist
  - Sets sort_order based on array index
  - Sets is_active to true
- **Success (200)**: Returns `{ message: string, count: number }`
- **Errors**:
  - 500: Server error

---

# Admin Analytics Endpoints (`/api/admin/analytics`)

## 41. Get Analytics Data

- **Method**: `GET`
- **Path**: `/api/admin/analytics`
- **Version**: v1 (unversioned path)
- **Description**: Fetch comprehensive analytics data for admin dashboard.
- **Auth**: Clerk session required (admin routes protected)
- **Behavior**:
  - Calculates total products, orders, and users
  - Calculates total revenue from all orders
  - Groups orders by status with counts
  - Gets top 5 selling products by quantity
  - Gets 5 most recent orders
  - Calculates monthly revenue for last 6 months
  - Calculates average order value
- **Success (200)**: Returns object with:
  - `totalProducts: number`
  - `totalOrders: number`
  - `totalUsers: number`
  - `totalRevenue: number`
  - `ordersByStatus: array`
  - `topProducts: array`
  - `recentOrders: array`
  - `revenueByMonth: object`
  - `avgOrderValue: number`
- **Errors**:
  - 500: Server error

---

# Authentication & Authorization

## Authentication Methods

1. **Clerk Authentication**: Used for protected routes (admin, user orders, reviews, addresses)
   - Routes protected by middleware checking Clerk session
   - Admin routes require authentication via `clerkMiddleware`

2. **Session-Based Authentication**: Used for cart operations
   - Uses `cart_session_id` cookie
   - Cookie expires in 30 days
   - Works for both authenticated and guest users

3. **Public Access**: No authentication required
   - Product listings
   - Product details
   - Categories
   - Search
   - Best sellers

## Authorization Levels

- **Public**: No authentication required
- **User**: Clerk authentication required (user's own data only)
- **Admin**: Clerk authentication required (access to all data)

---

# Error Responses

All endpoints follow consistent error response format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors, missing required fields)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

---

# Notes

- All endpoints are part of **v1** API (no version prefix in URLs)
- All prices are stored and returned in **cents** (divide by 100 for currency display)
- All timestamps are in ISO 8601 format with timezone
- Product slugs are auto-generated from product names
- Order numbers are generated as `ORD-{timestamp}`
- SKUs are auto-generated as `SKU-{timestamp}`
- Tax calculation: 18% GST on subtotal
- Shipping cost: ₹5 (500 cents) fixed
- Stock quantities are automatically decremented on order creation
- Cart is automatically cleared after successful order creation


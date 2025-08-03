# 🏠 HOME HAVEN SYSTEM TESTING GUIDE
## Complete System Testing Flow

---

## 📋 **PRE-TESTING SETUP**

### **1. Database Preparation**
- [ ] Run the improved SQL script: `our/populate_database_improved.sql`
- [ ] Verify database has test data (14 users, 44 products, 19 orders)
- [ ] Start Node.js server: `cd our/nodejs && npm start`
- [ ] Ensure XAMPP is running (Apache + MySQL)

### **2. Test Environment**
- [ ] Clear browser cache and cookies
- [ ] Open browser in incognito/private mode
- [ ] Have multiple browser tabs ready for different user roles

---

## 🔐 **AUTHENTICATION & USER MANAGEMENT TESTING**

### **1. User Registration**
**Test File:** `our/jquery/signup.html`

**Test Cases:**
- [ ] **Valid Registration**
  - Fill all required fields
  - Use valid email format
  - Strong password (8+ chars, special chars)
  - Verify success message and redirect

- [ ] **Invalid Registration**
  - Empty required fields
  - Invalid email format
  - Weak password
  - Duplicate email
  - Verify error messages

- [ ] **Form Validation**
  - Real-time validation feedback
  - Password strength indicator
  - Email format validation

### **2. User Login**
**Test File:** `our/jquery/login.html`

**Test Cases:**
- [ ] **Valid Login (All User Types)**
  - Admin: `admin@homehaven.com` / `password`
  - Customer: `johnbagon4@gmail.com` / `passwOrd&123`
  - Seller: `seller1@homehaven.com` / `password123!`
  - New Customer: `carlosmendoza@gmail.com` / `password123!`
  - New Seller: `mariasantos@homehaven.com` / `password123!`

- [ ] **Invalid Login**
  - Wrong email/password
  - Empty fields
  - Inactive account
  - Verify error messages

- [ ] **Session Management**
  - Check localStorage data storage
  - Verify session persistence
  - Test logout functionality

### **3. Password Reset**
- [ ] Request password reset
- [ ] Check email notification
- [ ] Reset password with token
- [ ] Login with new password

---

## 👤 **USER ROLE TESTING**

### **1. ADMIN ROLE TESTING**
**Test Files:** `our/jquery/admin/*.html`

#### **Dashboard (`index.html`)**
- [ ] **Login as Admin**
  - Verify admin dashboard loads
  - Check statistics display
  - Verify navigation menu
  - Test footer with admin info

- [ ] **Quick Stats**
  - Total users count
  - Total products count
  - Total orders count
  - Revenue statistics

#### **User Management (`users.html`)**
- [ ] **View Users List**
  - Display all users in datatable
  - Check Status vs State columns
  - Verify Status column is read-only (grayed out)
  - Verify State column is interactive

- [ ] **User State Management**
  - Click "Deactivate" on active user
  - Enter reason in modal
  - Confirm deactivation
  - Check email notification sent
  - Verify user state changed to "inactive"
  - Test activation process

- [ ] **User Details Modal**
  - Click on user row
  - Verify modal displays user info
  - Check both Status and State displayed

#### **Product Management (`items.html`)**
- [ ] **View All Products**
  - Display products in datatable
  - Check product details
  - Verify seller information
  - Test search and filter

#### **Order Management (`orders.html`)**
- [ ] **View All Orders**
  - Display orders in datatable
  - Check order status
  - Verify customer information
  - Test order details modal

#### **Customer Management (`customers.html`)**
- [ ] **View Customer List**
  - Display customers in datatable
  - Check customer profiles
  - Verify contact information

#### **Seller Management (`sellers.html`)**
- [ ] **View Seller List**
  - Display sellers in datatable
  - Check business information
  - Verify verification status

### **2. SELLER ROLE TESTING**
**Test Files:** `our/jquery/sellers/*.html`

#### **Seller Dashboard (`index-sellers.html`)**
- [ ] **Login as Seller**
  - Verify seller dashboard loads
  - Check seller-specific stats
  - Test navigation menu

#### **Product Management (`products.html`)**
- [ ] **View Own Products**
  - Display seller's products only
  - Check product status (active/inactive)
  - Verify product details

- [ ] **Add New Product**
  - Fill product form
  - Upload multiple images
  - Set category and price
  - Verify product created
  - Check stock quantity

- [ ] **Edit Product**
  - Modify product details
  - Update images
  - Change status
  - Verify changes saved

- [ ] **Delete Product**
  - Delete product
  - Verify confirmation
  - Check product removed

#### **Order Management (`orders.html`)**
- [ ] **View Seller Orders**
  - Display orders for seller's products
  - Check order status
  - Update order status
  - Verify email notification sent

#### **Categories Management (`categories.html`)**
- [ ] **View Categories**
  - Display available categories
  - Check category details

### **3. CUSTOMER ROLE TESTING**
**Test Files:** `our/jquery/customer/*.html`

#### **Product Catalog (`product_catalog.html`)**
- [ ] **Browse Products**
  - View all products
  - Filter by category
  - Search products
  - Sort by price/name
  - Check pagination

- [ ] **Product Details (`product-details_catalog.html`)**
  - View product images
  - Read product description
  - Check price and availability
  - Read customer reviews
  - Add to cart/wishlist

#### **Shopping Cart (`cart.html`)**
- [ ] **Add to Cart**
  - Add products to cart
  - Update quantities
  - Remove items
  - Check total calculation

- [ ] **Cart Management**
  - View cart contents
  - Update quantities
  - Remove items
  - Clear cart

#### **Checkout Process (`checkout.html`)**
- [ ] **Order Placement**
  - Fill shipping details
  - Choose payment method
  - Upload payment proof (GCash)
  - Place order
  - Verify order confirmation
  - Check email notification

#### **Order History (`orders.html`)**
- [ ] **View Orders**
  - Display customer's orders
  - Check order status
  - View order details
  - Track order progress

#### **Profile Management (`profile.html`)**
- [ ] **View Profile**
  - Display user information
  - Check profile picture
  - Verify contact details

- [ ] **Update Profile**
  - Change profile picture
  - Update personal information
  - Change password
  - Verify email field is read-only
  - Check form validation

#### **Wishlist (`wishlist.html`)**
- [ ] **Wishlist Management**
  - Add products to wishlist
  - Remove from wishlist
  - Move to cart
  - View wishlist items

### **4. REGULAR USER ROLE TESTING**
- [ ] **Limited Access**
  - Verify limited functionality
  - Check upgrade prompts
  - Test registration completion

---

## 🛒 **E-COMMERCE FUNCTIONALITY TESTING**

### **1. Product Management**
- [ ] **Product Listing**
  - Display all products
  - Category filtering
  - Search functionality
  - Price range filtering
  - Sort options

- [ ] **Product Details**
  - Image gallery
  - Product description
  - Price and availability
  - Seller information
  - Customer reviews

### **2. Shopping Cart**
- [ ] **Cart Operations**
  - Add to cart
  - Update quantities
  - Remove items
  - Calculate totals
  - Cart persistence

### **3. Checkout Process**
- [ ] **Order Flow**
  - Shipping information
  - Payment method selection
  - Order confirmation
  - Email notifications
  - PDF receipt generation

### **4. Order Management**
- [ ] **Order Status**
  - Pending
  - Processing
  - Shipped
  - Delivered
  - Cancelled

### **5. Review System**
- [ ] **Product Reviews**
  - Submit review
  - Rating system
  - Review display
  - Review moderation

---

## 📧 **EMAIL NOTIFICATION TESTING**

### **1. Order Notifications**
- [ ] **Order Confirmation**
  - Customer receives confirmation
  - PDF receipt attached
  - Order details included

- [ ] **Status Updates**
  - Order status changes
  - Seller notifications
  - Customer notifications

### **2. Account Notifications**
- [ ] **Registration**
  - Welcome email
  - Account verification

- [ ] **Password Reset**
  - Reset link email
  - Token validation

- [ ] **Account Status**
  - Activation/deactivation emails
  - Reason included in email

---

## 🔒 **SECURITY TESTING**

### **1. Authentication**
- [ ] **Route Protection**
  - Admin-only routes
  - Seller-only routes
  - Customer-only routes
  - Unauthorized access prevention

### **2. Input Validation**
- [ ] **Form Validation**
  - SQL injection prevention
  - XSS prevention
  - File upload security
  - Input sanitization

### **3. Session Management**
- [ ] **Session Security**
  - JWT token validation
  - Session timeout
  - Secure logout
  - Token refresh

---

## 📱 **RESPONSIVE DESIGN TESTING**

### **1. Device Compatibility**
- [ ] **Desktop (1920x1080)**
  - Full functionality
  - Navigation menu
  - Data tables

- [ ] **Tablet (768x1024)**
  - Responsive layout
  - Touch interactions
  - Menu adaptation

- [ ] **Mobile (375x667)**
  - Mobile navigation
  - Touch-friendly buttons
  - Readable text

### **2. Browser Compatibility**
- [ ] **Chrome**
- [ ] **Firefox**
- [ ] **Safari**
- [ ] **Edge**

---

## 🧪 **EDGE CASE TESTING**

### **1. Error Handling**
- [ ] **Network Errors**
  - Server offline
  - Slow connection
  - Timeout handling

- [ ] **Data Errors**
  - Invalid data
  - Missing data
  - Corrupted data

### **2. Performance Testing**
- [ ] **Load Testing**
  - Multiple users
  - Large datasets
  - Concurrent operations

- [ ] **Memory Usage**
  - Image uploads
  - Data processing
  - Cache management

---

## 📊 **DATA INTEGRITY TESTING**

### **1. Database Operations**
- [ ] **CRUD Operations**
  - Create operations
  - Read operations
  - Update operations
  - Delete operations

### **2. Foreign Key Constraints**
- [ ] **Data Relationships**
  - User-seller relationships
  - Product-category relationships
  - Order-customer relationships

### **3. Data Consistency**
- [ ] **Stock Management**
  - Stock updates on orders
  - Stock validation
  - Out-of-stock handling

---

## 🎯 **TESTING CHECKLIST**

### **Pre-Testing**
- [ ] Database populated with test data
- [ ] Server running
- [ ] Browser cache cleared
- [ ] Test accounts ready

### **Core Functionality**
- [ ] User registration and login
- [ ] Role-based access control
- [ ] Product browsing and search
- [ ] Shopping cart operations
- [ ] Checkout process
- [ ] Order management
- [ ] Email notifications

### **Admin Functions**
- [ ] User management
- [ ] Product oversight
- [ ] Order monitoring
- [ ] System statistics

### **Seller Functions**
- [ ] Product management
- [ ] Order processing
- [ ] Inventory control

### **Customer Functions**
- [ ] Product browsing
- [ ] Shopping cart
- [ ] Order placement
- [ ] Profile management

### **Post-Testing**
- [ ] All test data verified
- [ ] No broken functionality
- [ ] Performance acceptable
- [ ] Security measures working

---

## 🚨 **COMMON ISSUES TO WATCH FOR**

### **1. Authentication Issues**
- JWT token expiration
- Session persistence
- Role-based access

### **2. Data Issues**
- Foreign key constraints
- Auto-increment conflicts
- Data synchronization

### **3. UI/UX Issues**
- Responsive design
- Form validation
- Error messages

### **4. Performance Issues**
- Slow loading times
- Memory leaks
- Database queries

---

## 📝 **TESTING LOG TEMPLATE**

```
Date: _______________
Tester: _______________
Environment: _______________

### Test Results:
- [ ] Authentication: PASS/FAIL
- [ ] User Management: PASS/FAIL
- [ ] Product Management: PASS/FAIL
- [ ] Order Processing: PASS/FAIL
- [ ] Email Notifications: PASS/FAIL
- [ ] Security: PASS/FAIL
- [ ] Responsive Design: PASS/FAIL

### Issues Found:
1. ________________
2. ________________
3. ________________

### Recommendations:
1. ________________
2. ________________
3. ________________
```

---

## 🎉 **SUCCESS CRITERIA**

### **System is ready when:**
- [ ] All user roles work correctly
- [ ] E-commerce flow is complete
- [ ] Email notifications are working
- [ ] Security measures are in place
- [ ] UI is responsive and user-friendly
- [ ] No critical bugs remain
- [ ] Performance is acceptable

---

**Happy Testing! 🚀** 
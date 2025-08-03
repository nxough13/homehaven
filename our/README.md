# 🏠 Home Haven - E-commerce Platform

A comprehensive e-commerce platform built with Node.js, jQuery, and MySQL for the ITCP (Introduction to Computer Programming) course requirements.

## 📋 Project Overview

Home Haven is a full-stack e-commerce application that allows customers to browse and purchase home furnishing products, sellers to manage their product catalogs, and admins to oversee the entire platform.

## 🏗️ Project Structure

```
our/
├── nodejs/                 # Backend API (Node.js + Express)
│   ├── routes/            # API endpoints
│   │   ├── auth.js        # Authentication & user management
│   │   ├── admin.js       # Admin-specific operations
│   │   ├── seller.js      # Seller product management
│   │   └── item.js        # Product & order operations
│   ├── config/            # Database configuration
│   ├── uploads/           # File uploads (images, receipts)
│   └── package.json       # Dependencies
├── jquery/                # Frontend (jQuery + HTML/CSS)
│   ├── admin/             # Admin dashboard pages
│   ├── customer/          # Customer pages
│   ├── sellers/           # Seller dashboard pages
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── img/               # Product images
└── homehaven_dbase(final3).sql  # Database schema
```

## 🎯 ITCP Requirements Mapping

### **Machine Problems (MP)**

#### **MP1: NodeJS CRUD API (20pts)**
- **Frontend**: `jquery/product_catalog.html` - Product listing and management
- **Backend**: `nodejs/routes/item.js` - Product CRUD operations (GET, POST, PUT, DELETE)
- **Features**: Complete product management with stock tracking

#### **MP2: NodeJS CRUD API (20pts)**
- **Frontend**: `jquery/sellers/index-sellers.html` - Seller product dashboard
- **Backend**: `nodejs/routes/seller.js` - Seller product CRUD operations
- **Features**: Seller-specific product management with multiple image uploads

#### **MP4: jQuery/datatables with multiple file uploads (20pts)**
- **Frontend**: `jquery/sellers/categories.html` - Product management with datatables
- **Backend**: `nodejs/routes/seller.js` - Multiple image upload functionality
- **Features**: Advanced product management with image galleries

#### **MP5: jQuery/datatables frontend for MP2 (20pts)**
- **Frontend**: `jquery/admin/items.html` - Admin product management with datatables
- **Backend**: `nodejs/routes/item.js` - Product API endpoints
- **Features**: Admin product oversight with advanced filtering

#### **MP6: JWT Authentication Tokens (15pts)**
- **Frontend**: `jquery/login.html` - Login interface
- **Backend**: `nodejs/routes/auth.js` - JWT middleware and authentication
- **Features**: Secure user authentication with token-based sessions

#### **MP7: User Registration, Login API via jQuery AJAX (20pts)**
- **Frontend**: 
  - `jquery/login.html` - Login form
  - `jquery/signup.html` - Registration form
- **Backend**: `nodejs/routes/auth.js` - Login and registration endpoints
- **Features**: Complete user authentication system

#### **MP7: Admin can update role of user, deactivate users, List users on datatable (20pts)**
- **Frontend**: `jquery/admin/users.html` - User management dashboard
- **Backend**: `nodejs/routes/admin.js` - User management endpoints
- **Features**: Admin user oversight with role management and account deactivation

### **Term Test Lab (40pts)**

#### **Transactions CRUD API (25pts)**
- **Frontend**: `jquery/customer/checkout.html` - Order placement interface
- **Backend**: `nodejs/routes/item.js` - Order placement functionality
- **Features**: Complete order processing with payment integration

#### **Email notifications when updating transaction (5pts)**
- **Frontend**: `jquery/admin/orders.html` - Order management interface
- **Backend**: `nodejs/routes/seller.js` - Order status update emails
- **Features**: Automated email notifications for order status changes

#### **Email notifications with PDF receipt (10pts)**
- **Frontend**: `jquery/customer/checkout.html` - Order confirmation
- **Backend**: `nodejs/routes/item.js` - Order confirmation with PDF attachment
- **Features**: Email receipts with detailed PDF order summaries

### **Quiz Requirements**

#### **Quiz 1: jQuery validation for MP4 and MP5 (15pts)**
- **Frontend**: 
  - `jquery/sellers/categories.html` - Form validation
  - `jquery/admin/items.html` - Admin form validation
- **Features**: Client-side form validation for product management

#### **Quiz 2: jQuery/api search/autocomplete on homepage (15pts)**
- **Frontend**: `jquery/index.html` - Homepage with search functionality
- **Backend**: `nodejs/routes/item.js` - Product search API
- **Features**: Real-time product search with autocomplete

#### **Quiz 3: Route protection middleware (15pts)**
- **Backend**: 
  - `nodejs/routes/admin.js` - Admin-only middleware
  - `nodejs/routes/seller.js` - Seller-only middleware
- **Features**: Role-based access control for all protected routes

#### **Quiz 4: Three.js charts (15pts)**
- **Frontend**: `jquery/admin/index.html` - Admin dashboard with charts
- **Features**: Bar, line, and pie charts for analytics

### **Unit Tests**

#### **Unit Test 1: UI/UX Design (20pts)**
- **Frontend**: All HTML pages with responsive design
- **Features**: Modern, user-friendly interface with consistent styling

#### **Unit Test 2: jQuery pagination & infinite scroll (20pts)**
- **Frontend**: 
  - `jquery/product_catalog.html` - Pagination
  - `jquery/sellers/index-sellers.html` - Infinite scroll
- **Features**: Advanced pagination and infinite scroll implementations

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (XAMPP/WAMP)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd ITCP-MARI/our
   ```

2. **Install backend dependencies**
   ```bash
   cd nodejs
   npm install
   ```

3. **Set up the database**
   - Import `homehaven_dbase(final3).sql` into MySQL
   - Update database configuration in `nodejs/config/database.js`

4. **Configure environment variables**
   ```bash
   # Create .env file in nodejs directory
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   JWT_SECRET=your-secret-key
   ```

5. **Start the backend server**
   ```bash
   cd nodejs
   npm start
   ```

6. **Access the application**
   - Frontend: `http://localhost:4000/jquery/`
   - Backend API: `http://localhost:4000/api/v1/`

## 👥 User Roles

### **Customer**
- Browse products
- Add items to cart
- Place orders
- Track order status
- Manage profile

### **Seller**
- Manage product catalog
- Upload product images
- Process orders
- Update order status
- View sales analytics

### **Admin**
- User management
- Product oversight
- Order monitoring
- System analytics
- Platform administration

## 🔧 Key Features

### **Authentication & Authorization**
- JWT-based authentication
- Role-based access control
- Secure password handling
- Session management

### **Product Management**
- Multi-image uploads
- Category organization
- Stock tracking
- Price management

### **Order Processing**
- Shopping cart functionality
- Multiple payment methods
- Order status tracking
- Email notifications

### **Admin Dashboard**
- User management
- Product oversight
- Order monitoring
- Analytics and reporting

## 📧 Email Notifications

The system sends automated emails for:
- Order confirmations (with PDF receipts)
- Order status updates
- Account activation/deactivation
- Password resets

## 🛡️ Security Features

- JWT token authentication
- Role-based middleware protection
- Input validation and sanitization
- Secure file upload handling
- SQL injection prevention

## 📊 Database Schema

Key tables:
- `users` - User accounts and authentication
- `item` - Product catalog
- `orderinfo` - Order management
- `customer` - Customer profiles
- `sellers` - Seller information
- `activity_logs` - System activity tracking

## 🎨 Frontend Technologies

- **HTML5** - Semantic markup
- **CSS3** - Responsive styling
- **jQuery** - Dynamic interactions
- **Bootstrap** - UI components
- **DataTables** - Advanced tables

## 🔧 Backend Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Nodemailer** - Email sending
- **PDFKit** - PDF generation

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/v1/login` - User login
- `POST /api/v1/register` - User registration
- `POST /api/v1/profile` - Profile updates

### Product Endpoints
- `GET /api/v1/products` - List all products
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Order Endpoints
- `POST /api/v1/orders/place` - Place order
- `GET /api/v1/orders/history` - Order history
- `PATCH /api/v1/seller/orders/:id/status` - Update order status

### Admin Endpoints
- `GET /api/v1/admin/users` - List users
- `PATCH /api/v1/admin/users/:id/role` - Update user role
- `PATCH /api/v1/admin/users/:id/state` - Activate/deactivate user

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `config/database.js`

2. **Email Not Sending**
   - Verify email credentials in environment variables
   - Check Gmail app password settings

3. **File Upload Issues**
   - Ensure `uploads/` directory exists
   - Check file permissions

4. **JWT Token Errors**
   - Verify JWT_SECRET is set
   - Check token expiration

## 📞 Support

For technical support or questions about the ITCP requirements implementation, please refer to the code comments that map each requirement to its specific implementation.

## 📄 License

This project is developed for educational purposes as part of the ITCP course requirements.

---

**Developed by:** [Your Name]  
**Course:** Introduction to Computer Programming (ITCP)  
**Institution:** [Your Institution]  
**Date:** 2025 
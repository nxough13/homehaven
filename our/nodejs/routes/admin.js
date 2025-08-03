const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Activity logging function
async function logActivity(userId, action, modelType = null, modelId = null, description = null, req = null) {
  try {
    const ipAddress = req ? req.ip || req.connection.remoteAddress : null;
    const userAgent = req ? req.get('User-Agent') : null;
    
    await db.query(
      'INSERT INTO activity_logs (user_id, action, model_type, model_id, description, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, action, modelType, modelId, description, ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

// JWT middleware (copied from auth.js)
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided.' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token.' });
    req.user = user;
    next();
  });
}

// ---Code para sa Quiz 3: Route Protection Middleware (15pts)----
// Admin-only middleware para sa route protection
function adminOnly(req, res, next) {
  authenticateJWT(req, res, function() {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }
    next();
  });
}

// ---Code para sa MP7: Admin can update role of user, deactivate users, List users on datatable (20pts)----
// List all users
router.get('/users', adminOnly, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, status, state, profile_image, created_at FROM users');
    
    // Process users to handle undefined values
    const processedUsers = users.map(user => ({
      id: user.id,
      name: user.name || 'Unknown User',
      email: user.email || 'N/A',
      role: user.role || 'user',
      status: user.status || 'active', // User-editable status
      state: user.state || 'active', // Admin-editable state
      profile_image: user.profile_image,
      created_at: user.created_at
    }));
    
    res.json({ success: true, users: processedUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: err.message });
  }
});

// ---Code para sa MP7: Admin can update role of user (20pts)----
// Update user role
router.patch('/users/:id/role', adminOnly, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['user', 'customer', 'seller', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }
  try {
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ success: true, message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update role', error: err.message });
  }
});

// Update user status (activate/deactivate)
router.patch('/users/:id/status', adminOnly, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  try {
    await db.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
  }
});

// ---Code para sa MP7: Admin can deactivate users (20pts)----
// Update user state (activate/deactivate using state column)
router.patch('/users/:id/state', adminOnly, async (req, res) => {
  const { id } = req.params;
  const { state, reason } = req.body;
  
  console.log('DEBUG: Received request:', { id, state, reason });
  
  if (!['active', 'inactive'].includes(state)) {
    return res.status(400).json({ success: false, message: 'Invalid state' });
  }
  
  if (!reason || reason.trim() === '') {
    return res.status(400).json({ success: false, message: 'Reason is required' });
  }
  
  try {
    console.log('DEBUG: Fetching user details...');
    // Get user details for email
    const [users] = await db.query('SELECT name, email FROM users WHERE id = ?', [id]);
    console.log('DEBUG: User query result:', users);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const user = users[0];
    console.log('DEBUG: User found:', user);
    
    console.log('DEBUG: Updating user state...');
    // Update user state using the state column
    await db.query('UPDATE users SET state = ? WHERE id = ?', [state, id]);
    console.log('DEBUG: Database update successful');
    
    // Send email notification
    try {
      console.log('DEBUG: Setting up email transporter...');
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'homehaven984@gmail.com',
          pass: process.env.EMAIL_PASS || 'nfiopcrbahrmxvru'
        }
      });
      
      const action = state === 'active' ? 'activated' : 'deactivated';
      const subject = `Your Home Haven Account Has Been ${action.charAt(0).toUpperCase() + action.slice(1)}`;
      
      console.log('DEBUG: Preparing email content...');
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8B5C2A, #a67c52); color: white; padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🏠 Home Haven</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Account Status Update</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #8B5C2A; margin-top: 0;">Hello ${user.name},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Your Home Haven account has been <strong>${action}</strong> by an administrator.
            </p>
            
            <div style="background: ${state === 'active' ? '#d4edda' : '#f8d7da'}; border: 1px solid ${state === 'active' ? '#c3e6cb' : '#f5c6cb'}; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: ${state === 'active' ? '#155724' : '#721c24'};">
                ${state === 'active' ? '✅ Account Activated' : '❌ Account Deactivated'}
              </h3>
              <p style="margin-bottom: 0; color: ${state === 'active' ? '#155724' : '#721c24'};">
                <strong>Reason:</strong> ${reason}
              </p>
            </div>
            
            ${state === 'inactive' ? `
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #856404;">
                  <strong>Note:</strong> If you believe this action was taken in error, please contact our support team.
                </p>
              </div>
            ` : ''}
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Thank you for using Home Haven.<br>
              Best regards,<br>
              The Home Haven Team
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `;
      
      console.log('DEBUG: Sending email to:', user.email);
      await transporter.sendMail({
        from: 'Home Haven <noreply@homehaven.com>',
        to: user.email,
        subject: subject,
        html: emailHtml
      });
      console.log('DEBUG: Email sent successfully');
      
      // Log the activity
      console.log('DEBUG: Logging activity...');
      await logActivity(req.user.id, 'user_state_changed', 'user', id, `User ${action}: ${reason}`, req);
      console.log('DEBUG: Activity logged successfully');
      
      res.json({ success: true, message: `User ${action} successfully. Email sent.` });
      
    } catch (emailError) {
      console.error('DEBUG: Email sending error:', emailError);
      console.error('DEBUG: Email error stack:', emailError.stack);
      
      // Still log the activity even if email fails
      console.log('DEBUG: Logging activity despite email failure...');
      await logActivity(req.user.id, 'user_state_changed', 'user', id, `User ${state === 'active' ? 'activated' : 'deactivated'}: ${reason}`, req);
      console.log('DEBUG: Activity logged successfully');
      
      const action = state === 'active' ? 'activated' : 'deactivated';
      res.json({ success: true, message: `User ${action} successfully. Email failed but state updated.` });
    }
  } catch (err) {
    console.error('DEBUG: State update error:', err);
    console.error('DEBUG: Error stack:', err.stack);
    res.status(500).json({ success: false, message: 'Failed to update state', error: err.message });
  }
});



// Delete user
router.delete('/users/:id', adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    // Check if user exists
    const [user] = await db.query('SELECT id, role FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Prevent deleting the last admin
    if (user[0].role === 'admin') {
      const [adminCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "admin"');
      if (adminCount[0].count <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot delete the last admin user' });
      }
    }
    
    // Delete user (cascade will handle related records)
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete user', error: err.message });
  }
});

// Get single user details
router.get('/users/:id', adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    // Get user basic info
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const user = users[0];
    
    // Get additional info based on role
    if (user.role === 'customer') {
      const [customers] = await db.query('SELECT * FROM customer WHERE user_id = ?', [id]);
      if (customers.length > 0) {
        user.customer = customers[0];
      }
    } else if (user.role === 'seller') {
      const [sellers] = await db.query('SELECT * FROM sellers WHERE user_id = ?', [id]);
      if (sellers.length > 0) {
        user.seller = sellers[0];
      }
    }
    
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user details', error: err.message });
  }
});

// Get single item details
router.get('/items/:id', adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    // Get item with category and seller info
    const [items] = await db.query(`
      SELECT i.item_id, i.name, i.description, i.sku, i.sell_price, i.status, i.created_at, i.image,
             c.name AS category_name, c.category_id,
             st.quantity AS stock_quantity,
             u.id AS seller_id, u.name AS seller_name
      FROM item i
      LEFT JOIN categories c ON i.category_id = c.category_id
      LEFT JOIN stock st ON i.item_id = st.item_id
      LEFT JOIN users u ON i.seller_id = u.id
      WHERE i.item_id = ?
    `, [id]);
    
    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    const item = items[0];
    
    // Process item to handle undefined values
    const processedItem = {
      item_id: item.item_id,
      name: item.name || 'Unknown Item',
      description: item.description || 'No description available',
      sku: item.sku || 'N/A',
      sell_price: item.sell_price || 0,
      status: item.status || 'inactive',
      created_at: item.created_at,
      category_name: item.category_name || 'Uncategorized',
      category_id: item.category_id,
      stock_quantity: item.stock_quantity || 0,
      seller_id: item.seller_id,
      seller_name: item.seller_name || 'Unknown Seller',
      image: item.image || null
    };
    
    res.json({ success: true, item: processedItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch item details', error: err.message });
  }
});

// List all customers (join users + customer)
router.get('/customers', adminOnly, async (req, res) => {
  try {
    const [customers] = await db.query(`
      SELECT u.id, u.name, u.email, u.role, u.status, u.profile_image, u.created_at,
             c.customer_id, c.fname, c.lname, c.addressline, c.town, c.zipcode, c.phone, c.image_path
      FROM users u
      JOIN customer c ON u.id = c.user_id
    `);
    
    // Process customers to handle undefined values
    const processedCustomers = customers.map(customer => ({
      id: customer.id,
      name: customer.name || 'Unknown User',
      email: customer.email || 'N/A',
      role: customer.role || 'customer',
      status: customer.status || 'active',
      profile_image: customer.profile_image,
      created_at: customer.created_at,
      customer_id: customer.customer_id,
      fname: customer.fname || '',
      lname: customer.lname || '',
      addressline: customer.addressline || 'N/A',
      town: customer.town || 'N/A',
      zipcode: customer.zipcode || 'N/A',
      phone: customer.phone || 'N/A',
      image_path: customer.image_path
    }));
    
    res.json({ success: true, customers: processedCustomers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch customers', error: err.message });
  }
});

// List all verified sellers (join users + sellers)
router.get('/sellers', adminOnly, async (req, res) => {
  try {
    const [sellers] = await db.query(`
      SELECT u.id, u.name, u.email, u.role, u.status, u.profile_image, u.created_at,
             s.seller_id, s.business_name, s.business_description, s.business_address, s.business_phone, s.business_email, s.is_verified
      FROM users u
      JOIN sellers s ON u.id = s.user_id
    `);
    
    // Process sellers to handle undefined values
    const processedSellers = sellers.map(seller => ({
      id: seller.id,
      name: seller.name || 'Unknown User',
      email: seller.email || 'N/A',
      role: seller.role || 'seller',
      status: seller.status || 'active',
      profile_image: seller.profile_image,
      created_at: seller.created_at,
      seller_id: seller.seller_id,
      business_name: seller.business_name || 'Unknown Business',
      business_description: seller.business_description || '',
      business_address: seller.business_address || 'N/A',
      business_phone: seller.business_phone || 'N/A',
      business_email: seller.business_email || 'N/A',
      is_verified: seller.is_verified || 0
    }));
    
    res.json({ success: true, sellers: processedSellers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch sellers', error: err.message });
  }
});

// List all verified sellers only (admin only)
router.get('/sellers/verified', adminOnly, async (req, res) => {
  try {
    const [sellers] = await db.query(`
      SELECT u.id, u.name, u.email, u.role, u.status, u.profile_image, u.created_at,
             s.seller_id, s.business_name, s.business_description, s.business_address, s.business_phone, s.business_email, s.is_verified
      FROM users u
      JOIN sellers s ON u.id = s.user_id
      WHERE s.is_verified = 1
    `);
    res.json({ success: true, sellers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch verified sellers', error: err.message });
  }
});

// List all unverified sellers (admin only)
router.get('/sellers/unverified', adminOnly, async (req, res) => {
  try {
    const [sellers] = await db.query(`
      SELECT u.id, u.name, u.email, u.role, u.status, u.profile_image, u.created_at,
             s.seller_id, s.business_name, s.business_description, s.business_address, s.business_phone, s.business_email, s.is_verified
      FROM users u
      JOIN sellers s ON u.id = s.user_id
      WHERE s.is_verified = 0
    `);
    res.json({ success: true, sellers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch unverified sellers', error: err.message });
  }
});

// Verify a seller (admin only)
router.patch('/sellers/:sellerId/verify', adminOnly, async (req, res) => {
  const { sellerId } = req.params;
  try {
    const [result] = await db.query('UPDATE sellers SET is_verified = 1 WHERE seller_id = ?', [sellerId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }
    res.json({ success: true, message: 'Seller verified' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to verify seller', error: err.message });
  }
});

// Deactivate a seller (admin only)
router.patch('/sellers/:sellerId/deactivate', adminOnly, async (req, res) => {
  const { sellerId } = req.params;
  try {
    const [result] = await db.query('UPDATE sellers SET is_verified = 0 WHERE seller_id = ?', [sellerId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }
    res.json({ success: true, message: 'Seller deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to deactivate seller', error: err.message });
  }
});

// Get all items for a specific seller
router.get('/sellers/:sellerId/items', adminOnly, async (req, res) => {
  const { sellerId } = req.params;
  try {
    const [items] = await db.query(`
      SELECT item_id, name, description, sku, sell_price, image, status, created_at
      FROM item
      WHERE seller_id = ?
    `, [sellerId]);
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch items', error: err.message });
  }
});

// Update status of a product (active/inactive)
router.patch('/items/:itemId/status', adminOnly, async (req, res) => {
  const { itemId } = req.params;
  const { status } = req.body;
  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  try {
    await db.query('UPDATE item SET status = ? WHERE item_id = ?', [status, itemId]);
    res.json({ success: true, message: 'Item status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update item status', error: err.message });
  }
});

// PATCH item status (admin only)
router.patch('/items/:itemId/status', adminOnly, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body;
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be "active" or "inactive"' });
    }
    
    const [result] = await db.query(
      'UPDATE item SET status = ? WHERE item_id = ?',
      [status, itemId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    res.json({ success: true, message: `Item status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update item status', error: err.message });
  }
});

// GET all orders with customer and item info (admin only)
router.get('/orders', adminOnly, async (req, res) => {
  try {
    // Get all orders with customer info
    const [orders] = await db.query(`
      SELECT o.orderinfo_id, o.order_number, o.date_placed, o.status, o.total_amount,
             c.fname AS customer_fname, c.lname AS customer_lname, u.email AS customer_email
      FROM orderinfo o
      JOIN customer c ON o.customer_id = c.customer_id
      JOIN users u ON c.user_id = u.id
      ORDER BY o.date_placed DESC
    `);
    
    if (!orders.length) {
      return res.json({ success: true, orders: [] });
    }
    
    // Get all orderlines for these orders
    const orderIds = orders.map(o => o.orderinfo_id);
    let orderlines = [];
    
    if (orderIds.length > 0) {
      const [orderlinesResult] = await db.query(`
        SELECT ol.orderinfo_id, ol.item_name, ol.quantity
        FROM orderline ol
        WHERE ol.orderinfo_id IN (${orderIds.map(() => '?').join(',')})
      `, orderIds);
      orderlines = orderlinesResult;
    }
    
    // Group items by order
    const orderItemsMap = {};
    for (const ol of orderlines) {
      if (!orderItemsMap[ol.orderinfo_id]) orderItemsMap[ol.orderinfo_id] = [];
      orderItemsMap[ol.orderinfo_id].push({ name: ol.item_name, quantity: ol.quantity });
    }
    
    // Attach items and customer name to each order
    const result = orders.map(o => ({
      orderinfo_id: o.orderinfo_id,
      order_number: o.order_number,
      date_placed: o.date_placed,
      status: o.status || 'pending',
      total_amount: o.total_amount,
      customer_fname: o.customer_fname || '',
      customer_lname: o.customer_lname || '',
      customer_name: `${o.customer_fname || ''} ${o.customer_lname || ''}`.trim() || 'Unknown Customer',
      customer_email: o.customer_email || '',
      items: orderItemsMap[o.orderinfo_id] || []
    }));
    
    res.json({ success: true, orders: result });
  } catch (err) {
    console.error('Admin orders error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: err.message });
  }
});

// GET all items with category, stock, and seller info (admin only)
router.get('/items', adminOnly, async (req, res) => {
  try {
    const [items] = await db.query(`
      SELECT i.item_id, i.name, i.sku, i.sell_price, i.status, i.created_at, i.image,
             c.name AS category_name, c.category_id,
             st.quantity AS stock_quantity,
             s.seller_id, s.business_name AS seller_name
      FROM item i
      LEFT JOIN categories c ON i.category_id = c.category_id
      LEFT JOIN stock st ON i.item_id = st.item_id
      LEFT JOIN sellers s ON i.seller_id = s.seller_id
      ORDER BY i.created_at DESC
    `);
    
    // Process items to handle undefined values
    const processedItems = items.map(item => ({
      item_id: item.item_id,
      name: item.name || 'Unknown Item',
      sku: item.sku || 'N/A',
      sell_price: item.sell_price || 0,
      status: item.status || 'inactive',
      created_at: item.created_at,
      category_name: item.category_name || 'Uncategorized',
      category_id: item.category_id,
      stock_quantity: item.stock_quantity || 0,
      seller_id: item.seller_id,
      seller_name: item.seller_name || 'Unknown Seller',
      image: item.image || null
    }));
    
    res.json({ success: true, items: processedItems });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch items', error: err.message });
  }
});

// GET individual item details (admin only)
router.get('/items/:itemId', adminOnly, async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const [items] = await db.query(`
      SELECT i.item_id, i.name, i.description, i.sku, i.sell_price, i.status, i.created_at, i.image,
             c.name AS category_name, c.category_id,
             st.quantity AS stock_quantity,
             s.seller_id, s.business_name AS seller_name
      FROM item i
      LEFT JOIN categories c ON i.category_id = c.category_id
      LEFT JOIN stock st ON i.item_id = st.item_id
      LEFT JOIN sellers s ON i.seller_id = s.seller_id
      WHERE i.item_id = ?
    `, [itemId]);
    
    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    const item = items[0];
    const processedItem = {
      item_id: item.item_id,
      name: item.name || 'Unknown Item',
      description: item.description || 'No description available',
      sku: item.sku || 'N/A',
      sell_price: item.sell_price || 0,
      status: item.status || 'inactive',
      created_at: item.created_at,
      category_name: item.category_name || 'Uncategorized',
      category_id: item.category_id,
      stock_quantity: item.stock_quantity || 0,
      seller_id: item.seller_id,
      seller_name: item.seller_name || 'Unknown Seller',
      image: item.image || null
    };
    
    res.json({ success: true, item: processedItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch item details', error: err.message });
  }
});

// GET all categories (admin only)
router.get('/categories', adminOnly, async (req, res) => {
  try {
    const [categories] = await db.query('SELECT category_id, name FROM categories WHERE is_active = 1 ORDER BY name');
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: err.message });
  }
});

// GET all sellers (admin only)
router.get('/sellers/all', adminOnly, async (req, res) => {
  try {
    const [sellers] = await db.query('SELECT seller_id, business_name AS seller_name FROM sellers ORDER BY business_name');
    res.json({ success: true, sellers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch sellers', error: err.message });
  }
});

// GET user activities organized by user (admin only)
router.get('/user-activities', adminOnly, async (req, res) => {
  try {
    // Get all users with their activities
    const [userActivities] = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.status,
        u.created_at as user_created_at,
        al.log_id,
        al.action,
        al.model_type,
        al.model_id,
        al.description,
        al.ip_address,
        al.user_agent,
        al.created_at as activity_created_at
      FROM users u
      LEFT JOIN activity_logs al ON u.id = al.user_id
      ORDER BY u.name, al.created_at DESC
    `);
    
    // Group activities by user
    const usersWithActivities = {};
    
    userActivities.forEach(row => {
      const userId = row.id;
      
      if (!usersWithActivities[userId]) {
        usersWithActivities[userId] = {
          user_id: userId,
          name: row.name,
          email: row.email,
          role: row.role,
          status: row.status,
          user_created_at: row.user_created_at,
          activities: []
        };
      }
      
      // Add activity if it exists
      if (row.log_id) {
        usersWithActivities[userId].activities.push({
          log_id: row.log_id,
          action: row.action,
          model_type: row.model_type,
          model_id: row.model_id,
          description: row.description,
          ip_address: row.ip_address,
          user_agent: row.user_agent,
          created_at: row.activity_created_at
        });
      }
    });
    
    // Convert to array and sort by user name
    const result = Object.values(usersWithActivities).sort((a, b) => a.name.localeCompare(b.name));
    
    res.json({ success: true, userActivities: result });
  } catch (err) {
    console.error('Error fetching user activities:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user activities', error: err.message });
  }
});

module.exports = router; 
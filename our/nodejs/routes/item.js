const express = require('express');
const router = express.Router();
const db = require('../db');  // use the db.js file you made
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'devsecret';
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');

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
// Multer setup for GCash receipt upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'gcash_' + Date.now() + '_' + Math.round(Math.random() * 1E9) + ext);
  }
});
const upload = multer({ storage });

// Middleware to get user_id from JWT
function authRequired(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const decoded = jwt.verify(auth.slice(7), SECRET);
    req.user_id = decoded.id;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

router.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS current_time');
    res.json({
      success: true,
      time: rows[0].current_time
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
});

// GET /products/featured - fetch up to 3 active products
router.get('/products/featured', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.item_id, i.name, i.description, i.sell_price, i.image, u.status as seller_status, u.state as seller_state
      FROM item i
      LEFT JOIN users u ON i.seller_id = u.id
      WHERE i.status = 'active' 
        AND (i.seller_id IS NULL OR (u.status = 'active' AND u.state = 'active'))
      LIMIT 3
    `);
    res.json({ success: true, products: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch featured products' });
  }
});

// ---Code para sa MP1: NodeJS CRUD API (20pts)----
// GET /products - list all products (with stock and category)
router.get('/products', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, c.name AS category_name, st.quantity AS stock_quantity, u.status as seller_status, u.state as seller_state
      FROM item i
      LEFT JOIN categories c ON i.category_id = c.category_id
      LEFT JOIN stock st ON i.item_id = st.item_id
      LEFT JOIN users u ON i.seller_id = u.id
      WHERE i.status = 'active' 
        AND (i.seller_id IS NULL OR (u.status = 'active' AND u.state = 'active'))
    `);
    // Parse image JSON for each product if needed
    rows.forEach(row => { try { row.image = JSON.parse(row.image); } catch {} });
    res.json({ success: true, products: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// GET /products/categories - public endpoint to fetch all categories
router.get('/products/categories', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories WHERE is_active = 1');
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// GET /products/wishlist - fetch products by a list of IDs (for wishlist)
router.get('/products/wishlist', async (req, res) => {
  try {
    let ids = req.query.ids;
    if (!ids) return res.json({ success: true, products: [] });
    if (typeof ids === 'string') ids = ids.split(',').map(x => parseInt(x)).filter(x => !isNaN(x));
    if (!Array.isArray(ids) || !ids.length) return res.json({ success: true, products: [] });
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await db.query(`
      SELECT i.*, u.status as seller_status, u.state as seller_state
      FROM item i
      LEFT JOIN users u ON i.seller_id = u.id
      WHERE i.item_id IN (${placeholders})
        AND i.status = 'active' 
        AND (i.seller_id IS NULL OR (u.status = 'active' AND u.state = 'active'))
    `, ids);
    // Parse image JSON for each product
    rows.forEach(row => { try { row.image = JSON.parse(row.image); } catch {} });
    res.json({ success: true, products: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch wishlist products' });
  }
});

// GET /products/:id - get one product
router.get('/products/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, u.status as seller_status, u.state as seller_state
      FROM item i
      LEFT JOIN users u ON i.seller_id = u.id
      WHERE i.item_id = ?
        AND i.status = 'active' 
        AND (i.seller_id IS NULL OR (u.status = 'active' AND u.state = 'active'))
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, product: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// GET /products/details/:id - get product with category, seller, and stock info
router.get('/products/details/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, c.name AS category_name, s.business_name, s.business_description, s.business_email, s.seller_id, st.quantity AS stock_quantity, u.status as seller_status, u.state as seller_state
      FROM item i
      LEFT JOIN categories c ON i.category_id = c.category_id
      LEFT JOIN sellers s ON i.seller_id = s.user_id
      LEFT JOIN stock st ON i.item_id = st.item_id
      LEFT JOIN users u ON i.seller_id = u.id
      WHERE i.item_id = ?
        AND i.status = 'active' 
        AND (i.seller_id IS NULL OR (u.status = 'active' AND u.state = 'active'))
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Product not found' });
    try { rows[0].image = JSON.parse(rows[0].image); } catch {}
    res.json({ success: true, product: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch product details' });
  }
});

// GET /wishlist - get all wishlist item_ids for the logged-in user
router.get('/wishlist', authRequired, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT item_id FROM wishlist WHERE customer_id = (SELECT customer_id FROM customer WHERE user_id = ?)', [req.user_id]);
    const ids = rows.map(r => r.item_id);
    res.json({ success: true, wishlist: ids });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch wishlist' });
  }
});

// POST /wishlist - add an item to the wishlist for the logged-in user
router.post('/wishlist', authRequired, async (req, res) => {
  try {
    const item_id = req.body.item_id;
    console.log('[WISHLIST] user_id:', req.user_id, 'item_id:', item_id);
    if (!item_id) {
      console.log('[WISHLIST] Missing item_id');
      return res.status(400).json({ success: false, error: 'Missing item_id' });
    }
    // Get customer_id from user_id
    const [custRows] = await db.query('SELECT customer_id FROM customer WHERE user_id = ?', [req.user_id]);
    if (!custRows.length) {
      console.log('[WISHLIST] Not a customer for user_id:', req.user_id);
      return res.status(400).json({ success: false, error: 'Not a customer' });
    }
    const customer_id = custRows[0].customer_id;
    console.log('[WISHLIST] Found customer_id:', customer_id);
    // Insert if not exists
    await db.query('INSERT IGNORE INTO wishlist (customer_id, item_id) VALUES (?, ?)', [customer_id, item_id]);
    console.log('[WISHLIST] Added to wishlist:', { customer_id, item_id });
    res.json({ success: true });
  } catch (err) {
    console.error('[WISHLIST] Error:', err);
    res.status(500).json({ success: false, error: 'Failed to add to wishlist' });
  }
});

// DELETE /wishlist/:item_id - remove an item from the wishlist for the logged-in user
router.delete('/wishlist/:item_id', authRequired, async (req, res) => {
  try {
    const item_id = req.params.item_id;
    // Get customer_id from user_id
    const [custRows] = await db.query('SELECT customer_id FROM customer WHERE user_id = ?', [req.user_id]);
    if (!custRows.length) return res.status(400).json({ success: false, error: 'Not a customer' });
    const customer_id = custRows[0].customer_id;
    await db.query('DELETE FROM wishlist WHERE customer_id = ? AND item_id = ?', [customer_id, item_id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to remove from wishlist' });
  }
});

// --- CART ENDPOINTS ---
// GET /cart - fetch current user's cart
router.get('/cart', authRequired, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM shopping_cart WHERE user_id = ?', [req.user_id]);
    res.json({ success: true, cart: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch cart' });
  }
});
// POST /cart/add - add or update item in cart
router.post('/cart/add', authRequired, async (req, res) => {
  try {
    const { item_id, quantity, price } = req.body;
    if (!item_id || !quantity || !price) return res.status(400).json({ success: false, error: 'Missing fields' });
    // Upsert logic: if exists, update quantity; else insert
    const [existing] = await db.query('SELECT * FROM shopping_cart WHERE user_id = ? AND item_id = ?', [req.user_id, item_id]);
    if (existing.length) {
      await db.query('UPDATE shopping_cart SET quantity = quantity + ? WHERE user_id = ? AND item_id = ?', [quantity, req.user_id, item_id]);
    } else {
      await db.query('INSERT INTO shopping_cart (user_id, item_id, quantity, price) VALUES (?, ?, ?, ?)', [req.user_id, item_id, quantity, price]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to add to cart' });
  }
});
// POST /cart/remove - remove item from cart
router.post('/cart/remove', authRequired, async (req, res) => {
  try {
    const { item_id } = req.body;
    if (!item_id) return res.status(400).json({ success: false, error: 'Missing item_id' });
    await db.query('DELETE FROM shopping_cart WHERE user_id = ? AND item_id = ?', [req.user_id, item_id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to remove from cart' });
  }
});

// ---Code para sa MP1: NodeJS CRUD API (20pts)----
// POST /products - create product
router.post('/products', async (req, res) => {
  try {
    const { category_id, name, description, short_description, sku, cost_price, sell_price, image, weight, dimensions, material, color, style, room_type, status, is_featured, meta_title, meta_description } = req.body;
    const [result] = await db.query(
      'INSERT INTO item (category_id, name, description, short_description, sku, cost_price, sell_price, image, weight, dimensions, material, color, style, room_type, status, is_featured, meta_title, meta_description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [category_id, name, description, short_description, sku, cost_price, sell_price, image, weight, dimensions, material, color, style, room_type, status, is_featured, meta_title, meta_description]
    );
    res.status(201).json({ success: true, product_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

// ---Code para sa MP1: NodeJS CRUD API (20pts)----
// PUT /products/:id - update product
router.put('/products/:id', async (req, res) => {
  try {
    const { category_id, name, description, short_description, sku, cost_price, sell_price, image, weight, dimensions, material, color, style, room_type, status, is_featured, meta_title, meta_description } = req.body;
    const [result] = await db.query(
      'UPDATE item SET category_id=?, name=?, description=?, short_description=?, sku=?, cost_price=?, sell_price=?, image=?, weight=?, dimensions=?, material=?, color=?, style=?, room_type=?, status=?, is_featured=?, meta_title=?, meta_description=?, updated_at=NOW() WHERE item_id=?',
      [category_id, name, description, short_description, sku, cost_price, sell_price, image, weight, dimensions, material, color, style, room_type, status, is_featured, meta_title, meta_description, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

// ---Code para sa MP1: NodeJS CRUD API (20pts)----
// DELETE /products/:id - delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM item WHERE item_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

// GET /products/:id/reviews - fetch all reviews for a product
router.get('/products/:id/reviews', async (req, res) => {
  const item_id = req.params.id;
  let user_id = null;
  let customer_id = null;
  // Try to get user_id from JWT if present
  try {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      const jwt = require('jsonwebtoken');
      const SECRET = process.env.JWT_SECRET || 'devsecret';
      const decoded = jwt.verify(auth.slice(7), SECRET);
      user_id = decoded.id;
    }
  } catch {}
  if (user_id) {
    const [custRows] = await db.query('SELECT customer_id FROM customer WHERE user_id = ?', [user_id]);
    if (custRows.length) customer_id = custRows[0].customer_id;
  }
  try {
    const [reviews] = await db.query('SELECT r.*, c.fname, c.lname FROM reviews r JOIN customer c ON r.customer_id = c.customer_id WHERE r.item_id = ?', [item_id]);
    const reviewsWithFlag = reviews.map(r => ({
      ...r,
      is_own_review: customer_id && r.customer_id === customer_id
    }));
    res.json({ success: true, reviews: reviewsWithFlag });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
});

// POST /products/:id/reviews - add a review (must have delivered order)
router.post('/products/:id/reviews', authRequired, async (req, res) => {
  const { rating, review_text } = req.body;
  const item_id = req.params.id;
  const user_id = req.user_id;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be 1-5.' });
  }
  try {
    // Get customer_id for this user
    const [custRows] = await db.query('SELECT customer_id FROM customer WHERE user_id = ?', [user_id]);
    if (!custRows.length) return res.status(403).json({ success: false, message: 'Not a customer.' });
    const customer_id = custRows[0].customer_id;
    // Check for delivered order
    const [orderRows] = await db.query(`
      SELECT 1 FROM orderline ol
      JOIN orderinfo o ON ol.orderinfo_id = o.orderinfo_id
      WHERE ol.item_id = ? AND o.customer_id = ? AND o.status = 'delivered'
      LIMIT 1
    `, [item_id, customer_id]);
    if (!orderRows.length) return res.status(403).json({ success: false, message: 'You can only review products you have received (delivered).' });
    // If this is an eligibility check, do not insert a review
    if (review_text === '__eligibility_check__') {
      return res.json({ success: true, eligible: true });
    }
    // Insert review (allow multiple reviews)
    await db.query('INSERT INTO reviews (item_id, customer_id, rating, review_text) VALUES (?, ?, ?, ?)', [item_id, customer_id, rating, review_text || null]);
    
    // Log review submission activity
    await logActivity(user_id, 'review_submitted', 'reviews', item_id, `Review submitted for product ID ${item_id} with rating ${rating}`, req);
    
    res.json({ success: true, message: 'Review submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
});

// PUT /products/:id/reviews/:review_id - edit a review (only by owner)
router.put('/products/:id/reviews/:review_id', authRequired, async (req, res) => {
  const { rating, review_text } = req.body;
  const item_id = req.params.id;
  const review_id = req.params.review_id;
  const user_id = req.user_id;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be 1-5.' });
  }
  try {
    // Get customer_id for this user
    const [custRows] = await db.query('SELECT customer_id FROM customer WHERE user_id = ?', [user_id]);
    if (!custRows.length) return res.status(403).json({ success: false, message: 'Not a customer.' });
    const customer_id = custRows[0].customer_id;
    // Check ownership
    const [revRows] = await db.query('SELECT * FROM reviews WHERE review_id = ? AND item_id = ? AND customer_id = ?', [review_id, item_id, customer_id]);
    if (!revRows.length) return res.status(403).json({ success: false, message: 'You can only edit your own review.' });
    await db.query('UPDATE reviews SET rating = ?, review_text = ? WHERE review_id = ?', [rating, review_text, review_id]);
    res.json({ success: true, message: 'Review updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update review.' });
  }
});

// DELETE /products/:id/reviews/:review_id - delete a review (only by owner)
router.delete('/products/:id/reviews/:review_id', authRequired, async (req, res) => {
  const item_id = req.params.id;
  const review_id = req.params.review_id;
  const user_id = req.user_id;
  try {
    // Get customer_id for this user
    const [custRows] = await db.query('SELECT customer_id FROM customer WHERE user_id = ?', [user_id]);
    if (!custRows.length) return res.status(403).json({ success: false, message: 'Not a customer.' });
    const customer_id = custRows[0].customer_id;
    // Check ownership
    const [revRows] = await db.query('SELECT * FROM reviews WHERE review_id = ? AND item_id = ? AND customer_id = ?', [review_id, item_id, customer_id]);
    if (!revRows.length) return res.status(403).json({ success: false, message: 'You can only delete your own review.' });
    await db.query('DELETE FROM reviews WHERE review_id = ?', [review_id]);
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete review.' });
  }
});

// ---Code para sa Term Test Lab: Transactions CRUD API (25pts)----
// POST /orders/place - place an order for the logged-in user
router.post('/orders/place', authRequired, upload.single('gcash_receipt'), async (req, res) => {
  const user_id = req.user_id;
  let items, payment_method, gcash_phone, gcash_receipt;
  if (req.is('multipart/form-data')) {
    items = JSON.parse(req.body.items);
    payment_method = req.body.payment_method;
    gcash_phone = req.body.gcash_phone;
    gcash_receipt = req.file ? '/uploads/' + req.file.filename : null;
  } else {
    items = req.body.items;
    payment_method = req.body.payment_method;
    gcash_phone = req.body.gcash_phone;
    gcash_receipt = null;
  }
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ success: false, error: 'No items in order.' });
  if (!payment_method || !['cash','gcash'].includes(payment_method)) return res.status(400).json({ success: false, error: 'Invalid payment method.' });
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // Get customer_id
    const [custRows] = await conn.query('SELECT customer_id, fname, lname, addressline, town, zipcode, phone FROM customer WHERE user_id = ?', [user_id]);
    if (!custRows.length) throw new Error('Customer not found');
    const customer_id = custRows[0].customer_id;
    // Set payment_status
    let payment_status = payment_method === 'cash' ? 'pending' : 'paid';
    // Insert orderinfo
    const now = new Date();
    const deliveryDate = new Date(now.getTime() + 24*60*60*1000); // +1 day
    const order_number = 'ORD-' + Date.now();
    const [orderRes] = await conn.query(
      'INSERT INTO orderinfo (customer_id, order_number, date_placed, status, payment_status, payment_method, gcash_phone, gcash_receipt, subtotal, shipping, total_amount, ship_fname, ship_lname, ship_address, ship_town, ship_zipcode, ship_phone, created_at) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [customer_id, order_number, 'confirmed', payment_status, payment_method, gcash_phone || null, gcash_receipt, 0, 0, 0, custRows[0].fname, custRows[0].lname, custRows[0].addressline, custRows[0].town, custRows[0].zipcode, custRows[0].phone]
    );
    const orderinfo_id = orderRes.insertId;
    let subtotal = 0;
    // Insert orderline for each item
    for (const item of items) {
      const [prodRows] = await conn.query('SELECT name, sell_price, seller_id FROM item WHERE item_id = ?', [item.item_id]);
      if (!prodRows.length) throw new Error('Product not found');
      const unit_price = prodRows[0].sell_price;
      const total_price = unit_price * item.quantity;
      subtotal += total_price;
      await conn.query('INSERT INTO orderline (orderinfo_id, item_id, item_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)',
        [orderinfo_id, item.item_id, prodRows[0].name, item.quantity, unit_price, total_price]);
      // Decrement stock for this item
      await conn.query('UPDATE stock SET quantity = quantity - ? WHERE item_id = ?', [item.quantity, item.item_id]);
    }
    // Update subtotal, total_amount
    await conn.query('UPDATE orderinfo SET subtotal=?, total_amount=? WHERE orderinfo_id=?', [subtotal, subtotal, orderinfo_id]);
    await conn.commit();
    
    // Log order placement activity
    await logActivity(user_id, 'order_placed', 'orderinfo', orderinfo_id, `Order placed: ${order_number} with ${items.length} items, total: ₱${subtotal}`, req);
    
    // ---Code para sa Term Test Lab: PDF receipt with order details (10pts)----
    // Generate PDF receipt
    function generateOrderPDF(order, items, customer) {
      return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });
        doc.fontSize(20).text('Order Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Order Number: ${order.order_number}`);
        doc.text(`Date: ${new Date(order.date_placed || Date.now()).toLocaleString()}`);
        doc.text(`Customer: ${customer.fname} ${customer.lname}`);
        doc.text(`Address: ${customer.addressline}, ${customer.town}, ${customer.zipcode}`);
        doc.text(`Phone: ${customer.phone}`);
        doc.moveDown();
        doc.fontSize(14).text('Items:', { underline: true });
        items.forEach(item => {
          doc.fontSize(12).text(`${item.item_name} (x${item.quantity}) - ₱${item.unit_price} each`);
        });
        doc.moveDown();
        doc.fontSize(14).text(`Total: ₱${order.total_amount}`);
        doc.end();
      });
    }
    // Fetch orderinfo and orderline for PDF
    const [[orderInfoRow]] = await conn.query('SELECT * FROM orderinfo WHERE orderinfo_id = ?', [orderinfo_id]);
    const [orderLineRows] = await conn.query('SELECT * FROM orderline WHERE orderinfo_id = ?', [orderinfo_id]);
    const pdfBuffer = await generateOrderPDF(orderInfoRow, orderLineRows, custRows[0]);
    // Send emails (customer and sellers)
    try {
      // Setup nodemailer using environment variables
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'homehaven984@gmail.com',
          pass: process.env.EMAIL_PASS || 'nfiopcrbahrmxvru'
        }
      });
      // ---Code para sa Term Test Lab: Email notifications with PDF receipt (10pts)----
      // Customer email
      const [userRows] = await conn.query('SELECT email FROM users WHERE id = ?', [user_id]);
      const customerEmail = userRows[0].email;
      
      // Generate beautiful HTML email with order receipt
      const orderDate = new Date(orderInfoRow.date_placed || Date.now()).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation - HomeHaven</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f1ed;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8B5C2A, #a67c52); padding: 30px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🏠 HomeHaven</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your Home, Your Haven</p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px;">
              <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 12px; padding: 30px; margin-bottom: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
                <h2 style="color: #155724; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Order Confirmed!</h2>
                <p style="color: #155724; margin: 0; font-size: 16px; line-height: 1.5;">
                  Thank you for your order! We're excited to fulfill your purchase.
                </p>
              </div>
              
              <!-- Order Details -->
              <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #8B5C2A; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Order Information</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666; font-weight: 500;">Order Number:</span>
                  <span style="color: #8B5C2A; font-weight: 600;">${orderInfoRow.order_number}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666; font-weight: 500;">Date:</span>
                  <span style="color: #8B5C2A; font-weight: 600;">${orderDate}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666; font-weight: 500;">Status:</span>
                  <span style="color: #27ae60; font-weight: 600; background-color: #d5f4e6; padding: 4px 12px; border-radius: 6px;">Confirmed</span>
                </div>
              </div>
              
              <!-- Customer Information -->
              <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #8B5C2A; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Customer Information</h3>
                <div style="margin-bottom: 10px;">
                  <span style="color: #666; font-weight: 500;">Name:</span>
                  <span style="color: #8B5C2A; font-weight: 600; margin-left: 10px;">${custRows[0].fname} ${custRows[0].lname}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span style="color: #666; font-weight: 500;">Address:</span>
                  <span style="color: #8B5C2A; font-weight: 600; margin-left: 10px;">${custRows[0].addressline}, ${custRows[0].town}, ${custRows[0].zipcode}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span style="color: #666; font-weight: 500;">Phone:</span>
                  <span style="color: #8B5C2A; font-weight: 600; margin-left: 10px;">${custRows[0].phone}</span>
                </div>
              </div>
              
              <!-- Items Purchased -->
              <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #8B5C2A; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Items Purchased</h3>
                ${orderLineRows.map(item => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                    <div style="flex: 1;">
                      <div style="color: #333; font-weight: 600; margin-bottom: 4px;">${item.item_name}</div>
                      <div style="color: #666; font-size: 14px;">Quantity: ${item.quantity}</div>
                    </div>
                    <div style="text-align: right;">
                      <div style="color: #8B5C2A; font-weight: 600;">₱${parseFloat(item.unit_price).toLocaleString()}</div>
                      <div style="color: #666; font-size: 14px;">each</div>
                    </div>
                  </div>
                `).join('')}
              </div>
              
              <!-- Total Amount -->
              <div style="background-color: #e8f5e8; border: 1px solid #d4edda; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #155724; font-size: 18px; font-weight: 600;">Total Amount:</span>
                  <span style="color: #155724; font-size: 24px; font-weight: 700;">₱${parseFloat(orderInfoRow.total_amount).toLocaleString()}</span>
                </div>
              </div>
              
              <!-- Next Steps -->
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What's Next?</h3>
                <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.6;">
                  <li>Your order is being processed by our sellers</li>
                  <li>You'll receive updates on your order status</li>
                  <li>Estimated delivery time: 3-7 business days</li>
                  <li>Contact support if you have any questions</li>
                </ul>
              </div>
              
              <!-- Action Buttons -->
              <div style="text-align: center;">
                <a href="http://localhost:3000" style="background: linear-gradient(135deg, #8B5C2A, #a67c52); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; display: inline-block; margin: 10px;">Continue Shopping</a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #666; margin: 0 0 15px 0; font-size: 14px;">
                Thank you for choosing HomeHaven
              </p>
              <div style="color: #999; font-size: 12px;">
                <p style="margin: 5px 0;">📧 support@homehaven.com</p>
                <p style="margin: 5px 0;">📞 1-800-HOME-HAVEN</p>
                <p style="margin: 5px 0;">🌐 www.homehaven.com</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      
      await transporter.sendMail({
        from: 'HomeHaven <homehaven984@gmail.com>',
        to: customerEmail,
        subject: 'Order Confirmation - HomeHaven',
        html: htmlContent,
        attachments: [
          {
            filename: `OrderReceipt_${orderInfoRow.order_number}.pdf`,
            content: pdfBuffer
          }
        ]
      });
      // Seller emails
      const [sellerRows] = await conn.query('SELECT DISTINCT u.email FROM item i JOIN users u ON i.seller_id = u.id WHERE i.item_id IN (?)', [items.map(i=>i.item_id)]);
      for (const seller of sellerRows) {
        const sellerHtmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Order - HomeHaven</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f1ed;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #8B5C2A, #a67c52); padding: 30px 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🏠 HomeHaven</h1>
                <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your Home, Your Haven</p>
              </div>
              
              <!-- Main Content -->
              <div style="padding: 40px;">
                <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; border-radius: 12px; padding: 30px; margin-bottom: 30px; text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 20px;">🛍️</div>
                  <h2 style="color: #0c5460; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">New Order Received!</h2>
                  <p style="color: #0c5460; margin: 0; font-size: 16px; line-height: 1.5;">
                    Congratulations! You have received a new order for your products.
                  </p>
                </div>
                
                <!-- Order Details -->
                <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                  <h3 style="color: #8B5C2A; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Order Information</h3>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666; font-weight: 500;">Order Number:</span>
                    <span style="color: #8B5C2A; font-weight: 600;">${orderInfoRow.order_number}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666; font-weight: 500;">Date:</span>
                    <span style="color: #8B5C2A; font-weight: 600;">${orderDate}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #666; font-weight: 500;">Total Amount:</span>
                    <span style="color: #8B5C2A; font-weight: 600;">₱${parseFloat(orderInfoRow.total_amount).toLocaleString()}</span>
                  </div>
                </div>
                
                <!-- Action Required -->
                <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                  <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Action Required</h3>
                  <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.6;">
                    <li>Please review the order details in your seller dashboard</li>
                    <li>Prepare the items for shipping</li>
                    <li>Update the order status when shipped</li>
                    <li>Contact the customer if there are any issues</li>
                  </ul>
                </div>
                
                <!-- Action Buttons -->
                <div style="text-align: center;">
                  <a href="http://localhost:3000/sellers/orders.html" style="background: linear-gradient(135deg, #8B5C2A, #a67c52); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; display: inline-block; margin: 10px;">View Orders</a>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="color: #666; margin: 0 0 15px 0; font-size: 14px;">
                  Thank you for being a HomeHaven seller
                </p>
                <div style="color: #999; font-size: 12px;">
                  <p style="margin: 5px 0;">📧 support@homehaven.com</p>
                  <p style="margin: 5px 0;">📞 1-800-HOME-HAVEN</p>
                  <p style="margin: 5px 0;">🌐 www.homehaven.com</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        
        await transporter.sendMail({
          from: 'HomeHaven <homehaven984@gmail.com>',
          to: seller.email,
          subject: 'New Order Received - HomeHaven',
          html: sellerHtmlContent
        });
      }
    } catch (emailErr) {
      console.error('Email error:', emailErr);
    }
    res.json({ success: true, orderinfo_id });
  } catch (err) {
    await conn.rollback();
    console.error('Order placement error:', err);
    res.status(500).json({ success: false, error: 'Failed to place order.' });
  } finally {
    conn.release();
  }
});
// GET /orders/history - get order history for the logged-in customer
router.get('/orders/history', authRequired, async (req, res) => {
  try {
    const user_id = req.user_id;
    
    // Get customer_id for this user
    const [customerRows] = await db.query('SELECT customer_id FROM customer WHERE user_id = ?', [user_id]);
    if (!customerRows.length) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    const customer_id = customerRows[0].customer_id;
    
    // Get all orders for this customer with order details
    const [orders] = await db.query(`
      SELECT 
        o.orderinfo_id,
        o.order_number,
        o.date_placed,
        o.status,
        o.payment_status,
        o.payment_method,
        o.total_amount,
        o.gcash_receipt,
        o.ship_fname,
        o.ship_lname,
        o.ship_address,
        o.ship_town,
        o.ship_zipcode,
        o.ship_phone,
        GROUP_CONCAT(ol.item_name SEPARATOR ', ') as items_summary,
        COUNT(ol.orderline_id) as total_items
      FROM orderinfo o
      LEFT JOIN orderline ol ON o.orderinfo_id = ol.orderinfo_id
      WHERE o.customer_id = ?
      GROUP BY o.orderinfo_id
      ORDER BY o.date_placed DESC
    `, [customer_id]);
    
    // Get detailed items for each order
    for (let order of orders) {
      const [orderItems] = await db.query(`
        SELECT 
          ol.item_name,
          ol.quantity,
          ol.unit_price,
          ol.total_price,
          i.image,
          i.sku
        FROM orderline ol
        LEFT JOIN item i ON ol.item_id = i.item_id
        WHERE ol.orderinfo_id = ?
      `, [order.orderinfo_id]);
      
      // Parse image JSON for each item
      orderItems.forEach(item => {
        try {
          if (item.image) {
            item.image = JSON.parse(item.image);
            item.image = item.image[0]; // Get first image
          }
        } catch (e) {
          item.image = null;
        }
      });
      
      order.items = orderItems;
    }
    
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Error fetching order history:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch order history' });
  }
});

// GET /orders/:orderId - get specific order details
router.get('/orders/:orderId', authRequired, async (req, res) => {
  try {
    const user_id = req.user_id;
    const orderId = req.params.orderId;
    
    // Get customer_id for this user
    const [customerRows] = await db.query('SELECT customer_id FROM customer WHERE user_id = ?', [user_id]);
    if (!customerRows.length) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    const customer_id = customerRows[0].customer_id;
    
    // Get order details
    const [orderRows] = await db.query(`
      SELECT 
        o.*,
        GROUP_CONCAT(ol.item_name SEPARATOR ', ') as items_summary,
        COUNT(ol.orderline_id) as total_items
      FROM orderinfo o
      LEFT JOIN orderline ol ON o.orderinfo_id = ol.orderinfo_id
      WHERE o.orderinfo_id = ? AND o.customer_id = ?
      GROUP BY o.orderinfo_id
    `, [orderId, customer_id]);
    
    if (!orderRows.length) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    const order = orderRows[0];
    
    // Get detailed items for this order
    const [orderItems] = await db.query(`
      SELECT 
        ol.item_name,
        ol.quantity,
        ol.unit_price,
        ol.total_price,
        i.image,
        i.sku,
        i.description
      FROM orderline ol
      LEFT JOIN item i ON ol.item_id = i.item_id
      WHERE ol.orderinfo_id = ?
    `, [orderId]);
    
    // Parse image JSON for each item
    orderItems.forEach(item => {
      try {
        if (item.image) {
          item.image = JSON.parse(item.image);
          item.image = item.image[0]; // Get first image
        }
      } catch (e) {
        item.image = null;
      }
    });
    
    order.items = orderItems;
    
    res.json({ success: true, order });
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch order details' });
  }
});

// POST /cart/clear - clear the user's cart after order placement
router.post('/cart/clear', authRequired, async (req, res) => {
  try {
    await db.query('DELETE FROM shopping_cart WHERE user_id = ?', [req.user_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to clear cart' });
  }
});

module.exports = router;

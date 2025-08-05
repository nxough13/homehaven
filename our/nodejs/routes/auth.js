const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

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

// Email transporter setup (use your real credentials in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your gmail
    pass: process.env.EMAIL_PASS  // your gmail app password
  }
});

// Multer setup for profile image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'profile_' + req.user.id + '_' + Date.now() + ext);
  }
});
const upload = multer({ storage });

// ---Code para sa MP6: JWT Authentication Tokens (15pts)----
// JWT middleware para sa authentication
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided.' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided.' });
  
  // First verify JWT
  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token.' });
    
    // Then check if token exists in users table (additional security)
    try {
      const [tokenResults] = await db.query(
        'SELECT personal_access_token FROM users WHERE id = ? AND personal_access_token = ?',
        [user.id, token]
      );
      
      if (tokenResults.length === 0 || !tokenResults[0].personal_access_token) {
        return res.status(403).json({ success: false, message: 'Token not found in database or expired.' });
      }
      
      req.user = user;
      next();
    } catch (dbError) {
      console.error('Token validation error:', dbError);
      return res.status(500).json({ success: false, message: 'Token validation failed.' });
    }
  });
}

// ---Code para sa MP7: User Registration, Login API via jQuery AJAX (20pts)----
// POST /api/v1/login (update to return JWT)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required' });
  }
  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0) {
      // Log failed login attempt
      await logActivity(null, 'login_failed', 'user', null, `Failed login attempt for email: ${email}`, req);
      return res.json({ success: false, message: 'You are not a registered user, Please Register' });
    }
    const user = results[0];
    // Check if user is active (both status and state must be active)
    const userStatus = user.status || 'active';
    const userState = user.state || 'active';
    
    if (user.role !== 'admin' && (userStatus !== 'active' || userState !== 'active')) {
      // Log failed login attempt due to inactive account
      await logActivity(user.id, 'login_failed', 'user', user.id, 'Login failed - account inactive', req);
      
      if (userStatus !== 'active') {
      return res.json({ success: false, message: 'Please verify your email before logging in.' });
      } else {
        return res.json({ success: false, message: 'Your account has been deactivated by an administrator. Please contact support.' });
      }
    }
    // Compare password with hashed password in database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      // Log successful login
      await logActivity(user.id, 'user_login', 'user', user.id, 'User logged in successfully', req);
      // Create JWT
      const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
      
      // ---MP6: Save token to users table (5pts)---
      try {
        // Update user's personal_access_token column
        await db.query('UPDATE users SET personal_access_token = ? WHERE id = ?', [token, user.id]);
        console.log('Token saved to users table for user ID:', user.id);
      } catch (tokenError) {
        console.error('Error saving token to database:', tokenError);
        // Continue with login even if token save fails
      }
      
      return res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } else {
      // Log failed login attempt due to wrong password
      await logActivity(user.id, 'login_failed', 'user', user.id, 'Login failed - incorrect password', req);
      return res.json({ success: false, message: 'Incorrect password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

// POST /api/v1/register
// ---Code para sa MP7: User Registration, Login API via jQuery AJAX (20pts)----
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: 'All fields are required' });
  }
  // Password validation: at least one number and one special character
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (!hasNumber || !hasSpecial) {
    return res.json({ success: false, message: 'Your password should have at least one number and at least one special character.' });
  }
  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length > 0) {
      return res.json({ success: false, message: 'Email already registered' });
    }
    
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Save user as inactive (not verified)
    const [insertResult] = await db.query(
      'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'user', 'inactive']
    );
    
    // Log user registration
    await logActivity(insertResult.insertId, 'user_registration', 'user', insertResult.insertId, 'New user registered', req);
    
    // Generate verification token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
    const verifyUrl = `${BASE_URL}/api/v1/verify-email?token=${token}`;
    
    // Send verification email with professional HTML design
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - HomeHaven</title>
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
              <div style="font-size: 48px; margin-bottom: 20px;">📧</div>
              <h2 style="color: #0c5460; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
              <p style="color: #0c5460; margin: 0; font-size: 16px; line-height: 1.5;">
                Welcome to HomeHaven! Please verify your email address to complete your account setup.
              </p>
            </div>
            
            <!-- Verification Details -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="color: #8B5C2A; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Account Information</h3>
              <div style="margin-bottom: 10px;">
                <span style="color: #666; font-weight: 500;">Email Address:</span>
                <span style="color: #8B5C2A; font-weight: 600; margin-left: 10px;">${email}</span>
              </div>
              <div style="margin-bottom: 10px;">
                <span style="color: #666; font-weight: 500;">Account Status:</span>
                <span style="color: #e74c3c; font-weight: 600; background-color: #fadbd8; padding: 4px 12px; border-radius: 6px; margin-left: 10px;">Pending Verification</span>
              </div>
            </div>
            
            <!-- Verification Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${verifyUrl}" style="background: linear-gradient(135deg, #8B5C2A, #a67c52); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px; box-shadow: 0 4px 12px rgba(139, 92, 42, 0.3);">
                ✅ Verify Email Address
              </a>
            </div>
            
            <!-- Security Notice -->
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🔒 Security Notice</h3>
              <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>This verification link will expire in 24 hours</li>
                <li>If you didn't create this account, please ignore this email</li>
                <li>For security, never share this verification link with anyone</li>
              </ul>
            </div>
            
            <!-- Manual Link -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="color: #8B5C2A; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Manual Verification</h3>
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 6px; padding: 12px; word-break: break-all;">
                <a href="${verifyUrl}" style="color: #8B5C2A; text-decoration: none; font-size: 12px;">${verifyUrl}</a>
              </div>
            </div>
            
            <!-- Next Steps -->
            <div style="background-color: #e8f5e8; border: 1px solid #d4edda; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="color: #155724; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What's Next?</h3>
              <ul style="color: #155724; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Click the verification button above</li>
                <li>You'll be redirected to our login page</li>
                <li>Sign in with your email and password</li>
                <li>Start exploring our amazing furniture collection!</li>
              </ul>
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
      to: email,
      subject: 'Verify your HomeHaven account',
      html: htmlContent
    });
    return res.json({ success: true, message: 'Registration successful! Please check your email to verify your account.' });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

// GET /api/v1/verify-email
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Invalid verification link.');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;
    // Activate user
    await db.query('UPDATE users SET status = ? WHERE email = ?', ['active', email]);
    // Redirect to the correct login page
    return res.redirect('http://localhost:3000/our/jquery/login.html');
  } catch (err) {
    return res.status(400).send('Verification link is invalid or has expired.');
  }
});

// POST /api/v1/resend-verification
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: 'Email is required.' });
  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0) {
      return res.json({ success: false, message: 'No account found with that email.' });
    }
    const user = results[0];
    if (user.status === 'active') {
      return res.json({ success: false, message: 'Account is already verified.' });
    }
    // Generate verification token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
    const verifyUrl = `${BASE_URL}/api/v1/verify-email?token=${token}`;
    
    // Send verification email with professional HTML design
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - HomeHaven</title>
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
              <div style="font-size: 48px; margin-bottom: 20px;">📧</div>
              <h2 style="color: #0c5460; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
              <p style="color: #0c5460; margin: 0; font-size: 16px; line-height: 1.5;">
                Welcome to HomeHaven! Please verify your email address to complete your account setup.
              </p>
            </div>
            
            <!-- Verification Details -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="color: #8B5C2A; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Account Information</h3>
              <div style="margin-bottom: 10px;">
                <span style="color: #666; font-weight: 500;">Email Address:</span>
                <span style="color: #8B5C2A; font-weight: 600; margin-left: 10px;">${email}</span>
              </div>
              <div style="margin-bottom: 10px;">
                <span style="color: #666; font-weight: 500;">Account Status:</span>
                <span style="color: #e74c3c; font-weight: 600; background-color: #fadbd8; padding: 4px 12px; border-radius: 6px; margin-left: 10px;">Pending Verification</span>
              </div>
            </div>
            
            <!-- Verification Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${verifyUrl}" style="background: linear-gradient(135deg, #8B5C2A, #a67c52); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px; box-shadow: 0 4px 12px rgba(139, 92, 42, 0.3);">
                ✅ Verify Email Address
              </a>
            </div>
            
            <!-- Security Notice -->
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🔒 Security Notice</h3>
              <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>This verification link will expire in 24 hours</li>
                <li>If you didn't create this account, please ignore this email</li>
                <li>For security, never share this verification link with anyone</li>
              </ul>
            </div>
            
            <!-- Manual Link -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="color: #8B5C2A; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Manual Verification</h3>
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 6px; padding: 12px; word-break: break-all;">
                <a href="${verifyUrl}" style="color: #8B5C2A; text-decoration: none; font-size: 12px;">${verifyUrl}</a>
              </div>
            </div>
            
            <!-- Next Steps -->
            <div style="background-color: #e8f5e8; border: 1px solid #d4edda; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="color: #155724; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What's Next?</h3>
              <ul style="color: #155724; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Click the verification button above</li>
                <li>You'll be redirected to our login page</li>
                <li>Sign in with your email and password</li>
                <li>Start exploring our amazing furniture collection!</li>
              </ul>
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
      to: email,
      subject: 'Verify your HomeHaven account',
      html: htmlContent
    });
    return res.json({ success: true, message: 'Verification email sent! Please check your inbox.' });
  } catch (err) {
    console.error('Resend verification error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send verification email.' });
  }
});

// GET /api/v1/profile (protected)
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    console.log('Fetching profile for user ID:', req.user.id);
    const [results] = await db.query(`
      SELECT users.id, users.name, users.email, users.role, users.profile_image,
        COALESCE(customer.fname, '') AS fname,
        COALESCE(customer.lname, '') AS lname,
        COALESCE(customer.addressline, '') AS address,
        COALESCE(customer.town, '') AS town,
        COALESCE(customer.zipcode, '') AS zipcode,
        COALESCE(customer.phone, '') AS phone,
        COALESCE(customer.image_path, users.profile_image, '') AS image_path
      FROM users
      LEFT JOIN customer ON users.id = customer.user_id
      WHERE users.id = ?
    `, [req.user.id]);
    
    console.log('Profile query results:', results);
    
    if (results.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({ success: true, profile: results[0] });
  } catch (err) {
    console.error('Profile fetch error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
});

// POST /api/v1/profile (protected, update info, with image upload)
router.post('/profile', authenticateJWT, upload.single('profile_image'), async (req, res) => {
  const { 
    name, address, phone, password,
    fname, lname, town, zipcode 
  } = req.body;
  
  console.log('Profile update request for user ID:', req.user.id);
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);
  
  let imagePath = null;
  if (req.file) {
    imagePath = '/uploads/' + req.file.filename;
    console.log('Image path set to:', imagePath);
  }
  try {
    // Always update users table if relevant fields are present
    const userFields = [];
    const userValues = [];
    if (name) {
      userFields.push('name = ?');
      userValues.push(name);
    }
    if (password && password.length > 0) {
      // Hash the password before updating
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      userFields.push('password = ?');
      userValues.push(hashedPassword);
    }
    if (imagePath) {
      userFields.push('profile_image = ?');
      userValues.push(imagePath);
    }
    if (userFields.length > 0) {
      userValues.push(req.user.id);
      await db.query(`UPDATE users SET ${userFields.join(', ')} WHERE id = ?`, userValues);
    }

    // Check if customer record exists
    const [customerRows] = await db.query('SELECT * FROM customer WHERE user_id = ?', [req.user.id]);
    if (customerRows.length > 0) {
      // Update existing customer record with partial updates
      const updateFields = [];
      const updateValues = [];
      if (address !== undefined) {
        updateFields.push('addressline = ?');
        updateValues.push(address);
      }
      if (phone !== undefined) {
        updateFields.push('phone = ?');
        updateValues.push(phone);
      }
      if (fname !== undefined) {
        updateFields.push('fname = ?');
        updateValues.push(fname);
      }
      if (lname !== undefined) {
        updateFields.push('lname = ?');
        updateValues.push(lname);
      }
      if (town !== undefined) {
        updateFields.push('town = ?');
        updateValues.push(town);
      }
      if (zipcode !== undefined) {
        updateFields.push('zipcode = ?');
        updateValues.push(zipcode);
      }
      if (imagePath) {
        updateFields.push('image_path = ?');
        updateValues.push(imagePath);
      }
      if (updateFields.length > 0) {
        updateValues.push(req.user.id);
        await db.query(`UPDATE customer SET ${updateFields.join(', ')} WHERE user_id = ?`, updateValues);
      }
    } else if (
      fname !== undefined || lname !== undefined || address !== undefined ||
      town !== undefined || zipcode !== undefined || phone !== undefined || imagePath
    ) {
      // Create new customer record if any customer fields are present
      await db.query(
        'INSERT INTO customer (user_id, fname, lname, addressline, town, zipcode, phone, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          req.user.id, 
          fname || '', 
          lname || name || '', 
          address || '', 
          town || '', 
          zipcode || '', 
          phone || '', 
          imagePath || ''
        ]
      );
    }
    return res.json({ 
      success: true, 
      message: 'Profile updated successfully.', 
      image_path: imagePath 
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

// POST /api/v1/upgrade-to-customer (protected)
router.post('/upgrade-to-customer', authenticateJWT, async (req, res) => {
  try {
    // Update user role
    await db.query('UPDATE users SET role = ? WHERE id = ?', ['customer', req.user.id]);
    // Create customer row if not exists
    const [customerRows] = await db.query('SELECT * FROM customer WHERE user_id = ?', [req.user.id]);
    if (customerRows.length === 0) {
      // Get user's name and split into fname/lname
      const [userRows] = await db.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
      let fname = '', lname = '';
      if (userRows.length > 0) {
        const name = userRows[0].name.trim();
        const parts = name.split(' ');
        if (parts.length > 1) {
          fname = parts.slice(0, -1).join(' ');
          lname = parts.slice(-1).join(' ');
        } else {
          fname = lname = name;
        }
      }
      await db.query(
        'INSERT INTO customer (user_id, fname, lname, addressline, town, zipcode, phone, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, fname, lname, '', '', '', '', '']
      );
    }
    return res.json({ success: true, message: 'Upgraded to customer.', role: 'customer' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to upgrade role.' });
  }
});

// POST /api/v1/upgrade-to-seller (protected)
router.post('/upgrade-to-seller', authenticateJWT, async (req, res) => {
  try {
    // Update user role
    await db.query('UPDATE users SET role = ? WHERE id = ?', ['seller', req.user.id]);
    // Create seller row if not exists
    const [sellerRows] = await db.query('SELECT * FROM sellers WHERE user_id = ?', [req.user.id]);
    if (sellerRows.length === 0) {
      // Get user's name for business name
      const [userRows] = await db.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
      let businessName = '';
      if (userRows.length > 0) {
        businessName = userRows[0].name.trim() + "'s Store";
      }
      await db.query(
        'INSERT INTO sellers (user_id, business_name, business_description, business_address, business_phone, business_email, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, businessName, 'Home goods and furniture', '', '', '', 0]
      );
    }
    return res.json({ success: true, message: 'Upgraded to seller.', role: 'seller' });
  } catch (err) {
    console.error('Seller upgrade error:', err);
    return res.status(500).json({ success: false, message: 'Failed to upgrade role.' });
  }
});

// GET /api/v1/admin/stats (protected, admin only)
router.get('/admin/stats', authenticateJWT, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
  }
  
  try {
    // Get user statistics
    const [userStats] = await db.query('SELECT COUNT(*) as total FROM users WHERE role = "user"');
    const [customerStats] = await db.query('SELECT COUNT(*) as total FROM customer');
    const [sellerStats] = await db.query('SELECT COUNT(*) as total FROM users WHERE role = "seller"');
    const [orderStats] = await db.query('SELECT COUNT(*) as total FROM orderinfo');
    
    // Get recent activity (last 10 orders)
    const [recentOrders] = await db.query(`
      SELECT o.order_number, o.date_placed, o.status, c.fname, c.lname
      FROM orderinfo o
      JOIN customer c ON o.customer_id = c.customer_id
      ORDER BY o.date_placed DESC
      LIMIT 10
    `);
    
    // Get recent user registrations
    const [recentUsers] = await db.query(`
      SELECT name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    return res.json({
      success: true,
      stats: {
        totalUsers: userStats[0].total,
        totalCustomers: customerStats[0].total,
        totalSellers: sellerStats[0].total,
        totalOrders: orderStats[0].total
      },
      recentActivity: {
        orders: recentOrders,
        users: recentUsers
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin statistics.' });
  }
});

// POST /api/v1/logout (protected)
router.post('/logout', authenticateJWT, async (req, res) => {
  try {
    // Remove token from users table
    await db.query('UPDATE users SET personal_access_token = NULL WHERE id = ?', [req.user.id]);
    
    // Log logout activity
    await logActivity(req.user.id, 'user_logout', 'user', req.user.id, 'User logged out successfully', req);
    
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ success: false, message: 'Failed to logout' });
  }
});

module.exports = router;
module.exports.authenticateJWT = authenticateJWT; 
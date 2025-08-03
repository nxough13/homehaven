const db = require('./db');

async function populateActivities() {
  try {
    console.log('Populating sample activities...');
    
    // Sample activities for different users
    const activities = [
      // User 1 (Admin) activities
      {
        user_id: 1,
        action: 'user_login',
        model_type: 'user',
        model_id: 1,
        description: 'Admin logged in successfully',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        user_id: 1,
        action: 'user_registration',
        model_type: 'user',
        model_id: 1,
        description: 'Admin account created',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      
      // User 2 (Customer) activities
      {
        user_id: 2,
        action: 'user_login',
        model_type: 'user',
        model_id: 2,
        description: 'Customer logged in successfully',
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      {
        user_id: 2,
        action: 'order_placed',
        model_type: 'orderinfo',
        model_id: 4,
        description: 'Order placed: ORD-1752827251559 with 1 items, total: ₱8999.00',
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      {
        user_id: 2,
        action: 'review_submitted',
        model_type: 'reviews',
        model_id: 30,
        description: 'Review submitted for product ID 30 with rating 5',
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      
      // User 3 (Seller) activities
      {
        user_id: 3,
        action: 'user_login',
        model_type: 'user',
        model_id: 3,
        description: 'Seller logged in successfully',
        ip_address: '192.168.1.102',
        user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      },
      {
        user_id: 3,
        action: 'product_created',
        model_type: 'item',
        model_id: 21,
        description: 'Product "3item" added with SKU: SKUU',
        ip_address: '192.168.1.102',
        user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      },
      {
        user_id: 3,
        action: 'product_updated',
        model_type: 'item',
        model_id: 30,
        description: 'Product "prod12" updated with SKU: something',
        ip_address: '192.168.1.102',
        user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      },
      
      // User 5 (Customer) activities
      {
        user_id: 5,
        action: 'user_registration',
        model_type: 'user',
        model_id: 5,
        description: 'New user registered',
        ip_address: '192.168.1.103',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
      },
      {
        user_id: 5,
        action: 'user_login',
        model_type: 'user',
        model_id: 5,
        description: 'Customer logged in successfully',
        ip_address: '192.168.1.103',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
      },
      {
        user_id: 5,
        action: 'order_placed',
        model_type: 'orderinfo',
        model_id: 8,
        description: 'Order placed: ORD-1753156685350 with 1 items, total: ₱99.00',
        ip_address: '192.168.1.103',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
      }
    ];
    
    // Insert activities
    for (const activity of activities) {
      await db.query(
        'INSERT INTO activity_logs (user_id, action, model_type, model_id, description, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [activity.user_id, activity.action, activity.model_type, activity.model_id, activity.description, activity.ip_address, activity.user_agent]
      );
    }
    
    console.log('Sample activities populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error populating activities:', error);
    process.exit(1);
  }
}

populateActivities(); 
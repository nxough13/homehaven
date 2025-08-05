const db = require('./db');

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    
    // Test basic connection
    const [result] = await db.query('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    // Test personal_access_tokens table
    const [tables] = await db.query("SHOW TABLES LIKE 'personal_access_tokens'");
    if (tables.length > 0) {
      console.log('✅ personal_access_tokens table exists');
      
      // Check table structure
      const [columns] = await db.query("DESCRIBE personal_access_tokens");
      console.log('✅ Table structure:');
      columns.forEach(col => {
        console.log(`   - ${col.Field} (${col.Type})`);
      });
    } else {
      console.log('❌ personal_access_tokens table not found');
    }
    
    console.log('\n🎉 Database test complete!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testConnection(); 
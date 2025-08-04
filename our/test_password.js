const bcrypt = require('bcrypt');

async function testPassword() {
  const saltRounds = 10;
  
  // Test different password variations
  const passwords = [
    'password&123',
    'password123!',
    'passwOrd&123',
    'Password&123',
    'password&123!'
  ];
  
  console.log('Testing password hashes...\n');
  
  for (const password of passwords) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log(`Password: "${password}"`);
      console.log(`Hash: ${hashedPassword}`);
      console.log('---');
    } catch (error) {
      console.error(`Error hashing "${password}":`, error);
    }
  }
  
  // Test the specific hash we used
  console.log('\nTesting our specific hash...');
  const testPassword = 'password&123';
  const ourHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
  
  const isMatch = await bcrypt.compare(testPassword, ourHash);
  console.log(`Password "${testPassword}" matches our hash: ${isMatch}`);
  
  // Generate a fresh hash for password&123
  const freshHash = await bcrypt.hash('password&123', saltRounds);
  console.log(`\nFresh hash for "password&123": ${freshHash}`);
}

testPassword(); 
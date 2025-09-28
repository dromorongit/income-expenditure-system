// Simple test script to verify API connectivity
const http = require('http');

const API_BASE_URL = 'http://localhost:5000/api/v1';

async function testConnection() {
  console.log('Testing connection to backend API...');
  
  // Test basic API endpoint
  const url = `${API_BASE_URL}/`;
  
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req = http.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('✅ Connection successful!');
        console.log('API Response:', JSON.parse(data));
      } else {
        console.log('❌ Connection failed with status:', res.statusCode);
        console.log('Error:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log('❌ Connection failed with error:', error.message);
  });
  
  req.end();
}

// Run the test
testConnection();
// client.js

const http = require('http');

// Data to send in the POST request
const postData = JSON.stringify({
  email: 'test@example.com',
  password: 'TestPassword123'
});

const options = {
  hostname: 'localhost',
  port: 5173, // Replace with your server's port if different
  path: '/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  }
};

const req = http.request(options, (res) => {
  let data = '';

  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

  res.setEncoding('utf8');
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();

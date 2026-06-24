const https = require('https');

const registerData = JSON.stringify({
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'password123'
});

const reqRegister = https.request({
  hostname: 'devboost-ai.onrender.com',
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(registerData)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const authData = JSON.parse(data);
    if (!authData.token) {
      console.error('Registration failed:', authData);
      return;
    }
    console.log('Registered successfully, testing API with token...');
    
    const postData = JSON.stringify({
      description: 'A rental car service with users, cars, bookings, payments, and reviews',
      dbType: 'PostgreSQL'
    });

    const reqApi = https.request({
      hostname: 'devboost-ai.onrender.com',
      path: '/api/generate-database',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.token}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (resApi) => {
      console.log('=== Auth API Status ===', resApi.statusCode);
      let apiData = '';
      resApi.on('data', chunk => apiData += chunk);
      resApi.on('end', () => {
        console.log('API Response:', apiData.substring(0, 300));
      });
    });
    reqApi.write(postData);
    reqApi.end();
  });
});
reqRegister.write(registerData);
reqRegister.end();

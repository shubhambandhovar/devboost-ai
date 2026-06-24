const https = require('https');

const postData = JSON.stringify({
  description: 'A rental car service with users, cars, bookings, payments, and reviews',
  dbType: 'PostgreSQL'
});

const options = {
  hostname: 'devboost-ai.onrender.com',
  path: '/api/generate-database',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Sending request to Render backend using HTTPS module...');

const req = https.request(options, (res) => {
  console.log('=== Status ===', res.statusCode);
  
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  
  res.on('end', () => {
    try {
      const data = JSON.parse(rawData);
      console.log('=== Response text (first 200 chars) ===');
      console.log(data.result ? data.result.substring(0, 200) + '...' : 'NO RESULT');
      
      console.log('\n=== Check for Mermaid ===');
      const hasMermaid = data.result && data.result.includes('```mermaid');
      console.log('Has Mermaid block:', hasMermaid);
      if (!hasMermaid) {
        console.log('Full response output:\n', data.result);
      }
    } catch (e) {
      console.error('Parsing response failed:', e);
      console.log('Raw output:', rawData);
    }
  });
});

req.on('error', (e) => {
  console.error('Request failed:', e);
});

req.write(postData);
req.end();

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/holidays',
  method: 'GET',
  headers: {}
};

const req = http.request(options, res => {
  console.log('STATUS:', res.statusCode);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error('ERROR:', error);
});

req.end();

const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
code = code.replace(/<script src="app\.js[^>]*><\/script>/, \`<script src="app.js?v=\${Date.now()}"></script>\`);
code = code.replace(/<link rel="stylesheet" href="styles\.css[^>]*>/, \`<link rel="stylesheet" href="styles.css?v=\${Date.now()}">\`);
fs.writeFileSync('index.html', code);
console.log('Cache busted index.html');

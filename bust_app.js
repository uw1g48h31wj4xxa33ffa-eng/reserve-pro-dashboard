const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'index.html');
let content = fs.readFileSync(p, 'utf8');
content = content.replace(/src="app\.js(\?v=\d+)?"/, 'src="app.js?v=' + Date.now() + '"');
fs.writeFileSync(p, content);
console.log('Fixed index.html app.js cache bust');

const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'index.html');
let content = fs.readFileSync(p, 'utf8');
content = content.replace(/href="styles\.css(\?v=\d+)?"/, 'href="styles.css?v=' + Date.now() + '"');
fs.writeFileSync(p, content);
console.log('Fixed index.html styles.css cache bust');

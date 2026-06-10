const fs=require('fs');
let app = fs.readFileSync('app.js', 'utf8');
app = app.replace(/\\'/g, "'");
fs.writeFileSync('app.js', app);
console.log('Fixed quotes in app.js');

const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // Add query parameter for cache busting
    content = content.replace(/fetch\('http:\/\/localhost:3001\/api\/holidays',\s*\{\s*cache:\s*'no-store'\s*\}\)/g, "fetch('http://localhost:3001/api/holidays?t=' + new Date().getTime(), { cache: 'no-store' })");

    fs.writeFileSync(p, content);
    console.log('Patched fetch cache-busting for ' + form);
});

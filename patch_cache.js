const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // fetch('http://localhost:3001/api/holidays') を { cache: 'no-store' } つきに置換
    const regex = /fetch\('http:\/\/localhost:3001\/api\/holidays'\)/g;
    const replacement = `fetch('http://localhost:3001/api/holidays', { cache: 'no-store' })`;

    content = content.replace(regex, replacement);

    fs.writeFileSync(p, content);
    console.log('Patched cache-control for ' + form);
});

const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // Change position:fixed to position:absolute
    content = content.replace(/position:fixed;/g, 'position:absolute;');

    fs.writeFileSync(p, content);
    console.log('Fixed position to absolute for ' + form);
});

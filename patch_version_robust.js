const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];
const versionString = 'v1.1 (Auto-Sync)';

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // Robust replace right before </body>
    const target = '</body>';
    if (content.includes(target)) {
        content = content.replace(target, `<div style="text-align:center; font-size:0.7rem; color:#cbd5e1; margin-top:20px; padding-bottom:20px;">System Version: ${versionString}</div>\n</body>`);
    }

    fs.writeFileSync(p, content);
    console.log('Patched version indicator robustly for ' + form);
});

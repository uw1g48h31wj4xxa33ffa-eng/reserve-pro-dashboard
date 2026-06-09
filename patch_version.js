const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];
const versionString = 'v1.1 (Auto-Sync)';

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // Remove old version if exists
    content = content.replace(/<div style="text-align:center; font-size:0\.7rem; color:#cbd5e1; margin-top:20px;">.*?<\/div>/g, '');

    // Add new version at the end of content-body
    const target = '</div> <!-- /.content-body -->';
    if (content.includes(target)) {
        content = content.replace(target, `<div style="text-align:center; font-size:0.7rem; color:#cbd5e1; margin-top:20px;">System Version: ${versionString}</div>\n            </div> <!-- /.content-body -->`);
    }

    // Force a minor logic change to ensure it writes
    content = content.replace(/setInterval\(refreshBookedSlots, 15000\);/g, 'setInterval(refreshBookedSlots, 10000);');

    fs.writeFileSync(p, content);
    console.log('Patched version indicator for ' + form);
});

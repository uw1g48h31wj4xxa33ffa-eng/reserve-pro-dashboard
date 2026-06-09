const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // Add display: none to the sync-status-display div
    const target1 = /<div id="sync-status-display" style="text-align:center; font-size:0\.75rem; color:#a0aec0; margin-top:10px;">System Version: v1\.1 \(Auto-Sync\) - 待機中\.\.\.<\/div>/g;
    const replacement1 = `<div id="sync-status-display" style="display:none; text-align:center; font-size:0.75rem; color:#a0aec0; margin-top:10px;">System Version: v1.1 (Auto-Sync) - 待機中...</div>`;
    
    // Also try matching if it already has display:none just in case
    if (content.match(target1)) {
        content = content.replace(target1, replacement1);
        fs.writeFileSync(p, content);
        console.log('Hidden sync text in ' + form);
    } else {
        console.log('Regex missed in ' + form);
    }
});

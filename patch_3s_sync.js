const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // Remove the old recursive setTimeout
    content = content.replace(/\/\/ 確実に10秒後に再帰呼び出し\n\s*setTimeout\(refreshBookedSlots, 10000\);/g, "");

    // Add a fast 3-second setInterval at the bottom of the script
    if (!content.includes('setInterval(refreshBookedSlots, 3000)')) {
        content = content.replace(/<\/script>\s*<\/body>/, "setInterval(refreshBookedSlots, 3000);\n    </script>\n</body>");
        fs.writeFileSync(p, content);
        console.log('Added 3s setInterval to ' + form);
    }
});

const fs = require('fs');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(f => {
    const p = 'forms_v3/' + f + '/index.html';
    if (!fs.existsSync(p)) return;
    let txt = fs.readFileSync(p, 'utf8');

    // Add error handler to top of script
    if (!txt.includes('window.onerror = function')) {
        txt = txt.replace(/<script>/, '<script>\n        window.onerror = function(msg, url, lineNo, columnNo, error) { alert("Error: " + msg + "\\nLine: " + lineNo); return false; };');
    }

    fs.writeFileSync(p, txt);
    console.log(f + ' wrapped');
});

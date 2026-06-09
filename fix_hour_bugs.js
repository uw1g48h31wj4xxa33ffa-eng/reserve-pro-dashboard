const fs = require('fs');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(f => {
    const p = 'forms_v3/' + f + '/index.html';
    if (!fs.existsSync(p)) return;
    let txt = fs.readFileSync(p, 'utf8');

    // Fix parseInt bug for active class
    txt = txt.replace(/if \(parseInt\(btn\.getAttribute\('data-value'\)\) === h\) btn\.classList\.add\('active'\);/g, "if (parseInt(btn.getAttribute('data-value')) === parseInt(h)) btn.classList.add('active');");

    // Fix parseInt bug for 20:00 minutes
    txt = txt.replace(/if \(h === 20\) mins = \[0\];/g, "if (parseInt(h) === 20) mins = [0];");

    fs.writeFileSync(p, txt);
    console.log(f + ' updated');
});

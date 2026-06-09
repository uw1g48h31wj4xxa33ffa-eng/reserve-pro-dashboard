const fs = require('fs');
const path = require('path');
const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    const content = fs.readFileSync(p, 'utf8');
    const hasSelectPeriod = content.includes('function selectPeriodButton(');
    const hasRenderSlots = content.includes('function renderSlots()');
    console.log(`${form} - selectPeriodButton: ${hasSelectPeriod}, renderSlots: ${hasRenderSlots}`);
});

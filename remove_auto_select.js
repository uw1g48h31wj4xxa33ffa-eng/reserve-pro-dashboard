const fs = require('fs');

const files = [
    'forms_demo/change/index.html',
    'forms_demo/counseling/index.html',
    'forms_demo/new-reservation/index.html',
    'forms_demo/referral-reservation/index.html'
];

const regex = /\s*\/\/\s*Auto-select the first available detailed time slot if none is selected in this hour[\s\S]*?selectTimeSlotButton\(val\);\s*\}\s*\}/;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (regex.test(content)) {
        content = content.replace(regex, '');
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Not found in ${file}`);
    }
});

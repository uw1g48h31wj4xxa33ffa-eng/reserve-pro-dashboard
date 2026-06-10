const fs = require('fs');

function checkInline(file) {
    const html = fs.readFileSync(file, 'utf8');
    const lines = html.split('\n');
    console.log('--- ' + file + ' ---');
    lines.forEach((l, i) => {
        if(l.includes('style=') && l.includes('font-size')) {
            console.log((i+1) + ': ' + l.trim());
        }
    });
}

checkInline('forms_demo/change/index.html');
checkInline('forms_demo/new-reservation/index.html');

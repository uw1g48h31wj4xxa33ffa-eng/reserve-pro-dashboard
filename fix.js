const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

// Fix 1: app.js
const appJsPath = path.join(__dirname, 'app.js');
if (fs.existsSync(appJsPath)) {
    let appJsContent = fs.readFileSync(appJsPath, 'utf8');
    appJsContent = appJsContent.replace('http://localhost:3000/api/holidays', 'http://localhost:3001/api/holidays');
    fs.writeFileSync(appJsPath, appJsContent);
    console.log('Fixed app.js port');
}

// Fix 2: forms missing let holidaysList = [];
forms.forEach(form => {
    const filePath = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Check if let holidaysList is already there
        if (!content.includes('let holidaysList = [];')) {
            content = content.replace('let blockedSlotsList = [];', 'let holidaysList = [];\n        let blockedSlotsList = [];');
            fs.writeFileSync(filePath, content);
            console.log(`Fixed holidaysList in ${form}`);
        }
    }
});

// Fix 3: 起動.bat mojibake by removing Japanese echos from bat (node server.js already logs Japanese nicely)
const batPath = path.join(__dirname, '起動.bat');
if (fs.existsSync(batPath)) {
    const batContent = `@echo off
chcp 65001 > nul
cd /d "%~dp0"
node server.js
pause
`;
    fs.writeFileSync(batPath, batContent);
    console.log('Fixed 起動.bat');
}

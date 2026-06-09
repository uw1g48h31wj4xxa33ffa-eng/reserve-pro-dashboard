const fs = require('fs');
const path = require('path');

// 1. Dashboard app.js
const appJsPath = path.join(__dirname, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/for \(let h = 10; h < 20; h\+\+\) {/g, 'for (let h = 10; h <= 20; h++) {');
appJs = appJs.replace(/for \(let m = 0; m < 60; m \+= 15\) {/g, 'for (let m = 0; m < 60; m += 15) {\n            if (h === 20 && m > 0) continue;');
fs.writeFileSync(appJsPath, appJs);
console.log('Patched app.js');

// 2. Dashboard index.html (cache bust)
const indexHtmlPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace('<script src="app.js"></script>', '<script src="app.js?v=' + Date.now() + '"></script>');
fs.writeFileSync(indexHtmlPath, indexHtml);
console.log('Patched index.html');

// 3. Forms
const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];
forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    let content = fs.readFileSync(p, 'utf8');

    // change hour loop
    content = content.replace(/for \(let h = 10; h < 20; h\+\+\) {/g, 'for (let h = 10; h <= 20; h++) {');

    // change minutes loop
    const minLoopOld = `[0, 15, 30, 45].forEach(m => {`;
    const minLoopNew = `let mins = [0, 15, 30, 45];\n            if (h === 20) mins = [0];\n            mins.forEach(m => {`;
    content = content.replace(minLoopOld, minLoopNew);

    // change order array
    const orderOld = `"19:00", "19:15", "19:30", "19:45"`;
    const orderNew = `"19:00", "19:15", "19:30", "19:45",\n                    "20:00"`;
    content = content.replace(orderOld, orderNew);

    fs.writeFileSync(p, content);
    console.log(`Patched ${form}`);
});

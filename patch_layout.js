const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('<div class="calendar-layout" style="display: flex; flex-direction: column; height: 100%;">', '<div class="calendar-layout" style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 24px; align-items: start; height: 100%;">');
html = html.replace('<div class="calendar-card" style="max-width: 700px; margin: 0 auto; width: 100%;">', '<div class="calendar-card" style="width: 100%;">');
html = html.replace('<div class="holiday-panel" style="display: flex; flex-direction: row; gap: 16px;">', '<div class="holiday-panel" style="display: flex; flex-direction: column; gap: 16px;">');
html = html.replace('<div class="h-panel-card" style="flex: 1; display: flex; flex-direction: row; gap: 24px;">', '<div class="h-panel-card" style="flex: 1; display: flex; flex-direction: column; gap: 16px;">');
html = html.replace(/<div style="flex: 2; border-left: 1px solid var\(--border-light\); padding-left: 24px;">/g, '<div style="border-top: 1px solid var(--border-light); padding-top: 16px;">');
html = html.replace(/v=20260611/g, 'v=20260612');

fs.writeFileSync('index.html', html);
fs.copyFileSync('index.html', 'index-MRのノートブックコンピュータ.html');

console.log('Fixed to side by side layout');

const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Sidebar list addition
const listHtml = `
      <div class="nav-section" style="margin-top: 32px; flex: 1; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span class="section-label" style="margin-bottom: 0;">登録済み一覧</span>
          <span class="tag tag-blue" id="h-count-badge" style="font-size: 0.7rem;">0 件</span>
        </div>
        <div class="h-list-items" id="h-list-items" style="flex: 1; overflow-y: auto;">
          <!-- JSで描画 -->
        </div>
      </div>
    </aside>`;

if (!html.includes('id="h-count-badge" style="font-size: 0.7rem;"')) {
    html = html.replace('    </aside>', listHtml);
}

// 2. Remove old list
const oldListRegex = /<div class="h-panel-card" style="flex: 1; display: flex; flex-direction: column;">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
html = html.replace(oldListRegex, '</div></div>');

// 3. Update calendar-layout and calendar-card
html = html.replace('<div class="calendar-layout">', '<div class="calendar-layout" style="display: flex; flex-direction: column; height: 100%;">');
html = html.replace('<div class="calendar-layout" style="display: grid; grid-template-columns: 1fr 340px; gap: 32px; align-items: start; height: 100%;">', '<div class="calendar-layout" style="display: flex; flex-direction: column; height: 100%;">');
html = html.replace('<div class="calendar-layout" style="display: grid; grid-template-columns: 1fr 340px; gap: 16px; align-items: start; height: 100%;">', '<div class="calendar-layout" style="display: flex; flex-direction: column; height: 100%;">');

html = html.replace('<div class="calendar-card">', '<div class="calendar-card" style="max-width: 650px; margin: 0 auto; width: 100%;">');

// 4. Update holiday-panel layout
html = html.replace('<div class="holiday-panel">', '<div class="holiday-panel" style="display: flex; flex-direction: row; gap: 16px;">');
html = html.replace('<div class="h-panel-card">', '<div class="h-panel-card" style="flex: 1; display: flex; flex-direction: row; gap: 24px;">\n                <div style="flex: 1; min-width: 250px;">');

// 5. Update right half border
html = html.replace(/<div style="border-top: 1px solid var\(--border-light\); padding-top: 6px;">/g, '</div><div style="flex: 2; border-left: 1px solid var(--border-light); padding-left: 24px;">');

fs.writeFileSync('index.html', html);
console.log('Reorganized html structure');

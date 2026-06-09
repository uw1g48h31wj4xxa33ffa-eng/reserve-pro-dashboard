const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const targetFunction = /function renderTimeSlotsBlocker\(dateKey\) \{[\s\S]*?\n\}/;

const newFunctions = `
function initRangeSelectors() {
    const startSelect = document.getElementById('range-start');
    const endSelect = document.getElementById('range-end');
    if (!startSelect || !endSelect) return;
    
    startSelect.innerHTML = '';
    endSelect.innerHTML = '';
    
    for (let h = 10; h <= 20; h++) {
        for (let m = 0; m < 60; m += 15) {
            if (h === 20 && m > 0) continue;
            const timeStr = \`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`;
            startSelect.add(new Option(timeStr, timeStr));
            endSelect.add(new Option(timeStr, timeStr));
        }
    }
}

function renderTimeSlotsBlocker(dateKey) {
    const container = document.getElementById("time-matrix-container");
    if (!container) return;
    container.innerHTML = "";

    const isHoliday = !!state.holidays[dateKey];
    
    let html = '<table class="time-matrix">';
    html += '<tr><th></th><th>00</th><th>15</th><th>30</th><th>45</th></tr>';

    for (let h = 10; h <= 20; h++) {
        if(h === 20) {
            html += \`<tr><th>20時</th>\`;
            const timeStr = '20:00';
            const slotKey = \`\${dateKey}_\${timeStr}\`;
            const isBlocked = state.blockedSlots.includes(slotKey);
            let cls = isHoliday ? "holiday-mode" : (isBlocked ? "blocked" : "");
            html += \`<td class="\${cls}" onclick="toggleBlockedSlot('\${slotKey}')"></td><td colspan="3"></td></tr>\`;
            break;
        }

        html += \`<tr><th>\${h}時</th>\`;
        for (let m = 0; m < 60; m += 15) {
            const timeStr = \`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`;
            const slotKey = \`\${dateKey}_\${timeStr}\`;
            const isBlocked = state.blockedSlots.includes(slotKey);
            
            let cls = isHoliday ? "holiday-mode" : (isBlocked ? "blocked" : "");
            
            html += \`<td class="\${cls}" onclick="toggleBlockedSlot('\${slotKey}')"></td>\`;
        }
        html += '</tr>';
    }
    html += '</table>';
    container.innerHTML = html;
}

window.blockSelectedRange = function() {
    if (!state.selectedCalDate || state.holidays[state.selectedCalDate]) return;
    const start = document.getElementById('range-start').value;
    const end = document.getElementById('range-end').value;
    
    if (start >= end) {
        alert("開始時刻は終了時刻より前に設定してください。");
        return;
    }

    const slots = [];
    for (let h = 10; h <= 20; h++) {
        for (let m = 0; m < 60; m += 15) {
            if (h === 20 && m > 0) continue;
            const timeStr = \`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`;
            if (timeStr >= start && timeStr < end) {
                slots.push(\`\${state.selectedCalDate}_\${timeStr}\`);
            }
        }
    }
    bulkToggleBlocks(slots, 'add');
};
`;

code = code.replace(targetFunction, newFunctions);

// Add initRangeSelectors to loadData if not there
if(!code.includes('initRangeSelectors()')) {
    code = code.replace('function loadData() {', 'function loadData() {\n    initRangeSelectors();');
}

fs.writeFileSync('app.js', code);
console.log('Replaced app.js successfully');

const fs = require('fs');

let code = fs.readFileSync('app.js', 'utf8');

if (!code.includes('function bulkToggleBlocks')) {
    const target = '} catch (e) {\n        console.error("Blocked slot sync error:", e);\n        showToast("同期エラー", "var(--rose)");\n        loadData(); // ロールバック\n    }\n}';
    
    const newCode = target + `

async function bulkToggleBlocks(slotsToToggle, action) {
    if (!slotsToToggle.length) return;
    
    // 楽観的UI更新
    const originalSlots = [...state.blockedSlots];
    if (action === 'add') {
        const newSlots = new Set([...state.blockedSlots, ...slotsToToggle]);
        state.blockedSlots = Array.from(newSlots);
    } else {
        state.blockedSlots = state.blockedSlots.filter(s => !slotsToToggle.includes(s));
    }
    renderTimeSlotsBlocker(state.selectedCalDate);

    // API同期
    try {
        const promises = slotsToToggle.map(slotKey => {
            return fetch(\`\${CONFIG.GAS_URL.replace('/api/holidays', '/api/blocked-slots')}\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slotKey, action })
            });
        });
        await Promise.all(promises);
    } catch (e) {
        console.error("Bulk toggle sync error:", e);
        state.blockedSlots = originalSlots;
        renderTimeSlotsBlocker(state.selectedCalDate);
        showToast("同期エラー", "var(--rose)");
    }
}

window.blockMorning = function() {
    if (!state.selectedCalDate || state.holidays[state.selectedCalDate]) return;
    const slots = [];
    for (let h = 10; h < 13; h++) {
        for (let m = 0; m < 60; m += 15) {
            slots.push(\`\${state.selectedCalDate}_\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`);
        }
    }
    bulkToggleBlocks(slots, 'add');
};

window.blockAfternoon = function() {
    if (!state.selectedCalDate || state.holidays[state.selectedCalDate]) return;
    const slots = [];
    for (let h = 13; h <= 20; h++) {
        for (let m = 0; m < 60; m += 15) {
            if (h === 20 && m > 0) continue;
            slots.push(\`\${state.selectedCalDate}_\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`);
        }
    }
    bulkToggleBlocks(slots, 'add');
};

window.clearAllBlocks = function() {
    if (!state.selectedCalDate || state.holidays[state.selectedCalDate]) return;
    const slots = [];
    for (let h = 10; h <= 20; h++) {
        for (let m = 0; m < 60; m += 15) {
            if (h === 20 && m > 0) continue;
            slots.push(\`\${state.selectedCalDate}_\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`);
        }
    }
    bulkToggleBlocks(slots, 'delete');
};
`;
    
    code = code.replace(target, newCode);
    fs.writeFileSync('app.js', code);
    console.log("Added bulk toggle functions to app.js");
} else {
    console.log("Already added");
}

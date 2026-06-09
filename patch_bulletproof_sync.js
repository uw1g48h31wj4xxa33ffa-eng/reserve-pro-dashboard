const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // First, let's remove the old setInterval to prevent double firing
    content = content.replace(/\/\/ 15秒ごとに最新データを自動取得\n\s*setInterval\(refreshBookedSlots, 10000\);/g, "");

    // Now, let's define a clean new refresh function with recursive setTimeout and a counter
    const newFunc = `
        let syncCount = 0;
        async function refreshBookedSlots() {
            try {
                const res = await fetch('http://localhost:3001/api/holidays?t=' + new Date().getTime(), { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.holidays) {
                        holidaysList = Object.keys(data.holidays);
                    }
                    if (data.blockedSlots) {
                        blockedSlotsList = data.blockedSlots;
                    }
                }
                syncCount++;
                const stat = document.getElementById('sync-status-display');
                if (stat) stat.innerText = \`System Version: v1.1 (Auto-Sync) - 最終同期: \${new Date().toLocaleTimeString()} (更新回数: \${syncCount}回, ブロック: \${blockedSlotsList.length}件)\`;
            } catch (e) {
                console.error("ローカルサーバーとの通信エラー:", e);
                const stat = document.getElementById('sync-status-display');
                if (stat) stat.innerText = \`System Version: v1.1 (Auto-Sync) - 通信エラー: \${e.message}\`;
            }
            
            try {
                renderCalendar();
                
                // 状態を保持しながら時間枠を再描画
                if (selectedDate && document.getElementById('timeSlots') && document.getElementById('timeSlots').style.display === 'block') {
                    const savedPeriod = currentSelectedPeriod;
                    const savedHour = currentSelectedHour;
                    const savedSlots = [...currentSelectedSlots];

                    renderSlots();

                    currentSelectedPeriod = savedPeriod;
                    currentSelectedSlots = savedSlots.filter(slot => {
                        if (slot === "午前" || slot === "午後" || slot === "終日") return true;
                        return !isBooked(selectedDate, slot);
                    });
                    currentSelectedHour = savedHour;
                    updatePeriodActiveState();

                    if (savedPeriod === 'detailed') {
                        document.getElementById('detailed-time-group').style.display = "block";
                        document.getElementById('period-confirm-area').style.display = "block";
                        
                        if (savedHour) {
                            const stillExists = Array.from(document.getElementById('hour-buttons-container').querySelectorAll('.slot-btn'))
                                .some(btn => parseInt(btn.getAttribute('data-value')) === parseInt(savedHour));
                            if (stillExists) {
                                selectHourButton(savedHour);
                            } else {
                                currentSelectedHour = "";
                                document.getElementById('minute-group').style.display = "none";
                            }
                        }
                    } else if (savedPeriod !== "") {
                        document.getElementById('detailed-time-group').style.display = "none";
                        document.getElementById('period-confirm-area').style.display = "block";
                    }

                    updatePeriodActiveState();
                    if (typeof updateTimeSlotActiveState === 'function') updateTimeSlotActiveState();
                    if (typeof updateConfirmButtonState === 'function') updateConfirmButtonState();
                }
            } catch (renderError) {
                console.error("描画エラー:", renderError);
            }
            
            // 確実に10秒後に再帰呼び出し
            setTimeout(refreshBookedSlots, 10000);
        }
    `;

    // Replace the old function. Since we might have modified it with various patches, let's use a regex that matches from `async function refreshBookedSlots()` down to the closing brace before `function goToStep`.
    const oldFuncRegex = /async function refreshBookedSlots\(\) \{[\s\S]*?(?=function goToStep)/g;
    
    if (content.match(oldFuncRegex)) {
        content = content.replace(oldFuncRegex, newFunc);
        fs.writeFileSync(p, content);
        console.log('Replaced refreshBookedSlots in ' + form);
    } else {
        console.log('Could not find old function in ' + form);
    }
});

const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    const regexRefresh = /async function refreshBookedSlots\(\) \{[\s\S]*?renderSlots\(\);\s*\}\s*\}/g;

    const replacementRefresh = `async function refreshBookedSlots() {
            try {
                const res = await fetch('http://localhost:3001/api/holidays');
                if (res.ok) {
                    const data = await res.json();
                    if (data.holidays) {
                        holidaysList = Object.keys(data.holidays);
                    }
                    if (data.blockedSlots) {
                        blockedSlotsList = data.blockedSlots;
                    }
                }
            } catch (e) {
                console.error("ローカルサーバーとの通信エラー:", e);
            }
            renderCalendar();
            
            // 状態を保持しながら時間枠を再描画
            if (selectedDate && document.getElementById('timeSlots') && document.getElementById('timeSlots').style.display === 'block') {
                const savedPeriod = currentSelectedPeriod;
                const savedHour = currentSelectedHour;
                const savedSlots = [...currentSelectedSlots];

                renderSlots();

                currentSelectedPeriod = savedPeriod;
                currentSelectedSlots = savedSlots;
                currentSelectedHour = savedHour;

                if (savedPeriod === 'detailed') {
                    document.getElementById('detailed-time-group').style.display = "block";
                    document.getElementById('period-confirm-area').style.display = "block";
                    if (savedHour) selectHourButton(savedHour);
                } else if (savedPeriod !== "") {
                    document.getElementById('detailed-time-group').style.display = "none";
                    document.getElementById('period-confirm-area').style.display = "block";
                }

                updatePeriodActiveState();
                if (typeof updateTimeSlotActiveState === 'function') updateTimeSlotActiveState();
                if (typeof updateConfirmButtonState === 'function') updateConfirmButtonState();
            }
        }`;

    content = content.replace(regexRefresh, replacementRefresh);

    fs.writeFileSync(p, content);
    console.log('Patched state preservation ' + form);
});

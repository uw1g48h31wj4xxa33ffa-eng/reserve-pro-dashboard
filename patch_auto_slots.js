const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // 1. renderCalendar 予約不可枠のフルブロック判定
    const calRegex = /const isHoliday = holidaysList\.includes\(dateKey\);\s*if \(d < minDate \|\| d > oneMonthLater \|\| d\.getDay\(\) === 0 \|\| isHoliday\) \{/g;
    
    const calReplacement = `const isHoliday = holidaysList.includes(dateKey);
                
                let isFullyBooked = false;
                if (!isHoliday && d >= minDate) {
                    const allDaySlots = [];
                    for (let h = 10; h <= 20; h++) {
                        let mins = [0, 15, 30, 45];
                        if (h === 20) mins = [0];
                        mins.forEach(m => {
                            allDaySlots.push(\`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`);
                        });
                    }
                    isFullyBooked = allDaySlots.every(timeStr => {
                        const slotKey = \`\${dateKey}_\${timeStr}\`;
                        return blockedSlotsList.includes(slotKey);
                    });
                }

                if (d < minDate || d > oneMonthLater || d.getDay() === 0 || isHoliday || isFullyBooked) {`;
                
    content = content.replace(calRegex, calReplacement);

    // 2. renderSlots 時間帯別ブロック判定
    const slotRegex = /currentSelectedSlots = \[\];\s*currentSelectedHour = "";\s*updateConfirmButtonState\(\);\s*for \(let h = 10; h <= 20; h\+\+\) \{/g;
    
    const slotReplacement = `currentSelectedSlots = [];
            currentSelectedHour = "";
            updateConfirmButtonState();

            // 午前・午後の判定
            const allAmSlots = [];
            for (let h = 10; h <= 12; h++) {
                for (let m = 0; m < 60; m += 15) {
                    allAmSlots.push(\`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`);
                }
            }
            const allPmSlots = [];
            for (let h = 13; h <= 20; h++) {
                let mins = [0, 15, 30, 45];
                if (h === 20) mins = [0];
                mins.forEach(m => {
                    allPmSlots.push(\`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`);
                });
            }

            const isAmBlocked = allAmSlots.every(timeStr => isBooked(selectedDate, timeStr));
            const isPmBlocked = allPmSlots.every(timeStr => isBooked(selectedDate, timeStr));
            
            const amBtn = document.querySelector('#period-buttons-container button[data-value="午前"]');
            const pmBtn = document.querySelector('#period-buttons-container button[data-value="午後"]');
            const allDayBtn = document.querySelector('#period-buttons-container button[data-value="終日"]');
            
            if (amBtn) amBtn.style.display = isAmBlocked ? 'none' : 'inline-block';
            if (pmBtn) pmBtn.style.display = isPmBlocked ? 'none' : 'inline-block';
            if (allDayBtn) allDayBtn.style.display = (isAmBlocked || isPmBlocked) ? 'none' : 'inline-block';

            for (let h = 10; h <= 20; h++) {
                let mins = [0, 15, 30, 45];
                if (h === 20) mins = [0];
                const isHourBlocked = mins.every(m => {
                    const timeStr = \`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`;
                    return isBooked(selectedDate, timeStr);
                });
                if (isHourBlocked) continue;`;
                
    content = content.replace(slotRegex, slotReplacement);

    fs.writeFileSync(p, content);
    console.log('Patched ' + form);
});

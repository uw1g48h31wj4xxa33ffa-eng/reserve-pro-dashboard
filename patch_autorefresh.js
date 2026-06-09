const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // 1. replace refreshBookedSlots
    const regexRefresh = /async function refreshBookedSlots\(\) \{\s*try \{\s*const res = await fetch\('http:\/\/localhost:3001\/api\/holidays'\);\s*if \(res\.ok\) \{\s*const data = await res\.json\(\);\s*if \(data\.holidays\) \{\s*holidaysList = Object\.keys\(data\.holidays\);\s*\}\s*if \(data\.blockedSlots\) \{\s*blockedSlotsList = data\.blockedSlots;\s*\}\s*\}\s*\} catch \(e\) \{\s*console\.error\("ローカルサーバーとの通信エラー:", e\);\s*\}\s*renderCalendar\(\);\s*\}/g;

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
            if (selectedDate && document.getElementById('timeSlots') && document.getElementById('timeSlots').style.display === 'block') {
                renderSlots();
            }
        }`;

    content = content.replace(regexRefresh, replacementRefresh);

    // 2. add setInterval
    const regexInit = /renderCalendar\(\);\s*updateChoiceDisplay\(\);\s*refreshBookedSlots\(\);\s*<\/script>/g;
    const replacementInit = `renderCalendar();
        updateChoiceDisplay();
        refreshBookedSlots();
        
        // 15秒ごとに最新データを自動取得
        setInterval(refreshBookedSlots, 15000);
    </script>`;

    content = content.replace(regexInit, replacementInit);

    fs.writeFileSync(p, content);
    console.log('Patched ' + form);
});

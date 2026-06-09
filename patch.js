const fs = require('fs');
const path = require('path');

const forms = ['new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const filePath = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. HTML replacement
    const htmlOld = `<div id="detailed-time-group" class="input-group" style="margin-bottom: 15px; display: none;">
                        <label style="font-size: 0.75rem; color: #64748b; font-weight: 900; display: block; margin-bottom: 8px;">開始時間</label>
                        <div class="slot-grid" id="time-slot-buttons-container">
                            <!-- 動的生成 -->
                        </div>
                    </div>`;
    
    const htmlOldAlt = `<div id="detailed-time-group" class="input-group" style="margin-bottom: 15px; text-align: left; display: none;">
                        <label style="font-size: 0.75rem; color: #64748b; font-weight: 900; display: block; margin-bottom: 8px;">開始時間</label>
                        <div class="slot-grid" id="time-slot-buttons-container">
                            <!-- 動的生成 -->
                        </div>
                    </div>`;

    const htmlNew = `<div id="detailed-time-group" style="display: none; margin-bottom: 15px; text-align: left;">
                        <label style="font-size: 0.75rem; color: #64748b; font-weight: 900; display: block; margin-bottom: 8px;">時間を選択</label>
                        <div class="slot-grid" id="hour-buttons-container">
                            <!-- 時間ボタン -->
                        </div>
                        <div id="minute-group" style="display: none; margin-top: 15px;">
                            <label style="font-size: 0.75rem; color: #64748b; font-weight: 900; display: block; margin-bottom: 8px;">開始時間（分）を選択</label>
                            <div class="slot-grid" id="minute-buttons-container">
                                <!-- 分ボタン -->
                            </div>
                        </div>
                    </div>`;

    if (content.includes(htmlOld)) {
        content = content.replace(htmlOld, htmlNew);
    } else if (content.includes(htmlOldAlt)) {
        content = content.replace(htmlOldAlt, htmlNew);
    } else {
        console.log(`[${form}] HTML block not found.`);
    }

    // 2. Data fetching and isBooked replacement
    content = content.replace(/let bookedSlots = \[\];[\s\S]*?function isBooked\(date, timeSlot\) {[\s\S]*?return bookedSlots\.some\(slot => normalize\(slot\) === target\);\s*\}/, `let blockedSlotsList = [];

        function fmtDateLocal(d) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return \`\${year}-\${month}-\${day}\`;
        }

        function isBooked(date, timeStr) {
            const dateStr = fmtDateLocal(date);
            const slotKey = \`\${dateStr}_\${timeStr}\`;
            return blockedSlotsList.includes(slotKey);
        }

        async function refreshBookedSlots() {
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
        }`);

    // 3. renderSlots & selectHourButton
    const renderSlotsRegex = /let currentSelectedPeriod = "";\s*let currentSelectedTimeSlot = "";\s*function renderSlots\(\) {[\s\S]*?function updatePeriodActiveState\(\) {/m;
    
    const renderSlotsNew = `let currentSelectedHour = "";

        function renderSlots() {
            const hourContainer = document.getElementById('hour-buttons-container');
            const minGroup = document.getElementById('minute-group');
            if (!hourContainer) return;
            hourContainer.innerHTML = "";
            minGroup.style.display = "none";

            const dateStr = selectedDate.toLocaleDateString('ja-JP');
            const alreadyUsed = userData.choices.some(c => c && c.date.split(' ')[0] === dateStr);

            if (alreadyUsed) {
                alert("その日付は既に選択されています。別の日にちを選択してください。");
                currentSelectedPeriod = "";
                currentSelectedTimeSlot = "";
                currentSelectedHour = "";
                updatePeriodActiveState();
                
                document.getElementById('detailed-time-group').style.display = "none";
                document.getElementById('period-confirm-area').style.display = "none";
                document.getElementById('timeSlots').style.display = 'none';
                return;
            }

            currentSelectedSlots = [];
            currentSelectedHour = "";
            updateConfirmButtonState();

            for (let h = 10; h < 20; h++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'slot-btn';
                btn.setAttribute('data-value', h);
                btn.textContent = \`\${h}時台\`;
                btn.onclick = () => selectHourButton(h);
                hourContainer.appendChild(btn);
            }

            currentSelectedPeriod = "";
            currentSelectedTimeSlot = "";
            updatePeriodActiveState();

            document.getElementById('detailed-time-group').style.display = "none";
            document.getElementById('period-confirm-area').style.display = "none";
        }

        function selectHourButton(h) {
            currentSelectedHour = h;
            const minGroup = document.getElementById('minute-group');
            const minContainer = document.getElementById('minute-buttons-container');
            minGroup.style.display = "block";
            minContainer.innerHTML = "";
            
            const hourBtns = document.getElementById('hour-buttons-container').querySelectorAll('.slot-btn');
            hourBtns.forEach(btn => {
                if (parseInt(btn.getAttribute('data-value')) === h) btn.classList.add('active');
                else btn.classList.remove('active');
            });

            [0, 15, 30, 45].forEach(m => {
                const timeStr = \`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`;
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'slot-btn';
                btn.setAttribute('data-value', timeStr);
                
                if (isBooked(selectedDate, timeStr)) {
                    btn.textContent = \`\${timeStr} (×)\`;
                    btn.disabled = true;
                    btn.style.opacity = "0.5";
                    btn.style.cursor = "not-allowed";
                } else {
                    btn.textContent = timeStr;
                    btn.onclick = () => selectTimeSlotButton(timeStr);
                }
                minContainer.appendChild(btn);
            });
            updateTimeSlotActiveState();
        }

        function updatePeriodActiveState() {`;
    
    content = content.replace(renderSlotsRegex, renderSlotsNew);

    // 4. updateTimeSlotActiveState container ID
    content = content.replace(/getElementById\('time-slot-buttons-container'\)/g, "getElementById('minute-buttons-container')");

    // 5. confirmPeriodSelection array
    const orderOld = /"10:00～11:00", "11:00～12:00", "12:00～13:00",[\s\S]*?"16:00～17:00", "17:00～18:00", "18:00～19:00", "19:00～20:00"/;
    const orderNew = `"10:00", "10:15", "10:30", "10:45",
                    "11:00", "11:15", "11:30", "11:45",
                    "12:00", "12:15", "12:30", "12:45",
                    "13:00", "13:15", "13:30", "13:45",
                    "14:00", "14:15", "14:30", "14:45",
                    "15:00", "15:15", "15:30", "15:45",
                    "16:00", "16:15", "16:30", "16:45",
                    "17:00", "17:15", "17:30", "17:45",
                    "18:00", "18:15", "18:30", "18:45",
                    "19:00", "19:15", "19:30", "19:45"`;
    content = content.replace(orderOld, orderNew);

    // 6. order array might include "午前", "午後", "終日" which is fine to leave as is, the regex might replace the middle part.
    // Actually, wait, the original was:
    // "午前", "午後", "終日",
    // "10:00～11:00", "11:00～12:00" ...
    // So if we replace the time string, we should replace the whole array.
    const orderOldFull = /"午前", "午後", "終日",[\s\S]*?"18:00～19:00", "19:00～20:00"/;
    content = content.replace(orderOldFull, orderNew); // removed 午前,午後,終日 because Option B only allows time slots. 
    // Wait, the user said they wanted to keep 午前, 午後, 終日.
    // If we keep them, we should put them back.
    const orderKeepFull = `"午前", "午後", "終日",
                    "10:00", "10:15", "10:30", "10:45",
                    "11:00", "11:15", "11:30", "11:45",
                    "12:00", "12:15", "12:30", "12:45",
                    "13:00", "13:15", "13:30", "13:45",
                    "14:00", "14:15", "14:30", "14:45",
                    "15:00", "15:15", "15:30", "15:45",
                    "16:00", "16:15", "16:30", "16:45",
                    "17:00", "17:15", "17:30", "17:45",
                    "18:00", "18:15", "18:30", "18:45",
                    "19:00", "19:15", "19:30", "19:45"`;
    
    content = content.replace(orderNew, orderKeepFull);

    fs.writeFileSync(filePath, content);
    console.log(`[${form}] Updated successfully.`);
});

const fs = require('fs');
let txt = fs.readFileSync('forms_v3/referral-reservation/index.html', 'utf8');

// 古いrenderSlotsを探して置換
const startMarker = '        function renderSlots() {\n            if (!container) return;';
const endMarker = '        function selectPeriodButton(value) {';

const si = txt.indexOf(startMarker);
const ei = txt.indexOf(endMarker);

if (si === -1 || ei === -1) {
    console.error('markers not found si=' + si + ' ei=' + ei);
    process.exit(1);
}

const newFunc = `        function renderSlots() {
            const hourContainer = document.getElementById('hour-buttons-container');
            const minGroup = document.getElementById('minute-group');
            if (!hourContainer) return;
            hourContainer.innerHTML = "";
            minGroup.style.display = "none";

            const dateStr = selectedDate.toLocaleDateString('ja-JP');
            const alreadyUsed = userData.choices.some(c => c && c.date.split(' ')[0] === dateStr);
            if (alreadyUsed) {
                alert("\u305d\u306e\u65e5\u4ed8\u306f\u65e2\u306b\u9078\u629e\u3055\u308c\u3066\u3044\u307e\u3059\u3002\u5225\u306e\u65e5\u306b\u3061\u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044\u3002");
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

            const allAmSlots = [];
            for (let h = 10; h <= 12; h++) {
                for (let m = 0; m < 60; m += 15) {
                    allAmSlots.push(String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0'));
                }
            }
            const allPmSlots = [];
            for (let h = 13; h <= 20; h++) {
                let mins = [0, 15, 30, 45];
                if (parseInt(h) === 20) mins = [0];
                mins.forEach(m => { allPmSlots.push(String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0')); });
            }
            const isAmBlocked = allAmSlots.every(t => isBooked(selectedDate, t));
            const isPmBlocked = allPmSlots.every(t => isBooked(selectedDate, t));

            const amBtn = document.querySelector('#period-buttons-container button[data-value="\u5348\u524d"]');
            const pmBtn = document.querySelector('#period-buttons-container button[data-value="\u5348\u5f8c"]');
            const allDayBtn = document.querySelector('#period-buttons-container button[data-value="\u7d42\u65e5"]');
            if (amBtn) amBtn.style.display = isAmBlocked ? 'none' : 'inline-block';
            if (pmBtn) pmBtn.style.display = isPmBlocked ? 'none' : 'inline-block';
            if (allDayBtn) allDayBtn.style.display = (isAmBlocked || isPmBlocked) ? 'none' : 'inline-block';

            for (let h = 10; h <= 20; h++) {
                let mins = [0, 15, 30, 45];
                if (parseInt(h) === 20) mins = [0];
                const isHourBlocked = mins.every(m => {
                    return isBooked(selectedDate, String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0'));
                });
                if (isHourBlocked) continue;
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'slot-btn';
                btn.setAttribute('data-value', h);
                btn.textContent = h + '\u6642\u53f0';
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
                if (parseInt(btn.getAttribute('data-value')) === parseInt(h)) btn.classList.add('active');
                else btn.classList.remove('active');
            });

            let mins = [0, 15, 30, 45];
            if (parseInt(h) === 20) mins = [0];
            mins.forEach(m => {
                const timeStr = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'slot-btn';
                btn.setAttribute('data-value', timeStr);
                if (isBooked(selectedDate, timeStr)) {
                    btn.textContent = timeStr + ' (\u00d7)';
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

`;

txt = txt.slice(0, si) + newFunc + txt.slice(ei);
fs.writeFileSync('forms_v3/referral-reservation/index.html', txt, 'utf8');
console.log('done. new length=' + txt.length);

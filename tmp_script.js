
        window.onerror = function(msg, url, lineNo, columnNo, error) { alert("Error: " + msg + "\nLine: " + lineNo); return false; };
        // --- 設定は config.js で管理されています ---

        // --- 設定の動的取得 (マルチアカウント対応) ---
        const urlParams = new URLSearchParams(window.location.search);
        const activeClinicName = urlParams.get('account') || urlParams.get('name') || (typeof CLINIC_NAME !== 'undefined' ? CLINIC_NAME : "");
        const activeLineId = urlParams.get('id') || (typeof REFERRAL_LINE_ID !== 'undefined' ? REFERRAL_LINE_ID : "");

        // 電話番号の初期化
        document.addEventListener('DOMContentLoaded', () => {
            const phone = urlParams.get('tel') || (typeof CLINIC_PHONE !== 'undefined' ? CLINIC_PHONE : "");
            if (phone) {
                document.querySelectorAll('a[href^="tel:"]').forEach(link => {
                    link.href = `tel:${phone}`;
                });
            }
        });

        let currentSelectedSlots = [];
        let currentSelectedHour = "";

        // 状態管理
        let userData = {
            experience: "first",
            type: "new",
            classification: "", // adult or student
            ageGroup: "",
            consented: false,
            choices: [null, null, null], // {date: "YYYY-MM-DD", time: "HH:00-HH:00"}
            name: "",
            kana: "",
            tel: "",
            region: "",
            referral: "",
            payment: ""
        };

        // カレンダー管理
        let viewingDate = new Date();
        let selectedDate = null;
        function goToStep(stepId) {
            document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
            const target = document.getElementById(stepId);
            if (target) {
                target.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            if (stepId === 'step-confirm') {
                setTimeout(updateSummary, 20);
            }

            if (stepId === 'step-info') {
                const label = document.getElementById('label-tel');
                if (label) {
                    if (userData.classification === 'student' && userData.ageGroup === 'over15') {
                        label.innerHTML = '保護者の電話番号 <span class="red-bold" style="font-size: 0.7rem;">必須</span>';
                    } else {
                        label.innerHTML = '電話番号 <span class="red-bold" style="font-size: 0.7rem;">必須</span>';
                    }
                }
                checkInputs();
            }

            // Progress bar
            const steps = ['step-region', 'step-classification', 'step-notes', 'step-calendar', 'step-info', 'step-confirm'];
            const index = steps.indexOf(stepId);
            if (index !== -1) {
                const pb = document.getElementById('progressBar');
                if (pb) pb.style.width = ((index + 1) / steps.length * 100) + "%";
            }
        }

        // 地域選択
        function selectRegion(val) {
            userData.region = val;
            goToStep('step-classification');
        }

        // 初期選択
        function selectExperience(val) {
            userData.experience = val;
            if (val === 'past') {
                goToStep('step-reject-past');
            } else {
                goToStep('step-type');
            }
        }

        function selectType(val) {
            userData.type = val;
            goToStep('step-classification');
        }

        function selectClassification(type) {
            userData.classification = type;
            if (type === 'student') {
                goToStep('step-hs-age');
            } else {
                userData.ageGroup = "adult";
                goToStep('step-notes');
            }
        }

        function selectAgeGroup(group) {
            userData.ageGroup = group;
            if (group === 'under15') {
                goToStep('step-reject-age');
            } else {
                goToStep('step-consent');
            }
        }

        function consentAndProceed() {
            userData.consented = true;
            goToStep('step-notes');
        }

        function goBackFromNotes() {
            goToStep('step-classification');
        }

        // --- カレンダー実装 ---
        let holidaysList = [];
        let blockedSlotsList = [];

        function fmtDateLocal(d) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function isBooked(date, timeStr) {
            const dateStr = fmtDateLocal(date);
            const slotKey = `${dateStr}_${timeStr}`;
            return blockedSlotsList.includes(slotKey);
        }

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
                const stat = document.getElementById('sync-status-display');
                    if (stat) stat.innerText = `System Version: v1.1 (Auto-Sync) - 最終同期: ${new Date().toLocaleTimeString()} (ブロック: ${blockedSlotsList.length}件)`;
            } catch (e) {
                console.error("ローカルサーバーとの通信エラー:", e);
                const stat = document.getElementById('sync-status-display');
                if (stat) stat.innerText = `System Version: v1.1 (Auto-Sync) - 通信エラー: ${e.message}`;
            }
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
                        // It's a time string like "16:15"
                        return !isBooked(selectedDate, slot);
                    });
                currentSelectedHour = savedHour;
                    updatePeriodActiveState();

                if (savedPeriod === 'detailed') {
                        document.getElementById('detailed-time-group').style.display = "block";
                        document.getElementById('period-confirm-area').style.display = "block";
                        
                        // If the hour button no longer exists, it was fully blocked
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
        }

        function renderCalendar() {
            const grid = document.getElementById('calendarGrid');
            const header = document.getElementById('currentMonthYear');
            grid.innerHTML = "";

            const year = viewingDate.getFullYear();
            const month = viewingDate.getMonth();
            header.textContent = `${year}年 ${month + 1}月`;

            ['日', '月', '火', '水', '木', '金', '土'].forEach(d => {
                const div = document.createElement('div');
                div.className = 'calendar-day-header';
                div.textContent = d;
                grid.appendChild(div);
            });

            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div'));

            for (let i = 1; i <= daysInMonth; i++) {
                const d = new Date(year, month, i);
                const div = document.createElement('div');
                div.className = 'calendar-day';
                div.textContent = i;
                if (d.getDay() === 0) div.classList.add('sunday');

                const minDate = new Date(today);
                minDate.setDate(today.getDate() + 2);
                const oneMonthLater = new Date(today);
                oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

                // 不定休キーの作成 (例: "2026-05-20")
                const yearKey = d.getFullYear();
                const monthKey = String(d.getMonth() + 1).padStart(2, '0');
                const dayKey = String(d.getDate()).padStart(2, '0');
                const dateKey = `${yearKey}-${monthKey}-${dayKey}`;
                const isHoliday = holidaysList.includes(dateKey);
                
                let isFullyBooked = false;
                if (!isHoliday && d >= minDate) {
                    const allDaySlots = [];
                    for (let h = 10; h <= 20; h++) {
                        let mins = [0, 15, 30, 45];
                        if (parseInt(h) === 20) mins = [0];
                        mins.forEach(m => {
                            allDaySlots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
                        });
                    }
                    isFullyBooked = allDaySlots.every(timeStr => {
                        const slotKey = `${dateKey}_${timeStr}`;
                        return blockedSlotsList.includes(slotKey);
                    });
                }

                if (d < minDate || d > oneMonthLater || d.getDay() === 0 || isHoliday || isFullyBooked) {
                    div.classList.add('disabled');
                } else {
                    div.onclick = () => selectDate(d);
                    const dateStr = d.toLocaleDateString('ja-JP');
                    if (userData.choices.some(c => c && c.date.split(' ')[0] === dateStr)) {
                        div.classList.add('active');
                    }
                }
                grid.appendChild(div);
            }
        }

        function changeMonth(delta) {
            viewingDate.setMonth(viewingDate.getMonth() + delta);
            renderCalendar();
        }

        let currentSelectedPeriod = "";
        let currentSelectedTimeSlot = "";

        function selectDate(date) {
            selectedDate = date;
            renderCalendar();
            renderSlots();
            document.getElementById('timeSlots').style.display = 'block';
            setTimeout(() => {
                document.getElementById('timeSlots').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }

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

            const amBtn = document.querySelector('#period-buttons-container button[data-value="午前"]');
            const pmBtn = document.querySelector('#period-buttons-container button[data-value="午後"]');
            const allDayBtn = document.querySelector('#period-buttons-container button[data-value="終日"]');
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
                btn.textContent = h + '時台';
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
                    btn.textContent = timeStr + ' (×)';
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

        function selectPeriodButton(value) {
            currentSelectedPeriod = value;

            const detailedGroup = document.getElementById('detailed-time-group');
            const confirmArea = document.getElementById('period-confirm-area');

            if (value === "") {
                detailedGroup.style.display = "none";
                confirmArea.style.display = "none";
                currentSelectedSlots = [];
            } else if (value === "detailed") {
                currentSelectedSlots = [];
                detailedGroup.style.display = "block";
                confirmArea.style.display = "block";
                currentSelectedTimeSlot = "";
                updateTimeSlotActiveState();
            } else {
                detailedGroup.style.display = "none";
                confirmArea.style.display = "block";
                
                if (value === "終日") {
                    if (currentSelectedSlots.includes("終日")) {
                        currentSelectedSlots = [];
                    } else {
                        currentSelectedSlots = ["終日"];
                    }
                } else {
                    const allDayIdx = currentSelectedSlots.indexOf("終日");
                    if (allDayIdx !== -1) {
                        currentSelectedSlots.splice(allDayIdx, 1);
                    }
                    const idx = currentSelectedSlots.indexOf(value);
                    if (idx !== -1) {
                        currentSelectedSlots.splice(idx, 1);
                    } else {
                        currentSelectedSlots.push(value);
                    }
                }
            }
            updatePeriodActiveState();
            updateConfirmButtonState();
        }

        function updatePeriodActiveState() {
            const container = document.getElementById('period-buttons-container');
            if (container) {
                const buttons = container.querySelectorAll('.slot-btn');
                buttons.forEach(btn => {
                    const val = btn.getAttribute('data-value');
                    if (val === "detailed") {
                        if (currentSelectedPeriod === "detailed") {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    } else {
                        if (currentSelectedSlots.includes(val)) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    }
                });
            }
        }

        function selectTimeSlotButton(value) {
            const idx = currentSelectedSlots.indexOf(value);
            if (idx !== -1) {
                currentSelectedSlots.splice(idx, 1);
            } else {
                currentSelectedSlots.push(value);
            }
            updateTimeSlotActiveState();
            updateConfirmButtonState();
        }

        function updateTimeSlotActiveState() {
            const container = document.getElementById('minute-buttons-container');
            if (container) {
                const buttons = container.querySelectorAll('.slot-btn');
                buttons.forEach(btn => {
                    const val = btn.getAttribute('data-value');
                    if (currentSelectedSlots.includes(val)) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
        }

        function confirmPeriodSelection() {
            if (currentSelectedSlots.length > 0) {
                const order = ["午前", "午後", "終日", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00"];
                currentSelectedSlots.sort((a, b) => order.indexOf(a) - order.indexOf(b));
                const joined = currentSelectedSlots.join('、');
                selectTime(joined);
            }
        }

        function updateConfirmButtonState() {
            const btn = document.getElementById('confirmPeriodBtn');
            if (btn) {
                const hasSelection = currentSelectedSlots.length > 0;
                btn.disabled = !hasSelection;
            }
        }

        function selectTime(time) {
            const days = ['日', '月', '火', '水', '木', '金', '土'];
            const dateStr = `${selectedDate.toLocaleDateString('ja-JP')} (${days[selectedDate.getDay()]})`;
            const emptyIndex = userData.choices.indexOf(null);
            if (emptyIndex !== -1) {
                userData.choices[emptyIndex] = { date: dateStr, time: time };
                updateChoiceDisplay();
                selectedDate = null;
                document.getElementById('timeSlots').style.display = 'none';
                renderCalendar();

                // カレンダーへ自動スクロールして次の選択を促す
                const allFilled = userData.choices.every(c => c !== null);
                if (!allFilled) {
                    setTimeout(() => {
                        document.getElementById('step-calendar').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                } else {
                    setTimeout(() => {
                        document.getElementById('nextToInfo').scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            }
        }

        function clearChoice(index) {
            userData.choices[index - 1] = null;
            updateChoiceDisplay();
            renderCalendar();

            // カレンダーへ自動スクロール
            setTimeout(() => {
                document.getElementById('step-calendar').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }

        function updateChoiceDisplay() {
            for (let i = 1; i <= 3; i++) {
                const item = document.getElementById('choice' + i);
                const val = document.getElementById('val' + i);
                const choice = userData.choices[i - 1];
                item.classList.remove('active', 'filled');
                if (choice) {
                    val.textContent = `${choice.date} ${choice.time}`;
                    item.classList.add('filled');
                } else {
                    val.textContent = (i === userData.choices.indexOf(null) + 1) ? "日付を選択する" : "未選択";
                    if (i === userData.choices.indexOf(null) + 1) item.classList.add('active');
                }
            }
            const allFilled = userData.choices.every(c => c !== null);
            const nextBtn = document.getElementById('nextToInfo');
            if (nextBtn) {
                nextBtn.disabled = !allFilled;
                nextBtn.style.opacity = allFilled ? "1" : "0.5";
            }
        }

        function validateChoices() {
            goToStep('step-info');
        }

        function checkInputs() {
            const nameEl = document.getElementById('input-name');
            const kanaEl = document.getElementById('input-kana');
            const telEl = document.getElementById('input-tel');
            const refEl = document.getElementById('input-referral');
            const btn = document.getElementById('nextToPay');

            if (btn && nameEl && kanaEl && telEl && refEl) {
                // 電話番号からハイフンを削除
                let telVal = telEl.value.replace(/[ー－-]/g, '').trim();
                telEl.value = telVal;

                const isValid = (nameEl.value.trim() !== "" && kanaEl.value.trim() !== "" && telVal !== "" && refEl.value.trim() !== "");
                btn.disabled = !isValid;
                btn.style.opacity = isValid ? "1" : "0.5";
                btn.style.cursor = isValid ? "pointer" : "not-allowed";
            }
        }

        function detectIsJapanese(name, kana) {
            // アルファベットが含まれている場合は外国人（その他）とみなす
            if (/[a-zA-Z]/.test(name)) return false;

            // 中韓特有の漢字チェック
            const hasForeignKanji = /[李金朴崔張王劉趙周呉徐孫馬高梁]/.test(name);
            if (hasForeignKanji) return false;

            // カナに「リ」「イ」「キム」などの特徴がある場合
            const commonKana = /(リ|イ|キム|パク|チェ|チョ|チャン|ワン|リュウ)/;
            if (commonKana.test(kana)) return false;

            // それ以外は日本人とみなす（漢字・ひらがな・カタカナのみの構成）
            return true;
        }

        function isChineseKorean(name, kana) {
            // アルファベットが含まれている場合は「その他外国人」とみなす
            if (/[a-zA-Z]/.test(name)) return false;

            // 中韓特有の名字（漢字）
            const hasForeignKanji = /[李金朴崔張王劉趙周呉徐孫馬高梁]/.test(name);
            // 特定の読みが含まれるか
            const commonKana = /(リ|イ|キム|パク|チェ|チョ|チャン|ワン|リュウ)/;

            return hasForeignKanji || commonKana.test(kana);
        }

        function proceedToPayment() {
            userData.name = document.getElementById('input-name').value.replace(/\s+/g, ""); // スペースを除去
            userData.kana = document.getElementById('input-kana').value.trim();
            userData.tel = document.getElementById('input-tel').value.replace(/[^\d]/g, ""); // 数字のみ抽出
            userData.referral = document.getElementById('input-referral').value.trim();

            checkUserHistory(userData.name, userData.tel);
        }

        function checkUserHistory(name, tel) {
            finishProceedToPayment();
        }

        function finishProceedToPayment() {
            userData.payment = ""; // 支払い方法は不要になったため空にする
            goToStep('step-confirm');
        }

        function checkPayment() {
            const val = document.getElementById('select-payment').value;
            const btn = document.getElementById('nextToConfirmFromPay');
            if (btn) {
                btn.disabled = !val;
                btn.style.opacity = val ? "1" : "0.5";
            }
        }

        function sendToLine() {
            const clsLabel = userData.classification === 'adult' ? '社会人・一般' : '学生';
            const consentMsg = (userData.classification === 'student' && userData.ageGroup === 'over15') ? '\n注意事項に了承済み' : '';
            
            let paymentLine = "";
            
            const guardianLine = (userData.classification === 'student' && userData.ageGroup === 'over15') ? '\n保護者の同伴：可能' : '';

            const storeName = userData.region === '東京都' ? '新宿本院' : '阪急梅田';

            const message = `【ご紹介者用 予約希望】

■予約医院
${storeName}

■お客様情報
ご紹介者名：${userData.referral}
お名前：${userData.name}
ふりがな：${userData.kana}
${(userData.classification === 'student' && userData.ageGroup === 'over15') ? '保護者の電話番号' : '電話番号'}：${userData.tel}
区分：${clsLabel}${consentMsg}${guardianLine}

■希望日時
第1希望：${userData.choices[0].date} ${userData.choices[0].time}
第2希望：${userData.choices[1].date} ${userData.choices[1].time}
第3希望：${userData.choices[2].date} ${userData.choices[2].time}${paymentLine}

※このメッセージを送信し、当院からの返信をお待ちください`;

            const encodedMsg = encodeURIComponent(message);
            proceedToSubmit(activeLineId, encodedMsg);
        }
        function proceedToSubmit(dynamicId, encodedMsg) {
            window.location.href = `https://line.me/R/oaMessage/${dynamicId}/?${encodedMsg}`;
        }

        function updateSummary() {
            const clsLabel = userData.classification === 'adult' ? '社会人・大学生等' : (userData.ageGroup === 'over15' ? '高校生以下（15歳以上）' : '高校生以下（15歳未満）');

            let paymentHtml = "";

            const isMinorOver15 = (userData.classification === 'student' && userData.ageGroup === 'over15');
            const consentArea = document.getElementById('guardian-consent-area');
            if (consentArea) {
                consentArea.style.display = isMinorOver15 ? 'block' : 'none';
            }
            toggleSendButton();

            document.getElementById('summary-display').innerHTML = `
                <div><strong>受診地域：</strong> ${userData.region}</div>
                <div><strong>ご紹介者名：</strong> ${userData.referral}</div>
                <div><strong>お名前：</strong> ${userData.name} (${userData.kana})</div>
                <div><strong>${isMinorOver15 ? '保護者の電話番号' : '電話番号'}：</strong> ${userData.tel}</div>
                <div><strong>区分：</strong> ${clsLabel}</div>
                ${isMinorOver15 ? '<div><strong>注意事項：</strong> 了承済み</div>' : ''}
                ${isMinorOver15 ? `<div><strong>保護者同伴：</strong> ${document.getElementById('guardian-consent-checkbox').checked ? '<span style="color:#c53030; font-weight:900;">可能</span>' : '未確認'}</div>` : ''}
                <div style="margin-top: 10px; border-top: 1px solid #edf2f7; padding-top: 10px;">
                    <strong>第1希望：</strong> ${userData.choices[0].date} ${userData.choices[0].time}<br>
                    <strong>第2希望：</strong> ${userData.choices[1].date} ${userData.choices[1].time}<br>
                    <strong>第3希望：</strong> ${userData.choices[2].date} ${userData.choices[2].time}
                </div>
                ${paymentHtml}
            `;
        }

        function toggleSendButton() {
            const sendBtn = document.querySelector('#step-confirm .btn-line');
            if (!sendBtn) return;
            if (userData.classification === 'student' && userData.ageGroup === 'over15') {
                const checked = document.getElementById('guardian-consent-checkbox').checked;
                sendBtn.style.opacity = checked ? "1" : "0.3";
                sendBtn.style.pointerEvents = checked ? "auto" : "none";
            } else {
                sendBtn.style.opacity = "1";
                sendBtn.style.pointerEvents = "auto";
            }
        }

        renderCalendar();
        updateChoiceDisplay();
        refreshBookedSlots(); // バックグラウンドで空き枠を取得
    setInterval(refreshBookedSlots, 3000);
    
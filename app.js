/**
 * Ultimate Reserve Pro - Dashboard Logic (Mobile-Compatible Version)
 */

// ── CONFIGURATION ──
const CONFIG = {
    API_URL_ALL: "https://reserve-pro-dashboard.onrender.com/api/all",
    API_URL_STATUS: "https://reserve-pro-dashboard.onrender.com/api/appointments/status",
    API_URL_CUSTOMERS: "https://reserve-pro-dashboard.onrender.com/api/customers",
    API_URL_HOLIDAYS: "https://reserve-pro-dashboard.onrender.com/api/holidays",
    DOW_JA: ["日", "月", "火", "水", "木", "金", "土"],
    HOURS: { start: 10, end: 20 }
};

// ── STATE ──
let state = {
    appts: [],
    holidays: {},
    customers: [], // 顧客管理リスト
    currentView: 'requests',
    filterAccount: 'all',
    searchQuery: '',
    searchCustomerQuery: '', // 顧客検索用

    // Calendar State
    curYear: new Date().getFullYear(),
    curMonth: new Date().getMonth(),
    selectedCalDate: null,
    blockedSlots: [],

    // Modal State
    selectedAppt: null,
    selectedChoiceIdx: 0, // 0-2: Choices, 3: Manual
    manualDate: null,
    selectedSlot: null,
    timeStep: 30,

    // Customer Modal State
    custModalMode: 'add', // 'add' or 'edit'
    editingCustOriginalName: '',
    editingCustOriginalTel: '',

    // Sync Retry State
    retryCount: 0,
    retryTimer: null
};

// ── AUTH LOGIC ──
function getAuthRole() { return localStorage.getItem('userRole'); }
function getAuthHeader() { 
    const token = localStorage.getItem('jwtToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function apiFetch(url, options = {}) {
    if (!options.headers) options.headers = {};
    Object.assign(options.headers, getAuthHeader());
    const res = await fetch(url, options);
    if (res.status === 401) { logout(); throw new Error('Unauthorized'); }
    if (res.status === 403) { showToast('権限がありません。', 'var(--rose)'); throw new Error('Forbidden'); }
    return res;
}

async function handleLogin() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;
    try {
        const res = await fetch('https://reserve-pro-dashboard.onrender.com/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('userRole', data.role);
            // ログイン成功：モーダルを隠してダッシュボードを初期化
            const lm = document.getElementById('login-modal');
            if (lm) lm.style.cssText = 'display:none !important;';
            applyRBAC();
            renderCalendar();
            loadData();
        } else {
            alert(data.error);
        }
    } catch(e) { console.error(e); alert('ログインに失敗しました'); }
}

function logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    showLoginModal();
}

function showLoginModal() {
    const lu = document.getElementById('login-user');
    const lp = document.getElementById('login-pass');
    if (lu) lu.value = '';
    if (lp) lp.value = '';
    const lm = document.getElementById('login-modal');
    if (lm) lm.style.display = 'flex';
}

function applyRBAC() {
    const role = getAuthRole();
    const isAdmin = role === 'admin';
    const lockBtn = (btn) => { if(btn) { btn.disabled = !isAdmin; btn.style.opacity = isAdmin ? '1' : '0.5'; } };
    
    // スタッフ権限の場合は編集ボタンを無効化（UIマスキング）
    lockBtn(document.querySelector("#selected-date-info button"));
    document.querySelectorAll('.btn-delete-h').forEach(lockBtn);
    document.querySelectorAll('.btn-danger').forEach(lockBtn);
    const cb = document.getElementById('btn-submit-confirm');
    if(cb) lockBtn(cb);
}

// ── INITIALIZATION ──
window.onload = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        // 未ログインの場合：モーダルを強制表示
        const lm = document.getElementById('login-modal');
        if (lm) {
            lm.style.cssText = 'display:flex !important; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); z-index:9999; justify-content:center; align-items:center;';
        }
    } else {
        // ログイン済み：画面を初期化
        applyRBAC();
        renderCalendar();
        loadData();
    }
    // 定期的な更新 (1分ごと)
    setInterval(() => { if(localStorage.getItem('jwtToken')) loadData(); }, 1 * 60 * 1000);
};

function renderAccountList() {
    // 複数アカウントUI削除により無効化
}

// ── DATA LOADING ──
async function loadData() {
    if (typeof initRangeSelectors === 'function') initRangeSelectors();
    if (state.retryTimer) {
        clearTimeout(state.retryTimer);
        state.retryTimer = null;
    }

    setSyncStatus('同期中...', 'var(--amber)');

    if (!CONFIG.API_URL_ALL) {
        // デモ用ダミーデータ
        console.warn("GAS_URL is not set. Loading dummy data.");
        simulateDummyData();
        loadManualAppts();
        renderAll();
        setSyncStatus('デモモード', 'var(--primary)');
        return;
    }

    try {
        const res = await apiFetch(CONFIG.API_URL_ALL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        state.appts = (data.appts || []).map(appt => {
            appt.tel = formatPhoneNumber(appt.tel);
            if (appt.receivedFull) {
                appt.receivedFull = formatReceivedFull(appt.receivedFull);
            }
            if (appt.choices) {
                appt.choices = appt.choices.map(c => ({
                    ...c,
                    date: formatWithDow(c.date)
                }));
            }
            return appt;
        });
        state.holidays = data.holidays || {};
        state.blockedSlots = data.blockedSlots || [];
        state.customers = (data.customers || []).map(cust => {
            cust.tel = formatPhoneNumber(cust.tel);
            return cust;
        });

        // 手動追加された一時データをロード（翌日には自動削除）
        loadManualAppts();

        renderAll();
        setSyncStatus('同期完了', 'var(--emerald)');
        state.retryCount = 0; // 成功したのでリセット
    } catch (e) {
        console.error("Fetch error:", e);
        setSyncStatus('同期エラー', 'var(--rose)');

        // 自動指数バックオフリトライ (10秒、20秒、40秒、最大60秒)
        state.retryCount++;
        const delay = Math.min(10000 * Math.pow(2, state.retryCount - 1), 60000);
        console.log(`Sync failed. Retrying in ${delay / 1000}s (Attempt ${state.retryCount})...`);
        state.retryTimer = setTimeout(loadData, delay);
    }
}

function setSyncStatus(text, color) {
    const el = document.getElementById('sync-status');
    if (el) {
        el.textContent = text;
        el.previousElementSibling.style.background = color;
    }

    // 同期エラー警告バナーの制御
    const banner = document.getElementById('sync-error-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

function loadManualAppts() {
    try {
        const storedStr = localStorage.getItem('demo_manual_appts');
        if (!storedStr) return;
        
        let storedAppts = JSON.parse(storedStr);
        const todayStr = new Date().toDateString();
        
        // 当日追加されたものだけを残す（翌日には自動削除される）
        const validAppts = storedAppts.filter(a => a.addedDate === todayStr);
        
        if (validAppts.length !== storedAppts.length) {
            localStorage.setItem('demo_manual_appts', JSON.stringify(validAppts));
        }
        
        // state.appts の先頭に追加
        state.appts = [...validAppts, ...state.appts];
    } catch (e) {
        console.error("Failed to load manual appts from localStorage", e);
    }
}

function saveManualApptsToLocalStorage() {
    try {
        const manualAppts = state.appts.filter(a => a.isManual);
        localStorage.setItem('demo_manual_appts', JSON.stringify(manualAppts));
    } catch (e) {
        console.error("Failed to save manual appts", e);
    }
}

// ── RENDERING ──
function renderAll() {
    renderStats();
    renderTable();
    renderCalendar();
    renderHolidayList();
    renderCustomers();
}

function showView(viewId) {
    state.currentView = viewId;

    // UIの切り替え
    document.querySelectorAll('.view-container').forEach(el => el.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');

    // サイドバーの切り替え (PC用)
    document.querySelectorAll('aside .nav-item').forEach(el => el.classList.remove('active'));
    const navItems = document.querySelectorAll('aside .nav-section:first-of-type .nav-item');
    
    // ボトムナビの切り替え (スマホ用)
    document.querySelectorAll('.mobile-nav-item').forEach(el => el.classList.remove('active'));

    if (viewId === 'requests') {
        if (navItems.length > 0) navItems[0].classList.add('active');
        const mobileReqBtn = document.getElementById('mobile-nav-requests');
        if (mobileReqBtn) mobileReqBtn.classList.add('active');
        document.getElementById('page-title').textContent = '予約申請一覧';
    } else if (viewId === 'calendar') {
        if (navItems.length > 1) navItems[1].classList.add('active');
        const mobileCalBtn = document.getElementById('mobile-nav-calendar');
        if (mobileCalBtn) mobileCalBtn.classList.add('active');
        document.getElementById('page-title').textContent = '不定休・予約枠管理';
    } else if (viewId === 'customers') {
        if (navItems.length > 2) navItems[2].classList.add('active');
        const mobileCustBtn = document.getElementById('mobile-nav-customers');
        if (mobileCustBtn) mobileCustBtn.classList.add('active');
        document.getElementById('page-title').textContent = '顧客・ブロック管理';
        renderCustomers();
    } else if (viewId === 'forms') {
        const mobileFormsBtn = document.getElementById('mobile-nav-forms');
        if (mobileFormsBtn) mobileFormsBtn.classList.add('active');
        document.getElementById('page-title').textContent = '案内用フォーム';
    }

    if (viewId === 'calendar') renderCalendar();
}

function renderStats() {
    const pending = state.appts.filter(a => a.status === 'pending').length;
    const phone = state.appts.filter(a => a.status === 'phone').length;
    const doneToday = state.appts.filter(a => a.status === 'done').length; // 本来は日付チェック
    const hols = Object.keys(state.holidays).length;

    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-phone').textContent = phone;
    document.getElementById('stat-done').textContent = doneToday;
    document.getElementById('stat-holidays').textContent = hols;
}

function renderTable() {
    const tbody = document.getElementById('request-tbody');
    let list = state.appts;

    // フィルタリング

    if (state.searchQuery) {
        list = list.filter(a => a.name.includes(state.searchQuery));
    }

    document.getElementById('request-count').textContent = `${list.length} 件`;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:80px; color:var(--text-dim)">該当する申請はありません</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(a => {
        const statusClass = a.status === 'pending' ? 'tag-blue' : (a.status === 'phone' ? 'tag-amber' : 'tag-emerald');
        const statusText = a.status === 'pending' ? '⌛ 未処理' : (a.status === 'phone' ? '📞 要電話' : '✓ 確定済');

        return `
            <tr class="request-row fade-in" onclick="handleRowClick('${a.id}')">
                <td>
                    <div class="patient-info">
                        <div class="avatar">${a.name[0]}</div>
                        <div>
                            <div class="p-name">
                                ${a.name}
                                ${a.displayCount === 2 ? '<span style="color:var(--amber); font-size:0.6rem; font-weight:bold;">[2回目]</span>' : ''}
                                ${a.displayCount >= 3 ? '<span style="color:var(--rose); font-size:0.6rem; font-weight:bold;">[3回目(要電話)]</span>' : ''}
                            </div>
                            <div class="p-meta">${a.lineAccount} / ${a.tel || '--'}${a.referral ? ` / 紹介: ${a.referral}` : ''}</div>
                        </div>
                    </div>
                </td>
                <td style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted)">
                    ${a.receivedFull}
                </td>
                <td>
                    <div style="font-size: 0.85rem;">
                        ${a.choices.slice(0, 1).map(c => `
                            <div><span style="color:var(--primary); font-weight:700;">第1:</span> ${c.date} ${c.rangeLabel}</div>
                        `).join('')}
                        ${a.choices.length > 1 ? `<div style="color:var(--text-dim); font-size:0.75rem;">+ 他 ${a.choices.length - 1} つの希望</div>` : ''}
                    </div>
                </td>
                <td>
                    <span class="tag ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <button class="btn-primary" style="padding: 8px 16px; font-size: 0.75rem;">
                        ${a.status === 'done' ? '詳細' : '処理を開始'}
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// ── INTERACTIONS ──
function filterTable(query) {
    state.searchQuery = query;
    renderTable();
}

function handleRowClick(id) {
    const a = state.appts.find(x => x.id === id);
    if (!a) return;

    if (a.isSecondChange && a.status !== 'done') {
        openPhoneModal(a);
    } else {
        openConfirmModal(a);
    }
}

// ── CONFIRM MODAL ──
function openConfirmModal(a) {
    state.selectedAppt = a;
    state.selectedChoiceIdx = a.choices && a.choices.length > 0 ? 0 : 3;
    state.selectedSlot = null;
    state.manualDate = null;
    state.timeStep = 30;

    document.getElementById('modal-p-name').textContent = `${a.name} 様`;
    let metaText = `${a.lineAccount} / 申請受付: ${a.receivedFull}`;
    if (a.referral) {
        metaText += ` / 紹介: ${a.referral}`;
    }
    document.getElementById('modal-p-meta').textContent = metaText;

    // 自由選択エリアの初期化
    document.getElementById('manual-date-container').style.display = 'none';
    document.getElementById('manual-date-input').value = '';

    // 時間ステップトグルの初期化
    document.querySelectorAll('.step-btn').forEach(btn => btn.classList.remove('active'));
    const step30Btn = document.getElementById('step-30-btn');
    if (step30Btn) step30Btn.classList.add('active');
    const pickerLabel = document.getElementById('slot-picker-label');
    if (pickerLabel) pickerLabel.textContent = '確定時間 (30分単位)';

    renderChoiceTabs(a);
    renderSlotPicker();
    updateScriptPreview();

    document.getElementById('modal-confirm').style.display = 'flex';
    const isDone = a.status === 'done';
    validateConfirmForm();
    
    // 「未処理に戻す」ボタンの表示制御
    const revertBtn = document.getElementById('btn-revert-confirm');
    if (revertBtn) {
        revertBtn.style.display = isDone ? 'block' : 'none';
    }
    
    // キャンセルボタンのテキスト変更（確定済の場合は「閉じる」）
    const cancelBtn = document.getElementById('btn-cancel-confirm');
    if (cancelBtn) {
        cancelBtn.textContent = isDone ? '閉じる' : 'キャンセル';
    }
}

function renderChoiceTabs(a) {
    const container = document.getElementById('choice-tabs');
    let html = a.choices.map((c, i) => {
        const isClosed = checkIsClosed(c.date);
        const active = i === state.selectedChoiceIdx ? 'border-color:var(--primary); background:rgba(59,130,246,0.1); color:var(--primary);' : '';
        const disabled = isClosed ? 'opacity:0.4; cursor:not-allowed;' : 'cursor:pointer;';

        return `
            <div style="padding:10px; border:1px solid var(--border); border-radius:10px; text-align:center; transition:var(--transition); ${active} ${disabled}" 
                 onclick="${isClosed ? '' : `selectChoice(${i})`}">
                <div style="font-size:0.6rem; font-weight:800; opacity:0.7;">第${i + 1}希望</div>
                <div style="font-size:0.85rem; font-weight:700;">${c.date}</div>
                <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">${c.rangeLabel || ''}</div>
                ${isClosed ? '<div style="font-size:0.6rem; color:var(--rose)">休診日</div>' : ''}
            </div>
        `;
    }).join('');

    // 自由選択タブを追加
    const manualActive = state.selectedChoiceIdx === 3 ? 'border-color:var(--primary); background:rgba(59,130,246,0.1); color:var(--primary);' : '';
    html += `
        <div style="padding:10px; border:1px solid var(--border); border-radius:10px; text-align:center; cursor:pointer; transition:var(--transition); ${manualActive}" 
             onclick="selectChoice(3)">
            <div style="font-size:0.6rem; font-weight:800; opacity:0.7;">✨ 自由選択</div>
            <div style="font-size:0.85rem; font-weight:700;">日付指定</div>
        </div>
    `;

    container.innerHTML = html;
}

function selectChoice(idx) {
    state.selectedChoiceIdx = idx;
    state.selectedSlot = null;

    const manualContainer = document.getElementById('manual-date-container');
    if (idx === 3) {
        manualContainer.style.display = 'block';
    } else {
        manualContainer.style.display = 'none';
    }

    renderChoiceTabs(state.selectedAppt);
    renderSlotPicker();
    updateScriptPreview();
    validateConfirmForm();
}

function handleManualDateChange(val) {
    // YYYY-MM-DD を M/D(曜) 形式に変換
    if (!val) return;
    const d = new Date(val);
    state.manualDate = `${d.getMonth() + 1}/${d.getDate()}(${CONFIG.DOW_JA[d.getDay()]})`;
    state.selectedSlot = null;
    renderSlotPicker();
    updateScriptPreview();
    validateConfirmForm();
}

function renderSlotPicker() {
    const container = document.getElementById('slot-picker');
    let targetDate;
    let range = { start: CONFIG.HOURS.start, end: CONFIG.HOURS.end };

    if (state.selectedChoiceIdx === 3) {
        targetDate = state.manualDate;
    } else {
        const choice = state.selectedAppt.choices[state.selectedChoiceIdx];
        targetDate = choice.date;
        range.start = Math.max(choice.rangeStart || 10, CONFIG.HOURS.start);
        range.end = Math.min(choice.rangeEnd || 20, CONFIG.HOURS.end);
    }

    if (!targetDate) {
        container.innerHTML = '<div style="grid-column:1/-1; color:var(--text-dim); font-size:0.8rem; text-align:center; padding:20px;">日付を選択してください</div>';
        return;
    }

    const isClosed = checkIsClosed(targetDate);
    if (isClosed) {
        const reason = isClosed === 'sunday' ? '日曜日' : '不定休';
        container.innerHTML = `<div style="grid-column:1/-1; color:var(--rose); font-size:0.85rem; font-weight:700; text-align:center; padding:20px;">休診日のため選択できません (${reason})</div>`;
        return;
    }

    let html = '';
    const step = state.timeStep || 30;
    const minutes = step === 15 ? ['00', '15', '30', '45'] : ['00', '30'];

    for (let h = range.start; h < range.end; h++) {
        minutes.forEach(m => {
            const time = `${h}:${m}`;
            const active = state.selectedSlot === time ? 'background:var(--primary); color:white; border-color:var(--primary);' : '';
            html += `
                <div style="padding:8px; border:1px solid var(--border); border-radius:8px; text-align:center; font-family:var(--font-mono); font-size:0.85rem; cursor:pointer; transition:var(--transition); ${active}"
                     onclick="selectSlot('${time}')">
                    ${time}
                </div>
            `;
        });
    }

    // 予約可能時間は 10:00〜20:00 のため、range.end の ":00"（例: 20:00）を最後に追加
    if (range.end >= range.start) {
        const time = `${range.end}:00`;
        const active = state.selectedSlot === time ? 'background:var(--primary); color:white; border-color:var(--primary);' : '';
        html += `
            <div style="padding:8px; border:1px solid var(--border); border-radius:8px; text-align:center; font-family:var(--font-mono); font-size:0.85rem; cursor:pointer; transition:var(--transition); ${active}"
                 onclick="selectSlot('${time}')">
                ${time}
            </div>
        `;
    }

    container.innerHTML = html || '<div style="grid-column:1/-1; color:var(--text-dim); font-size:0.8rem;">選択可能な枠がありません</div>';
}

function selectSlot(time) {
    state.selectedSlot = time;
    renderSlotPicker();
    updateScriptPreview();
    validateConfirmForm();
}

function setTimeStep(step) {
    state.timeStep = step;
    state.selectedSlot = null;

    // UIの切り替え
    document.querySelectorAll('.step-btn').forEach(btn => btn.classList.remove('active'));
    if (step === 30) {
        const btn30 = document.getElementById('step-30-btn');
        if (btn30) btn30.classList.add('active');
        const label = document.getElementById('slot-picker-label');
        if (label) label.textContent = '確定時間 (30分単位)';
    } else {
        const btn15 = document.getElementById('step-15-btn');
        if (btn15) btn15.classList.add('active');
        const label = document.getElementById('slot-picker-label');
        if (label) label.textContent = '確定時間 (15分単位)';
    }

    renderSlotPicker();
    updateScriptPreview();
    validateConfirmForm();
}

function updateScriptPreview() {
    const a = state.selectedAppt;
    if (!a) return;
    const slot = state.selectedSlot || "__:__";

    let targetDate;
    if (state.selectedChoiceIdx === 3) {
        targetDate = state.manualDate || "____";
    } else {
        targetDate = a.choices[state.selectedChoiceIdx].date;
    }

    // 2026年や2026/などの年表記を削除
    const cleanedTargetDate = targetDate.replace(/2026[\/\-年]?/g, '');

    // MMDDが3桁になっている場合は0を補って4桁にする
    const mmdd = String(a.receivedMMDD).padStart(4, '0');

    // Format: [受信MMDD][名前][(アカウント)][変 (変更予約時)][予約日(曜)][時間]
    const isChange = a.type && a.type.includes("変更");
    const hen = isChange ? "変" : "";
    const script = `${mmdd}${a.name}${a.lineAccount}${hen}${cleanedTargetDate}${slot}`;
    document.getElementById('script-preview').textContent = script;
}

function validateConfirmForm() {
    const btn = document.getElementById('btn-submit-confirm');
    if (!btn) return;

    const a = state.selectedAppt;
    if (!a) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        return;
    }

    const isDone = a.status === 'done';
    if (isDone) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        return;
    }

    // 時間スロットが選択されている場合のみ活性化
    const hasSlot = !!state.selectedSlot;
    btn.disabled = !hasSlot;
    btn.style.opacity = hasSlot ? '1' : '0.5';
    btn.style.cursor = hasSlot ? 'pointer' : 'not-allowed';
}

// ── PHONE MODAL ──
function openPhoneModal(a) {
    state.selectedAppt = a;

    // MMDDが3桁になっている場合は0を補って4桁にする
    const mmdd = String(a.receivedMMDD).padStart(4, '0');

    // 管理者への指示
    document.getElementById('phone-script-admin').textContent = `${mmdd}${a.name}${a.lineAccount}要電話案内`;

    // ユーザーへの定型文
    const template = `${a.name} 様\n\nお申込みいただきありがとうございます。\n誠に恐れ入りますが、直接医院へお電話にてご連絡をお願いしております。\n\nお電話口にて「LINEでの変更希望」とお伝えいただけますとスムーズです。\n\nどうぞよろしくお願いいたします。`;
    document.getElementById('phone-script-user').textContent = template;

    document.getElementById('modal-phone').style.display = 'flex';
}

// ── CALENDAR LOGIC ──
function renderCalendar() {
    const y = state.curYear, m = state.curMonth;
    const monthsEng = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const monthLabel = document.getElementById("cal-month-title");
    if (monthLabel) monthLabel.textContent = `${monthsEng[m]} ${y}`;

    const container = document.getElementById("calendar-grid");
    if (!container) return;
    
    let html = CONFIG.DOW_JA.map((d, i) => `<div class="dow-cell ${i === 0 ? 'sun' : ''}">${d}</div>`).join('');

    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const today = new Date(); today.setHours(0, 0, 0, 0);

    // 空白のセル
    for (let i = 0; i < first; i++) html += `<div class="day-cell empty"></div>`;

    // 日付のセル
    for (let d = 1; d <= days; d++) {
        const cur = new Date(y, m, d);
        const key = fmtDate(cur);
        const isSun = cur.getDay() === 0;
        const isPastDate = cur < today;
        const isHol = !!state.holidays[key];
        const isTod = cur.getTime() === today.getTime();

        let cls = "day-cell";
        if (isSun) cls += " sun";
        if (isHol) cls += " holiday";
        if (isTod) cls += " today";
        if (state.selectedCalDate === key) cls += " selected";
        if (isPastDate) cls += " past";

        const clickAction = isPastDate ? "" : `onclick="clickCalDate('${key}')"`;
        html += `
            <div class="${cls}" ${clickAction}>
                <div class="day-num">${d}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function clickCalDate(key) {
    state.selectedCalDate = key;
    renderCalendar();

    const d = new Date(key);
    document.getElementById("h-date-label").textContent = `${d.getMonth() + 1}月${d.getDate()}日(${CONFIG.DOW_JA[d.getDay()]})`;
    document.getElementById("h-memo-input").value = state.holidays[key] ? state.holidays[key].memo : "";

    if (typeof renderTimeSlotsBlocker === 'function') {
        renderTimeSlotsBlocker(key);
    }
    document.getElementById("selected-date-info").style.display = "block";
}

async function toggleHoliday() {
    const key = state.selectedCalDate;
    if (!key) return;

    const memo = document.getElementById("h-memo-input").value;
    const btn = document.querySelector("#selected-date-info button");
    const originalText = btn.textContent;

    // ボタンを無効化しローディング表示
    btn.disabled = true;
    btn.classList.add("btn-loading");

    // サーバーへ送信
    if (CONFIG.API_URL_ALL) {
        try {
            const res = await apiFetch(CONFIG.API_URL_HOLIDAYS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ action: 'addHoliday', date: key, memo })
            });
            if (!res.ok) throw new Error("Sync failed");
        } catch (e) {
            console.error("Holiday sync error:", e);
            showToast("同期エラー：スプレッドシートへの保存に失敗しました。", "var(--rose)");
            btn.disabled = false;
            btn.classList.remove("btn-loading");
            btn.textContent = originalText;
            setSyncStatus('同期エラー', 'var(--rose)');
            return;
        }
    }

    // 成功時のみローカル状態を更新
    if (state.holidays[key] && !memo) {
        delete state.holidays[key];
        showToast("不定休を解除しました");
    } else {
        state.holidays[key] = { memo };
        showToast("不定休を登録しました");
    }

    btn.disabled = false;
    btn.classList.remove("btn-loading");
    btn.textContent = originalText;

    renderAll();
}

function renderHolidayList() {
    const container = document.getElementById("h-list-items");
    if (!container) return;
    const keys = Object.keys(state.holidays).sort();
    
    const countBadge = document.getElementById("h-count-badge");
    if (countBadge) countBadge.textContent = `${keys.length} 件`;

    if (keys.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-dim); font-size:0.85rem;">登録はありません</div>';
        return;
    }

    container.innerHTML = keys.map(k => {
        const d = new Date(k);
        return `
            <div class="h-list-item">
                <div>
                    <div class="h-item-date">${d.getMonth() + 1}/${d.getDate()} (${CONFIG.DOW_JA[d.getDay()]})</div>
                    <div class="h-item-memo">${state.holidays[k].memo || 'メモなし'}</div>
                </div>
                <button class="btn-delete-h" onclick="deleteHoliday('${k}')">×</button>
            </div>
        `;
    }).join('');
}

async function deleteHoliday(key) {
    const originalHolidays = { ...state.holidays };

    // 楽観的UI更新（画面上はすぐ削除する）
    delete state.holidays[key];
    renderAll();
    showToast("同期中...");

    if (CONFIG.API_URL_ALL) {
        try {
            const res = await apiFetch(CONFIG.API_URL_HOLIDAYS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ action: 'deleteHoliday', date: key })
            });
            if (!res.ok) throw new Error("Delete sync failed");
            showToast("削除しました");
        } catch (e) {
            console.error("Delete holiday sync error:", e);
            // エラーが発生したら元の状態にロールバックする
            state.holidays = originalHolidays;
            renderAll();
            showToast("同期エラー：削除の同期に失敗しました。", "var(--rose)");
            setSyncStatus('同期エラー', 'var(--rose)');
        }
    } else {
        showToast("削除しました");
    }
}

function moveMonth(n) {
    state.curMonth += n;
    if (state.curMonth > 11) { state.curMonth = 0; state.curYear++; }
    if (state.curMonth < 0) { state.curMonth = 11; state.curYear--; }
    renderCalendar();
}

function fmtDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ── UTILS ──
function formatPhoneNumber(tel) {
    if (!tel) return "";
    let clean = String(tel).replace(/[^\d]/g, ""); // 数字以外を除去

    // 先頭の0が消えている場合（例: "7022223333" -> "07022223333"）
    if (clean.length === 9 || clean.length === 10) {
        if (!clean.startsWith("0")) {
            clean = "0" + clean;
        }
    }

    // 11桁の携帯電話（090-1234-5678）のフォーマット
    if (clean.length === 11) {
        return clean.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    // 10桁の固定電話（03-1234-5678 など）のフォーマット
    if (clean.length === 10) {
        return clean.replace(/(\d{2,3})(\d{3,4})(\d{4})/, "$1-$2-$3");
    }

    return String(tel);
}

function formatReceivedFull(dateStr) {
    if (!dateStr) return "";
    if (dateStr.includes('GMT') || dateStr.includes('日本標準時') || /^[A-Za-z]{3}\s[A-Za-z]{3}/.test(dateStr)) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const h = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            return `${y}/${m}/${day} ${h}:${min}`;
        }
    }
    return dateStr;
}

function formatWithDow(dateStr) {
    if (!dateStr) return "";

    if (dateStr.includes('GMT') || dateStr.includes('日本標準時') || /^[A-Za-z]{3}\s[A-Za-z]{3}/.test(dateStr)) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            const month = d.getMonth() + 1;
            const day = d.getDate();
            const dow = CONFIG.DOW_JA[d.getDay()];
            return `${month}/${day}(${dow})`;
        }
    }

    // 年表記 (2026/, 2026-, 2026年) を完全に削除したクリーンな文字列を作る
    let cleaned = dateStr.replace(/20\d{2}[\/\-年]?/g, '').replace(/日$/, '').trim();

    // すでにカッコ付きの曜日が含まれている場合は、カッコを半角に統一してそのまま返す
    if (/\([日月火水木金土]\)/.test(cleaned) || /（[日月火水木金土]）/.test(cleaned)) {
        cleaned = cleaned.replace(/（/g, '(').replace(/）/g, ')');
        return cleaned;
    }

    // 曜日が含まれていない場合、パースを試みる
    let year = new Date().getFullYear();
    let month = 1;
    let day = 1;

    // 元の文字列から年を抽出（もしあれば）
    const yearMatch = dateStr.match(/(20\d{2})/);
    if (yearMatch) {
        year = parseInt(yearMatch[1], 10);
    }

    // クリーンな文字列から月日を抽出
    const mdMatch = cleaned.match(/(\d{1,2})[\/\-月](\d{1,2})/);
    if (mdMatch) {
        month = parseInt(mdMatch[1], 10);
        day = parseInt(mdMatch[2], 10);
    } else {
        return cleaned;
    }

    const d = new Date(year, month - 1, day);
    if (isNaN(d.getTime())) {
        return cleaned;
    }

    const dow = CONFIG.DOW_JA[d.getDay()];
    return `${month}/${day}(${dow})`;
}

function openManualAddModal() {
    document.getElementById('manual-name').value = '';
    document.getElementById('manual-tel').value = '';
    document.getElementById('modal-manual-add').style.display = 'flex';
}

function submitManualAdd() {
    const name = document.getElementById('manual-name').value.trim();
    const tel = document.getElementById('manual-tel').value.trim();

    if (!name || !tel) {
        showToast("名前と電話番号は必須です", "var(--amber)");
        return;
    }

    const d = new Date();
    const newAppt = {
        id: `manual_${Date.now()}`,
        name: name,
        lineAccount: '手動追加',
        tel: formatPhoneNumber(tel),
        status: 'pending',
        receivedFull: formatReceivedFull(d.toString()),
        receivedMMDD: String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0'),
        choices: [],
        isManual: true,
        addedDate: d.toDateString() // ローカル保存用（翌日削除判定）
    };

    // 一時的にローカルストレージへ保存
    try {
        const storedStr = localStorage.getItem('demo_manual_appts');
        let storedAppts = storedStr ? JSON.parse(storedStr) : [];
        storedAppts.unshift(newAppt);
        localStorage.setItem('demo_manual_appts', JSON.stringify(storedAppts));
    } catch (e) {
        console.error("Failed to save to localStorage", e);
    }

    state.appts.unshift(newAppt);
    renderAll();
    closeModal('modal-manual-add');
    showToast("手動追加しました（ブラウザに一時保存されます）", "var(--emerald)");
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function copyText(id) {
    const txt = document.getElementById(id).textContent;
    navigator.clipboard.writeText(txt);
    showToast("コピーしました");
}

function copyScript() {
    if (!state.selectedSlot) {
        showToast("時間枠を選択してください", "var(--rose)");
        return;
    }
    copyText('script-preview');
}

function showToast(msg, color = "var(--emerald)") {
    // 簡易的な通知実装
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:${color}; color:white; padding:12px 24px; border-radius:99px; font-weight:700; z-index:2000; box-shadow:0 8px 24px rgba(0,0,0,0.2); animation:modalIn 0.3s;`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = '0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

function checkIsClosed(dateStr) {
    const match = dateStr.match(/(\d+)\/(\d+)/);
    if (!match) return false;

    const year = new Date().getFullYear();
    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);

    // 日曜日チェック
    const d = new Date(year, month - 1, day);
    if (!isNaN(d.getTime()) && d.getDay() === 0) return 'sunday';

    // 不定休チェック (YYYY-MM-DD形式に変換して比較)
    const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (state.holidays[key]) return 'holiday';

    return false;
}

// ── ACTIONS ──
async function submitFinal() {
    if (!state.selectedSlot) return;

    const a = state.selectedAppt;
    const script = document.getElementById('script-preview').textContent;
    const btn = document.getElementById('btn-submit-confirm');
    const originalText = btn.textContent;

    // ステータス更新
    let targetDate;
    if (state.selectedChoiceIdx === 3) {
        targetDate = state.manualDate;
    } else {
        targetDate = a.choices[state.selectedChoiceIdx].date;
    }

    // ボタンを無効化しローディング表示
    btn.disabled = true;
    btn.classList.add("btn-loading");

    const confirmedData = { script, date: targetDate, time: state.selectedSlot };

    if (CONFIG.API_URL_ALL && !a.isManual) {
        try {
            const res = await apiFetch(CONFIG.API_URL_STATUS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ action: 'updateStatus', id: a.id, status: 'done', confirmedData })
            });
            if (!res.ok) throw new Error("Sync failed");
        } catch (e) {
            console.error("Submit final sync error:", e);
            showToast("同期エラー：スプレッドシートへの保存に失敗しました。", "var(--rose)");
            btn.disabled = false;
            btn.classList.remove("btn-loading");
            btn.textContent = originalText;
            setSyncStatus('同期エラー', 'var(--rose)');
            return; // 処理を中断し、モーダルは閉じない
        }
    }

    // 同期成功時のみローカル状態を更新してモーダルを閉じる
    a.status = 'done';
    a.confirmedData = confirmedData;

    if (a.isManual) {
        saveManualApptsToLocalStorage();
    }

    btn.disabled = false;
    btn.classList.remove("btn-loading");
    btn.textContent = originalText;

    closeModal('modal-confirm');
    renderAll();
    showToast("予約確定を保存しました");
}

async function markAsPhoneProcessed() {
    const a = state.selectedAppt;
    const btn = document.querySelector("#modal-phone .btn-primary");
    const originalText = btn.textContent;

    // ボタンを無効化しローディング表示
    btn.disabled = true;
    btn.classList.add("btn-loading");

    if (CONFIG.API_URL_ALL) {
        try {
            const res = await apiFetch(CONFIG.API_URL_STATUS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ action: 'updateStatus', id: a.id, status: 'done' })
            });
            if (!res.ok) throw new Error("Phone sync failed");
        } catch (e) {
            console.error("Phone processed sync error:", e);
            showToast("同期エラー：スプレッドシートへの保存に失敗しました。", "var(--rose)");
            btn.disabled = false;
            btn.classList.remove("btn-loading");
            btn.textContent = originalText;
            setSyncStatus('同期エラー', 'var(--rose)');
            return; // 処理を中断し、モーダルは閉じない
        }
    }

    // 同期成功時のみローカル状態を更新してモーダルを閉じる
    a.status = 'done'; // または 'processed'

    btn.disabled = false;
    btn.classList.remove("btn-loading");
    btn.textContent = originalText;

    closeModal('modal-phone');
    renderAll();
    showToast("電話案内済みとしてマークしました");
}

// ── DUMMY DATA ──
function simulateDummyData() {
    state.appts = [
        {
            id: "1", name: "テスト花子", tel: "090-1111-2222", lineAccount: "(ミラ総)", receivedFull: "2026/05/15 10:20", receivedMMDD: "0515", status: "pending", isSecondChange: false, choices: [
                { date: "5/18(月)", rangeLabel: "11:00〜12:00", rangeStart: 11, rangeEnd: 12 },
                { date: "5/20(水)", rangeLabel: "午後", rangeStart: 13, rangeEnd: 18 }
            ]
        },
        {
            id: "2", name: "サンプル太郎", tel: "080-3333-4444", lineAccount: "(ミラc)", receivedFull: "2026/05/16 09:45", receivedMMDD: "0516", status: "pending", isSecondChange: true, choices: [
                { date: "5/22(金)", rangeLabel: "終日", rangeStart: 10, rangeEnd: 20 }
            ]
        },
        {
            id: "3", name: "佐藤 健", tel: "070-5555-6666", lineAccount: "(ミラmo)", receivedFull: "2026/05/16 11:30", receivedMMDD: "0516", status: "phone", isSecondChange: true, choices: [
                { date: "5/25(月)", rangeLabel: "午前", rangeStart: 10, rangeEnd: 12 }
            ]
        }
    ].map(appt => {
        if (appt.choices) {
            appt.choices = appt.choices.map(c => ({
                ...c,
                date: formatWithDow(c.date)
            }));
        }
        return appt;
    });
    state.holidays = { "2026-05-20": { memo: "不定休" } };
    state.customers = [
        { name: "テスト花子", tel: "09011112222", changeCount: 1, isBlocked: false, lastUpdated: "2026/05/18 10:20" },
        { name: "サンプル太郎", tel: "08033334444", changeCount: 2, isBlocked: true, lastUpdated: "2026/05/18 11:30" }
    ];
}

// ── CUSTOMER MANAGEMENT FUNCTIONS ──
let custCountInModal = 1;

function renderCustomers() {
    const tbody = document.getElementById('customer-tbody');
    if (!tbody) return;

    let list = state.customers || [];

    // フィルタリング
    if (state.searchCustomerQuery) {
        const q = state.searchCustomerQuery.toLowerCase();
        list = list.filter(c => c.name.includes(q) || c.tel.replace(/[^\d]/g, '').includes(q));
    }

    const countBadge = document.getElementById('customer-count');
    if (countBadge) {
        countBadge.textContent = `${list.length} 名`;
    }

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:80px; color:var(--text-dim)">該当する顧客はいません</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(c => {
        const isBlocked = c.isBlocked === true || c.isBlocked === "true" || c.isBlocked === "TRUE";
        const blockClass = isBlocked ? 'tag-rose' : 'tag-emerald';
        const blockText = isBlocked ? '🔴 ブロック中' : '🟢 許可';
        const blockBtnText = isBlocked ? '解除' : 'ブロック';

        // 予約変更回数カウントの背景色を設定（3以上は警告赤）
        const actionCount = parseInt(c.changeCount || 0, 10);
        let countStyle = 'font-weight: 800; font-size: 1.1rem;';
        if (actionCount >= 2) {
            countStyle += ' color: var(--rose);';
        } else if (actionCount === 1) {
            countStyle += ' color: var(--amber);';
        } else {
            countStyle += ' color: var(--emerald);';
        }

        return `
            <tr class="request-row fade-in" style="cursor: default;" onclick="event.stopPropagation();">
                <td style="padding: 16px 24px;">
                    <div style="font-weight: 700; font-size: 1.0rem; color: var(--text-main);">${c.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">${c.tel || '--'}</div>
                </td>
                <td style="padding: 16px 24px; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <button class="btn-secondary" style="padding: 4px 8px; font-size: 0.75rem; border-radius: 4px;" onclick="adjustCustomerCount('${c.name}', '${c.tel}', -1)">-</button>
                        <span style="${countStyle}">${actionCount}</span>
                        <button class="btn-secondary" style="padding: 4px 8px; font-size: 0.75rem; border-radius: 4px;" onclick="adjustCustomerCount('${c.name}', '${c.tel}', 1)">+</button>
                    </div>
                </td>
                <td style="padding: 16px 24px; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <span class="tag ${blockClass}" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 20px;">${blockText}</span>
                        <button class="btn-secondary" style="padding: 4px 10px; font-size: 0.7rem; border-radius: 6px;" onclick="toggleCustomerBlock('${c.name}', '${c.tel}')">${blockBtnText}</button>
                    </div>
                </td>
                <td style="padding: 16px 24px; font-size: 0.8rem; color: var(--text-dim);">
                    ${c.lastUpdated || '--'}
                </td>
                <td style="padding: 16px 24px; text-align: right;">
                    <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px; margin-right: 6px;" onclick="openEditCustomerModal('${c.name}', '${c.tel}')">編集</button>
                    <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px; color: var(--rose); border-color: var(--rose-glow);" onclick="deleteCustomer('${c.name}', '${c.tel}')">削除</button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterCustomers(query) {
    state.searchCustomerQuery = query;
    renderCustomers();
}

async function adjustCustomerCount(name, tel, delta) {
    const cust = state.customers.find(c => c.name === name && c.tel === tel);
    if (!cust) return;

    let originalCount = cust.changeCount;
    let newCount = Math.max(0, parseInt(originalCount || 0, 10) + delta);

    // 楽観的更新
    cust.changeCount = newCount;

    // もし回数が2回以上に増えたら自動ブロック、1回以下に減ったら自動ブロック解除にする
    let autoBlock = cust.isBlocked;
    if (newCount >= 2 && delta > 0) {
        autoBlock = true;
    } else if (newCount < 2 && delta < 0) {
        autoBlock = false;
    }
    cust.isBlocked = autoBlock;

    renderCustomers();

    if (CONFIG.API_URL_ALL) {
        showToast("同期中...");
        try {
            const res = await apiFetch(CONFIG.API_URL_CUSTOMERS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    action: 'updateCustomer',
                    name,
                    tel: tel.replace(/[^\d]/g, ''),
                    changeCount: newCount,
                    isBlocked: autoBlock
                })
            });
            if (!res.ok) throw new Error("Sync failed");
            showToast("変更回数を更新しました");
            loadData(); // 最終更新日時更新のため
        } catch (e) {
            console.error("Adjust count error:", e);
            cust.changeCount = originalCount; // ロールバック
            renderCustomers();
            showToast("同期エラー：スプレッドシートへの保存に失敗しました。", "var(--rose)");
            setSyncStatus('同期エラー', 'var(--rose)');
        }
    } else {
        showToast("変更回数を更新しました（デモモード）");
    }
}

async function toggleCustomerBlock(name, tel) {
    const cust = state.customers.find(c => c.name === name && c.tel === tel);
    if (!cust) return;

    let originalBlock = cust.isBlocked;
    let newBlock = !originalBlock;

    // 楽観的更新
    cust.isBlocked = newBlock;
    renderCustomers();

    if (CONFIG.API_URL_ALL) {
        showToast("同期中...");
        try {
            const res = await apiFetch(CONFIG.API_URL_CUSTOMERS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    action: 'updateCustomer',
                    name,
                    tel: tel.replace(/[^\d]/g, ''),
                    changeCount: cust.changeCount,
                    isBlocked: newBlock
                })
            });
            if (!res.ok) throw new Error("Sync failed");
            showToast(newBlock ? "予約をブロックしました" : "ブロックを解除しました");
            loadData();
        } catch (e) {
            console.error("Toggle block error:", e);
            cust.isBlocked = originalBlock; // ロールバック
            renderCustomers();
            showToast("同期エラー：スプレッドシートへの保存に失敗しました。", "var(--rose)");
            setSyncStatus('同期エラー', 'var(--rose)');
        }
    } else {
        showToast(newBlock ? "予約をブロックしました（デモモード）" : "ブロックを解除しました（デモモード）");
    }
}

function openAddCustomerModal() {
    state.custModalMode = 'add';
    document.getElementById('customer-modal-title').textContent = '新規顧客の登録';
    document.getElementById('cust-name').value = '';
    document.getElementById('cust-name').disabled = false;
    document.getElementById('cust-tel').value = '';
    document.getElementById('cust-tel').disabled = false;

    custCountInModal = 1;
    document.getElementById('cust-count-display').textContent = custCountInModal;
    document.getElementById('cust-blocked').checked = false;

    document.getElementById('modal-customer').style.display = 'flex';
}

function openEditCustomerModal(name, tel) {
    const cust = state.customers.find(c => c.name === name && c.tel === tel);
    if (!cust) return;

    state.custModalMode = 'edit';
    state.editingCustOriginalName = name;
    state.editingCustOriginalTel = tel;

    document.getElementById('customer-modal-title').textContent = '顧客情報の編集';
    document.getElementById('cust-name').value = name;
    document.getElementById('cust-name').disabled = true;
    document.getElementById('cust-tel').value = tel.replace(/[^\d]/g, '');
    document.getElementById('cust-tel').disabled = true;

    custCountInModal = parseInt(cust.changeCount || 0, 10);
    document.getElementById('cust-count-display').textContent = custCountInModal;
    document.getElementById('cust-blocked').checked = (cust.isBlocked === true || cust.isBlocked === "true" || cust.isBlocked === "TRUE");

    document.getElementById('modal-customer').style.display = 'flex';
}

function adjustCustCount(delta) {
    custCountInModal = Math.max(0, custCountInModal + delta);
    document.getElementById('cust-count-display').textContent = custCountInModal;

    if (custCountInModal >= 2) {
        document.getElementById('cust-blocked').checked = true;
    } else if (custCountInModal < 2) {
        document.getElementById('cust-blocked').checked = false;
    }
}

async function saveCustomer() {
    const name = document.getElementById('cust-name').value.trim().replace(/\s+/g, "");
    const tel = document.getElementById('cust-tel').value.trim().replace(/[^\d]/g, "");
    const isBlocked = document.getElementById('cust-blocked').checked;

    if (!name || !tel) {
        alert("名前と電話番号を入力してください。");
        return;
    }

    const btn = document.querySelector("#modal-customer .btn-primary");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.classList.add("btn-loading");

    const customerData = {
        action: 'updateCustomer',
        name,
        tel,
        changeCount: custCountInModal,
        isBlocked: isBlocked
    };

    if (CONFIG.API_URL_ALL) {
        try {
            const res = await apiFetch(CONFIG.API_URL_CUSTOMERS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(customerData)
            });
            if (!res.ok) throw new Error("Save customer failed");
            showToast("顧客情報を保存しました");
        } catch (e) {
            console.error("Save customer error:", e);
            showToast("同期エラー：保存に失敗しました。", "var(--rose)");
            btn.disabled = false;
            btn.classList.remove("btn-loading");
            btn.textContent = originalText;
            return;
        }
    } else {
        if (state.custModalMode === 'add') {
            state.customers.push({
                name,
                tel: formatPhoneNumber(tel),
                changeCount: custCountInModal,
                isBlocked,
                lastUpdated: formatReceivedFull(new Date().toString())
            });
        } else {
            const cust = state.customers.find(c => c.name === state.editingCustOriginalName && c.tel === state.editingCustOriginalTel);
            if (cust) {
                cust.changeCount = custCountInModal;
                cust.isBlocked = isBlocked;
                cust.lastUpdated = formatReceivedFull(new Date().toString());
            }
        }
        showToast("顧客情報を保存しました（デモモード）");
    }

    btn.disabled = false;
    btn.classList.remove("btn-loading");
    btn.textContent = originalText;
    closeModal('modal-customer');
    loadData();
    renderCustomers();
}

async function deleteCustomer(name, tel) {
    if (!confirm(`${name} 様の顧客データを削除しますか？\n(スプレッドシートの履歴から削除されます)`)) return;

    if (CONFIG.API_URL_ALL) {
        showToast("同期中...");
        try {
            const res = await apiFetch(CONFIG.API_URL_CUSTOMERS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    action: 'deleteCustomer',
                    name,
                    tel: tel.replace(/[^\d]/g, '')
                })
            });
            if (!res.ok) throw new Error("Delete failed");
            showToast("顧客データを削除しました");
            loadData();
        } catch (e) {
            console.error("Delete customer error:", e);
            showToast("同期エラー：削除に失敗しました。", "var(--rose)");
            setSyncStatus('同期エラー', 'var(--rose)');
        }
    } else {
        state.customers = state.customers.filter(c => !(c.name === name && c.tel === tel));
        showToast("顧客データを削除しました（デモモード）");
        renderCustomers();
    }
}

async function revertStatusToPending() {
    const a = state.selectedAppt;
    if (!a) return;

    if (!confirm("本当にこの予約確定を取り消して、未処理の状態に戻しますか？\n（患者の変更回数のカウントも自動的に1回差し引かれます）")) return;

    if (CONFIG.API_URL_ALL && !a.isManual) {
        showToast("同期中...");
        try {
            const res = await apiFetch(CONFIG.API_URL_CUSTOMERS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    action: 'updateStatus',
                    id: a.id,
                    status: 'pending',
                    confirmedData: {
                        date: '',
                        time: '',
                        script: ''
                    }
                })
            });
            if (!res.ok) throw new Error("Sync failed");
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            showToast("未処理に戻しました");
            closeModal('modal-confirm');
            loadData();
        } catch (e) {
            console.error("Revert error:", e);
            showToast("同期エラーが発生しました", "var(--rose)");
        }
    } else {
        a.status = 'pending';
        a.confirmedData = null;
        if (a.isManual) saveManualApptsToLocalStorage();
        showToast("未処理に戻しました");
        closeModal('modal-confirm');
        renderAll();
    }
}

function initRangeSelectors() {
    const startSelect = document.getElementById('range-start');
    const endSelect = document.getElementById('range-end');
    if (!startSelect || !endSelect) return;
    
    startSelect.innerHTML = '';
    endSelect.innerHTML = '';
    
    for (let h = 10; h <= 20; h++) {
        for (let m = 0; m < 60; m += 15) {
            if (h === 20 && m > 0) continue;
            const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            startSelect.add(new Option(timeStr, timeStr));
            endSelect.add(new Option(timeStr, timeStr));
        }
    }
}

function renderTimeSlotsBlocker(dateKey) {
    const container = document.getElementById('time-matrix-container');
    if (!container) return;
    container.innerHTML = '';

    const isHoliday = !!state.holidays[dateKey];
    
    let html = '<table class="time-matrix">';
    html += '<tr><th></th><th>00</th><th>15</th><th>30</th><th>45</th></tr>';

    for (let h = 10; h <= 20; h++) {
        if(h === 20) {
            html += `<tr><th>20時</th>`;
            const timeStr = '20:00';
            const slotKey = `${dateKey}_${timeStr}`;
            const isBlocked = state.blockedSlots.includes(slotKey);
            let cls = isHoliday ? 'holiday-mode' : (isBlocked ? 'blocked' : '');
            html += `<td class="${cls}" onclick="toggleBlockedSlot('${slotKey}')"></td><td colspan="3"></td></tr>`;
            break;
        }

        html += `<tr><th>${h}時</th>`;
        for (let m = 0; m < 60; m += 15) {
            const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            const slotKey = `${dateKey}_${timeStr}`;
            const isBlocked = state.blockedSlots.includes(slotKey);
            
            let cls = isHoliday ? 'holiday-mode' : (isBlocked ? 'blocked' : '');
            
            html += `<td class="${cls}" onclick="toggleBlockedSlot('${slotKey}')"></td>`;
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
        alert('開始時刻は終了時刻より前に設定してください。');
        return;
    }

    const slots = [];
    for (let h = 10; h <= 20; h++) {
        for (let m = 0; m < 60; m += 15) {
            if (h === 20 && m > 0) continue;
            const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            if (timeStr >= start && timeStr < end) {
                slots.push(`${state.selectedCalDate}_${timeStr}`);
            }
        }
    }
    bulkToggleBlocks(slots, 'add');
};

async function toggleBlockedSlot(slotKey) {
    const isBlocked = state.blockedSlots.includes(slotKey);
    const action = isBlocked ? 'delete' : 'add';

    if (isBlocked) {
        state.blockedSlots = state.blockedSlots.filter(s => s !== slotKey);
    } else {
        state.blockedSlots.push(slotKey);
    }
    renderTimeSlotsBlocker(slotKey.split('_')[0]);

    try {
        const res = await apiFetch('https://reserve-pro-dashboard.onrender.com/api/blocked-slots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, slotKey })
        });
        if (!res.ok) throw new Error('Sync failed');
    } catch (e) {
        console.error('Blocked slot sync error:', e);
        showToast('同期エラー', 'var(--rose)');
        loadData();
    }
}

async function bulkToggleBlocks(slotsToToggle, action) {
    if (!slotsToToggle.length) return;
    
    const originalSlots = [...state.blockedSlots];
    if (action === 'add') {
        const newSlots = new Set([...state.blockedSlots, ...slotsToToggle]);
        state.blockedSlots = Array.from(newSlots);
    } else {
        state.blockedSlots = state.blockedSlots.filter(s => !slotsToToggle.includes(s));
    }
    renderTimeSlotsBlocker(state.selectedCalDate);

    try {
        const promises = slotsToToggle.map(slotKey => {
            return apiFetch('https://reserve-pro-dashboard.onrender.com/api/blocked-slots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slotKey, action })
            });
        });
        await Promise.all(promises);
    } catch (e) {
        console.error('Bulk toggle sync error:', e);
        state.blockedSlots = originalSlots;
        renderTimeSlotsBlocker(state.selectedCalDate);
        showToast('同期エラー', 'var(--rose)');
    }
}

window.clearAllBlocks = function() {
    if (!state.selectedCalDate || state.holidays[state.selectedCalDate]) return;
    const slots = [];
    for (let h = 10; h <= 20; h++) {
        for (let m = 0; m < 60; m += 15) {
            if (h === 20 && m > 0) continue;
            slots.push(`${state.selectedCalDate}_${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        }
    }
    bulkToggleBlocks(slots, 'delete');
};

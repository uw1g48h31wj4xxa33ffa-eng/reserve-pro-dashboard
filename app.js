/**
 * Reserve Pro - Holiday Calendar Logic
 */

// ── CONFIGURATION ──
const CONFIG = {
    GAS_URL: "/api/holidays", // デプロイ・ローカル両対応の相対パス
    DOW_JA: ["日", "月", "火", "水", "木", "金", "土"]
};

// ── STATE ──
let state = {
    holidays: {},
    blockedSlots: [],
    curYear: new Date().getFullYear(),
    curMonth: new Date().getMonth(),
    selectedCalDate: null,

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
    if (res.status === 401) { showLoginModal(); throw new Error('Unauthorized'); }
    if (res.status === 403) { showToast('権限がありません。', 'var(--rose)'); throw new Error('Forbidden'); }
    return res;
}

async function handleLogin() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('userRole', data.role);
            document.getElementById('login-modal').style.display = 'none';
            applyRBAC();
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
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    document.getElementById('login-modal').style.display = 'flex';
}

function applyRBAC() {
    const role = getAuthRole();
    const isAdmin = role === 'admin';
    const lockBtn = (btn) => { if(btn) { btn.disabled = !isAdmin; btn.style.opacity = isAdmin ? '1' : '0.5'; } };
    
    // スタッフ権限の場合は編集ボタンを無効化（UIマスキング）
    lockBtn(document.querySelector("#selected-date-info button"));
    lockBtn(document.querySelector("button[onclick='blockSelectedRange()']"));
    lockBtn(document.querySelector("button[onclick='clearAllBlocks()']"));
    document.querySelectorAll('.btn-delete-h').forEach(lockBtn);
}

// ── INITIALIZATION ──
window.onload = () => {
    if (!localStorage.getItem('jwtToken')) {
        showLoginModal();
    } else {
        applyRBAC();
        loadData();
    }
    renderCalendar();
    renderTimeSlotsBlocker(state.selectedCalDate);
    setInterval(() => { if(localStorage.getItem('jwtToken')) loadData(); }, 1 * 60 * 1000);
};

// ── DATA LOADING ──
async function loadData() {
    initRangeSelectors();
    if (state.retryTimer) {
        clearTimeout(state.retryTimer);
        state.retryTimer = null;
    }

    setSyncStatus('同期中...', 'var(--amber)');

    if (!CONFIG.GAS_URL) {
        // デモ用ダミーデータ
        console.warn("GAS_URL is not set. Loading dummy data.");
        simulateDummyData();
        renderAll();
        setSyncStatus('デモモード', 'var(--primary)');
        return;
    }

    try {
        const res = await apiFetch(`${CONFIG.GAS_URL}?action=getAll`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        // holidaysとblockedSlotsを抽出して格納
        state.holidays = data.holidays || {};
        state.blockedSlots = data.blockedSlots || [];
        
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

// ── RENDERING ──
function renderAll() {
    renderCalendar();
    renderHolidayList();
    applyRBAC();
}

// ── CALENDAR LOGIC ──
function renderCalendar() {
    const y = state.curYear, m = state.curMonth;
    const monthsEng = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    document.getElementById("cal-month-title").textContent = `${monthsEng[m]} ${y}`;

    const container = document.getElementById("calendar-grid");
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
    document.getElementById("selected-date-info").style.display = "block";
    renderTimeSlotsBlocker(key);
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
    const container = document.getElementById("time-matrix-container");
    if (!container) return;
    container.innerHTML = "";

    const isHoliday = !!state.holidays[dateKey];
    
    let html = '<table class="time-matrix">';
    html += '<tr><th></th><th>00</th><th>15</th><th>30</th><th>45</th></tr>';

    for (let h = 10; h <= 20; h++) {
        if(h === 20) {
            html += `<tr><th>20時</th>`;
            const timeStr = '20:00';
            const slotKey = `${dateKey}_${timeStr}`;
            const isBlocked = state.blockedSlots.includes(slotKey);
            let cls = isHoliday ? "holiday-mode" : (isBlocked ? "blocked" : "");
            html += `<td class="${cls}" onclick="toggleBlockedSlot('${slotKey}')"></td><td colspan="3"></td></tr>`;
            break;
        }

        html += `<tr><th>${h}時</th>`;
        for (let m = 0; m < 60; m += 15) {
            const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            const slotKey = `${dateKey}_${timeStr}`;
            const isBlocked = state.blockedSlots.includes(slotKey);
            
            let cls = isHoliday ? "holiday-mode" : (isBlocked ? "blocked" : "");
            
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
        alert("開始時刻は終了時刻より前に設定してください。");
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

    // 楽観的UI更新
    if (isBlocked) {
        state.blockedSlots = state.blockedSlots.filter(s => s !== slotKey);
    } else {
        state.blockedSlots.push(slotKey);
    }
    renderTimeSlotsBlocker(slotKey.split('_')[0]);

    try {
        const res = await apiFetch(`${CONFIG.GAS_URL.replace('/api/holidays', '/api/blocked-slots')}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, slotKey })
        });
        if (!res.ok) throw new Error("Sync failed");
    } catch (e) {
        console.error("Blocked slot sync error:", e);
        showToast("同期エラー", "var(--rose)");
        loadData(); // ロールバック
    }
}

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
            return apiFetch(`${CONFIG.GAS_URL.replace('/api/holidays', '/api/blocked-slots')}`, {
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
            slots.push(`${state.selectedCalDate}_${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
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
            slots.push(`${state.selectedCalDate}_${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
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
            slots.push(`${state.selectedCalDate}_${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        }
    }
    bulkToggleBlocks(slots, 'delete');
};


async function toggleHoliday() {
    const key = state.selectedCalDate;
    if (!key) return;

    const memo = document.getElementById("h-memo-input").value;
    const btn = document.querySelector("#selected-date-info button");
    const originalText = btn.textContent;

    // ボタンを無効化しローディング表示
    btn.disabled = true;
    btn.classList.add("btn-loading");

    const action = (state.holidays[key] && !memo) ? 'deleteHoliday' : 'addHoliday';

    // サーバーへ送信
    if (CONFIG.GAS_URL) {
        try {
            const res = await apiFetch(CONFIG.GAS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: action, date: key, memo: memo })
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
        showToast("解除しました");
    } else {
        state.holidays[key] = { memo };
        showToast("登録しました");
    }

    btn.disabled = false;
    btn.classList.remove("btn-loading");
    btn.textContent = originalText;

    renderAll();
}

function renderHolidayList() {
    const container = document.getElementById("h-list-items");
    const keys = Object.keys(state.holidays).sort();
    document.getElementById("h-count-badge").textContent = `${keys.length} 件`;

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

    if (CONFIG.GAS_URL) {
        try {
            const res = await apiFetch(CONFIG.GAS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
function showToast(msg, color = "var(--emerald)") {
    // 簡易的な通知実装
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed; bottom:40px; left:50%; transform:translateX(-50%); background:${color}; color:white; padding:12px 24px; border-radius:99px; font-weight:700; z-index:2000; box-shadow:0 8px 24px rgba(0,0,0,0.2); animation:modalIn 0.3s;`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = '0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// ── DUMMY DATA ──
function simulateDummyData() {
    state.holidays = { "2026-05-20": { memo: "院長学会出席" } };
}

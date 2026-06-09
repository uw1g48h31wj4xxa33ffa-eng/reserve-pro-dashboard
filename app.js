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
    if (banner) { banner.style.display = 'none'; }

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

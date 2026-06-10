/**
 * Ultimate Reserve Pro - Dashboard Logic (Mobile-Compatible Version)
 */

// 笏笏 CONFIGURATION 笏笏
const CONFIG = {
    API_URL_ALL: "https://reserve-pro-dashboard.onrender.com/api/all",
    API_URL_STATUS: "https://reserve-pro-dashboard.onrender.com/api/appointments/status",
    API_URL_CUSTOMERS: "https://reserve-pro-dashboard.onrender.com/api/customers",
    API_URL_HOLIDAYS: "https://reserve-pro-dashboard.onrender.com/api/holidays",
    DOW_JA: ["譌･", "譛・, "轣ｫ", "豌ｴ", "譛ｨ", "驥・, "蝨・],
    HOURS: { start: 10, end: 20 }
};

// 笏笏 STATE 笏笏
let state = {
    appts: [],
    holidays: {},
    customers: [], // 鬘ｧ螳｢邂｡逅・Μ繧ｹ繝・    currentView: 'requests',
    filterAccount: 'all',
    searchQuery: '',
    searchCustomerQuery: '', // 鬘ｧ螳｢讀懃ｴ｢逕ｨ

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

// 笏笏 AUTH LOGIC 笏笏
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
    if (res.status === 403) { showToast('讓ｩ髯舌′縺ゅｊ縺ｾ縺帙ｓ縲・, 'var(--rose)'); throw new Error('Forbidden'); }
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
            // 繝ｭ繧ｰ繧､繝ｳ謌仙粥・壹Δ繝ｼ繝繝ｫ繧帝國縺励※繝繝・す繝･繝懊・繝峨ｒ蛻晄悄蛹・            const lm = document.getElementById('login-modal');
            if (lm) lm.style.cssText = 'display:none !important;';
            applyRBAC();
            renderCalendar();
            loadData();
        } else {
            alert(data.error);
        }
    } catch(e) { console.error(e); alert('繝ｭ繧ｰ繧､繝ｳ縺ｫ螟ｱ謨励＠縺ｾ縺励◆'); }
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
    
    // 繧ｹ繧ｿ繝・ヵ讓ｩ髯舌・蝣ｴ蜷医・邱ｨ髮・・繧ｿ繝ｳ繧堤┌蜉ｹ蛹厄ｼ・I繝槭せ繧ｭ繝ｳ繧ｰ・・    lockBtn(document.querySelector("#selected-date-info button"));
    document.querySelectorAll('.btn-delete-h').forEach(lockBtn);
    document.querySelectorAll('.btn-danger').forEach(lockBtn);
    const cb = document.getElementById('btn-submit-confirm');
    if(cb) lockBtn(cb);
}

// 笏笏 INITIALIZATION 笏笏
window.onload = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        // 譛ｪ繝ｭ繧ｰ繧､繝ｳ縺ｮ蝣ｴ蜷茨ｼ壹Δ繝ｼ繝繝ｫ繧貞ｼｷ蛻ｶ陦ｨ遉ｺ
        const lm = document.getElementById('login-modal');
        if (lm) {
            lm.style.cssText = 'display:flex !important; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); z-index:9999; justify-content:center; align-items:center;';
        }
    } else {
        // 繝ｭ繧ｰ繧､繝ｳ貂医∩・夂判髱｢繧貞・譛溷喧
        applyRBAC();
        renderCalendar();
        loadData();
    }
    // 螳壽悄逧・↑譖ｴ譁ｰ (1蛻・＃縺ｨ)
    setInterval(() => { if(localStorage.getItem('jwtToken')) loadData(); }, 1 * 60 * 1000);
};

function renderAccountList() {
    // 隍・焚繧｢繧ｫ繧ｦ繝ｳ繝・I蜑企勁縺ｫ繧医ｊ辟｡蜉ｹ蛹・}

// 笏笏 DATA LOADING 笏笏
async function loadData() {
    initRangeSelectors();
    if (state.retryTimer) {
        clearTimeout(state.retryTimer);
        state.retryTimer = null;
    }

    setSyncStatus('蜷梧悄荳ｭ...', 'var(--amber)');

    if (!CONFIG.API_URL_ALL) {
        // 繝・Δ逕ｨ繝繝溘・繝・・繧ｿ
        console.warn("GAS_URL is not set. Loading dummy data.");
        simulateDummyData();
        renderAll();
        setSyncStatus('繝・Δ繝｢繝ｼ繝・, 'var(--primary)');
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
        renderAll();
        setSyncStatus('蜷梧悄螳御ｺ・, 'var(--emerald)');
        state.retryCount = 0; // 謌仙粥縺励◆縺ｮ縺ｧ繝ｪ繧ｻ繝・ヨ
    } catch (e) {
        console.error("Fetch error:", e);
        setSyncStatus('蜷梧悄繧ｨ繝ｩ繝ｼ', 'var(--rose)');

        // 閾ｪ蜍墓欠謨ｰ繝舌ャ繧ｯ繧ｪ繝輔Μ繝医Λ繧､ (10遘偵・0遘偵・0遘偵∵怙螟ｧ60遘・
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

    // 蜷梧悄繧ｨ繝ｩ繝ｼ隴ｦ蜻翫ヰ繝翫・縺ｮ蛻ｶ蠕｡
    const banner = document.getElementById('sync-error-banner');
    if (banner) {
        if (text === '蜷梧悄繧ｨ繝ｩ繝ｼ') {
            banner.style.display = 'flex';
            banner.style.background = 'linear-gradient(135deg, var(--rose), #e11d48)';
            banner.style.boxShadow = '0 4px 12px rgba(244, 63, 94, 0.2)';
            banner.textContent = `笞・・繧ｹ繝励Ξ繝・ラ繧ｷ繝ｼ繝医→縺ｮ蜷梧悄縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲よ磁邯壹ｒ遒ｺ隱阪＠縲√％縺薙ｒ繧ｯ繝ｪ繝・け縺励※蜀崎ｩｦ陦後＠縺ｦ縺上□縺輔＞・郁・蜍輔Μ繝医Λ繧､荳ｭ...・峨Ａ;
        } else if (text === '蜷梧悄荳ｭ...') {
            banner.style.display = 'flex';
            banner.style.background = 'linear-gradient(135deg, var(--amber), #d97706)';
            banner.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.2)';
            banner.textContent = `笞｡ 繧ｹ繝励Ξ繝・ラ繧ｷ繝ｼ繝医→蜷梧悄縺励※縺・∪縺・..`;
        } else {
            banner.style.display = 'none';
        }
    }
}

// 笏笏 RENDERING 笏笏
function renderAll() {
    renderStats();
    renderTable();
    renderCalendar();
    renderHolidayList();
    renderCustomers();
}

function showView(viewId) {
    state.currentView = viewId;

    // UI縺ｮ蛻・ｊ譖ｿ縺・    document.querySelectorAll('.view-container').forEach(el => el.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');

    // 繧ｵ繧､繝峨ヰ繝ｼ縺ｮ蛻・ｊ譖ｿ縺・(PC逕ｨ)
    document.querySelectorAll('aside .nav-item').forEach(el => el.classList.remove('active'));
    const navItems = document.querySelectorAll('aside .nav-section:first-of-type .nav-item');
    
    // 繝懊ヨ繝繝翫ン縺ｮ蛻・ｊ譖ｿ縺・(繧ｹ繝槭・逕ｨ)
    document.querySelectorAll('.mobile-nav-item').forEach(el => el.classList.remove('active'));

    if (viewId === 'requests') {
        if (navItems.length > 0) navItems[0].classList.add('active');
        const mobileReqBtn = document.getElementById('mobile-nav-requests');
        if (mobileReqBtn) mobileReqBtn.classList.add('active');
        document.getElementById('page-title').textContent = '莠育ｴ・筏隲倶ｸ隕ｧ';
    } else if (viewId === 'calendar') {
        if (navItems.length > 1) navItems[1].classList.add('active');
        const mobileCalBtn = document.getElementById('mobile-nav-calendar');
        if (mobileCalBtn) mobileCalBtn.classList.add('active');
        document.getElementById('page-title').textContent = '荳榊ｮ壻ｼ代・莠育ｴ・棧繧ｫ繝ｬ繝ｳ繝繝ｼ險ｭ螳・;
    } else if (viewId === 'customers') {
        if (navItems.length > 2) navItems[2].classList.add('active');
        const mobileCustBtn = document.getElementById('mobile-nav-customers');
        if (mobileCustBtn) mobileCustBtn.classList.add('active');
        document.getElementById('page-title').textContent = '鬘ｧ螳｢繝ｻ繝悶Ο繝・け邂｡逅・;
        renderCustomers();
    }

    if (viewId === 'calendar') renderCalendar();
}

function renderStats() {
    const pending = state.appts.filter(a => a.status === 'pending').length;
    const phone = state.appts.filter(a => a.status === 'phone').length;
    const doneToday = state.appts.filter(a => a.status === 'done').length; // 譛ｬ譚･縺ｯ譌･莉倥メ繧ｧ繝・け
    const hols = Object.keys(state.holidays).length;

    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-phone').textContent = phone;
    document.getElementById('stat-done').textContent = doneToday;
    document.getElementById('stat-holidays').textContent = hols;
}

function renderTable() {
    const tbody = document.getElementById('request-tbody');
    let list = state.appts;

    // 繝輔ぅ繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ

    if (state.searchQuery) {
        list = list.filter(a => a.name.includes(state.searchQuery));
    }

    document.getElementById('request-count').textContent = `${list.length} 莉ｶ`;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:80px; color:var(--text-dim)">隧ｲ蠖薙☆繧狗筏隲九・縺ゅｊ縺ｾ縺帙ｓ</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(a => {
        const statusClass = a.status === 'pending' ? 'tag-blue' : (a.status === 'phone' ? 'tag-amber' : 'tag-emerald');
        const statusText = a.status === 'pending' ? '竚・譛ｪ蜃ｦ逅・ : (a.status === 'phone' ? '到 隕・崕隧ｱ' : '笨・遒ｺ螳壽ｸ・);

        return `
            <tr class="request-row fade-in" onclick="handleRowClick('${a.id}')">
                <td>
                    <div class="patient-info">
                        <div class="avatar">${a.name[0]}</div>
                        <div>
                            <div class="p-name">
                                ${a.name}
                                ${a.displayCount === 2 ? '<span style="color:var(--amber); font-size:0.6rem; font-weight:bold;">[2蝗樒岼]</span>' : ''}
                                ${a.displayCount >= 3 ? '<span style="color:var(--rose); font-size:0.6rem; font-weight:bold;">[3蝗樒岼(隕・崕隧ｱ)]</span>' : ''}
                            </div>
                            <div class="p-meta">${a.lineAccount} / ${a.tel || '--'}${a.referral ? ` / 邏ｹ莉・ ${a.referral}` : ''}</div>
                        </div>
                    </div>
                </td>
                <td style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted)">
                    ${a.receivedFull}
                </td>
                <td>
                    <div style="font-size: 0.85rem;">
                        ${a.choices.slice(0, 1).map(c => `
                            <div><span style="color:var(--primary); font-weight:700;">隨ｬ1:</span> ${c.date} ${c.rangeLabel}</div>
                        `).join('')}
                        ${a.choices.length > 1 ? `<div style="color:var(--text-dim); font-size:0.75rem;">+ 莉・${a.choices.length - 1} 縺､縺ｮ蟶梧悍</div>` : ''}
                    </div>
                </td>
                <td>
                    <span class="tag ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <button class="btn-primary" style="padding: 8px 16px; font-size: 0.75rem;">
                        ${a.status === 'done' ? '隧ｳ邏ｰ' : '蜃ｦ逅・ｒ髢句ｧ・}
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// 笏笏 INTERACTIONS 笏笏
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

// 笏笏 CONFIRM MODAL 笏笏
function openConfirmModal(a) {
    state.selectedAppt = a;
    state.selectedChoiceIdx = 0;
    state.selectedSlot = null;
    state.manualDate = null;
    state.timeStep = 30;

    document.getElementById('modal-p-name').textContent = `${a.name} 讒倭;
    let metaText = `${a.lineAccount} / 逕ｳ隲句女莉・ ${a.receivedFull}`;
    if (a.referral) {
        metaText += ` / 邏ｹ莉・ ${a.referral}`;
    }
    document.getElementById('modal-p-meta').textContent = metaText;

    // 閾ｪ逕ｱ驕ｸ謚槭お繝ｪ繧｢縺ｮ蛻晄悄蛹・    document.getElementById('manual-date-container').style.display = 'none';
    document.getElementById('manual-date-input').value = '';

    // 譎る俣繧ｹ繝・ャ繝励ヨ繧ｰ繝ｫ縺ｮ蛻晄悄蛹・    document.querySelectorAll('.step-btn').forEach(btn => btn.classList.remove('active'));
    const step30Btn = document.getElementById('step-30-btn');
    if (step30Btn) step30Btn.classList.add('active');
    const pickerLabel = document.getElementById('slot-picker-label');
    if (pickerLabel) pickerLabel.textContent = '遒ｺ螳壽凾髢・(30蛻・腰菴・';

    renderChoiceTabs(a);
    renderSlotPicker();
    updateScriptPreview();

    document.getElementById('modal-confirm').style.display = 'flex';
    const isDone = a.status === 'done';
    validateConfirmForm();
    
    // 縲梧悴蜃ｦ逅・↓謌ｻ縺吶阪・繧ｿ繝ｳ縺ｮ陦ｨ遉ｺ蛻ｶ蠕｡
    const revertBtn = document.getElementById('btn-revert-confirm');
    if (revertBtn) {
        revertBtn.style.display = isDone ? 'block' : 'none';
    }
    
    // 繧ｭ繝｣繝ｳ繧ｻ繝ｫ繝懊ち繝ｳ縺ｮ繝・く繧ｹ繝亥､画峩・育｢ｺ螳壽ｸ医・蝣ｴ蜷医・縲碁哩縺倥ｋ縲搾ｼ・    const cancelBtn = document.getElementById('btn-cancel-confirm');
    if (cancelBtn) {
        cancelBtn.textContent = isDone ? '髢峨§繧・ : '繧ｭ繝｣繝ｳ繧ｻ繝ｫ';
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
                <div style="font-size:0.6rem; font-weight:800; opacity:0.7;">隨ｬ${i + 1}蟶梧悍</div>
                <div style="font-size:0.85rem; font-weight:700;">${c.date}</div>
                <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">${c.rangeLabel || ''}</div>
                ${isClosed ? '<div style="font-size:0.6rem; color:var(--rose)">莨題ｨｺ譌･</div>' : ''}
            </div>
        `;
    }).join('');

    // 閾ｪ逕ｱ驕ｸ謚槭ち繝悶ｒ霑ｽ蜉
    const manualActive = state.selectedChoiceIdx === 3 ? 'border-color:var(--primary); background:rgba(59,130,246,0.1); color:var(--primary);' : '';
    html += `
        <div style="padding:10px; border:1px solid var(--border); border-radius:10px; text-align:center; cursor:pointer; transition:var(--transition); ${manualActive}" 
             onclick="selectChoice(3)">
            <div style="font-size:0.6rem; font-weight:800; opacity:0.7;">笨ｨ 閾ｪ逕ｱ驕ｸ謚・/div>
            <div style="font-size:0.85rem; font-weight:700;">譌･莉俶欠螳・/div>
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
    // YYYY-MM-DD 繧・M/D(譖・ 蠖｢蠑上↓螟画鋤
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
        container.innerHTML = '<div style="grid-column:1/-1; color:var(--text-dim); font-size:0.8rem; text-align:center; padding:20px;">譌･莉倥ｒ驕ｸ謚槭＠縺ｦ縺上□縺輔＞</div>';
        return;
    }

    const isClosed = checkIsClosed(targetDate);
    if (isClosed) {
        const reason = isClosed === 'sunday' ? '譌･譖懈律' : '荳榊ｮ壻ｼ・;
        container.innerHTML = `<div style="grid-column:1/-1; color:var(--rose); font-size:0.85rem; font-weight:700; text-align:center; padding:20px;">莨題ｨｺ譌･縺ｮ縺溘ａ驕ｸ謚槭〒縺阪∪縺帙ｓ (${reason})</div>`;
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

    // 莠育ｴ・庄閭ｽ譎る俣縺ｯ 10:00縲・0:00 縺ｮ縺溘ａ縲〉ange.end 縺ｮ ":00"・井ｾ・ 20:00・峨ｒ譛蠕後↓霑ｽ蜉
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

    container.innerHTML = html || '<div style="grid-column:1/-1; color:var(--text-dim); font-size:0.8rem;">驕ｸ謚槫庄閭ｽ縺ｪ譫縺後≠繧翫∪縺帙ｓ</div>';
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

    // UI縺ｮ蛻・ｊ譖ｿ縺・    document.querySelectorAll('.step-btn').forEach(btn => btn.classList.remove('active'));
    if (step === 30) {
        const btn30 = document.getElementById('step-30-btn');
        if (btn30) btn30.classList.add('active');
        const label = document.getElementById('slot-picker-label');
        if (label) label.textContent = '遒ｺ螳壽凾髢・(30蛻・腰菴・';
    } else {
        const btn15 = document.getElementById('step-15-btn');
        if (btn15) btn15.classList.add('active');
        const label = document.getElementById('slot-picker-label');
        if (label) label.textContent = '遒ｺ螳壽凾髢・(15蛻・腰菴・';
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

    // 2026蟷ｴ繧・026/縺ｪ縺ｩ縺ｮ蟷ｴ陦ｨ險倥ｒ蜑企勁
    const cleanedTargetDate = targetDate.replace(/2026[\/\-蟷ｴ]?/g, '');

    // MMDD縺・譯√↓縺ｪ縺｣縺ｦ縺・ｋ蝣ｴ蜷医・0繧定｣懊▲縺ｦ4譯√↓縺吶ｋ
    const mmdd = String(a.receivedMMDD).padStart(4, '0');

    // Format: [蜿嶺ｿ｡MMDD][蜷榊燕][(繧｢繧ｫ繧ｦ繝ｳ繝・][螟・(螟画峩莠育ｴ・凾)][莠育ｴ・律(譖・][譎る俣]
    const isChange = a.type && a.type.includes("螟画峩");
    const hen = isChange ? "螟・ : "";
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

    // 譎る俣繧ｹ繝ｭ繝・ヨ縺碁∈謚槭＆繧後※縺・ｋ蝣ｴ蜷医・縺ｿ豢ｻ諤ｧ蛹・    const hasSlot = !!state.selectedSlot;
    btn.disabled = !hasSlot;
    btn.style.opacity = hasSlot ? '1' : '0.5';
    btn.style.cursor = hasSlot ? 'pointer' : 'not-allowed';
}

// 笏笏 PHONE MODAL 笏笏
function openPhoneModal(a) {
    state.selectedAppt = a;

    // MMDD縺・譯√↓縺ｪ縺｣縺ｦ縺・ｋ蝣ｴ蜷医・0繧定｣懊▲縺ｦ4譯√↓縺吶ｋ
    const mmdd = String(a.receivedMMDD).padStart(4, '0');

    // 邂｡逅・・∈縺ｮ謖・､ｺ
    document.getElementById('phone-script-admin').textContent = `${mmdd}${a.name}${a.lineAccount}隕・崕隧ｱ譯亥・`;

    // 繝ｦ繝ｼ繧ｶ繝ｼ縺ｸ縺ｮ螳壼梛譁・    const template = `${a.name} 讒禄n\n縺顔筏霎ｼ縺ｿ縺・◆縺縺阪≠繧翫′縺ｨ縺・＃縺悶＞縺ｾ縺吶・n隱縺ｫ諱舌ｌ蜈･繧翫∪縺吶′縲∫峩謗･蛹ｻ髯｢縺ｸ縺企崕隧ｱ縺ｫ縺ｦ縺秘｣邨｡繧偵♀鬘倥＞縺励※縺翫ｊ縺ｾ縺吶・n\n縺企崕隧ｱ蜿｣縺ｫ縺ｦ縲鍬INE縺ｧ縺ｮ螟画峩蟶梧悍縲阪→縺贋ｼ昴∴縺・◆縺縺代∪縺吶→繧ｹ繝繝ｼ繧ｺ縺ｧ縺吶・n\n縺ｩ縺・◇繧医ｍ縺励￥縺企｡倥＞縺・◆縺励∪縺吶Ａ;
    document.getElementById('phone-script-user').textContent = template;

    document.getElementById('modal-phone').style.display = 'flex';
}

// 笏笏 CALENDAR LOGIC 笏笏
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

    // 遨ｺ逋ｽ縺ｮ繧ｻ繝ｫ
    for (let i = 0; i < first; i++) html += `<div class="day-cell empty"></div>`;

    // 譌･莉倥・繧ｻ繝ｫ
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
    document.getElementById("h-date-label").textContent = `${d.getMonth() + 1}譛・{d.getDate()}譌･(${CONFIG.DOW_JA[d.getDay()]})`;
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

    // 繝懊ち繝ｳ繧堤┌蜉ｹ蛹悶＠繝ｭ繝ｼ繝・ぅ繝ｳ繧ｰ陦ｨ遉ｺ
    btn.disabled = true;
    btn.classList.add("btn-loading");

    // 繧ｵ繝ｼ繝舌・縺ｸ騾∽ｿ｡
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
            showToast("蜷梧悄繧ｨ繝ｩ繝ｼ・壹せ繝励Ξ繝・ラ繧ｷ繝ｼ繝医∈縺ｮ菫晏ｭ倥↓螟ｱ謨励＠縺ｾ縺励◆縲・, "var(--rose)");
            btn.disabled = false;
            btn.classList.remove("btn-loading");
            btn.textContent = originalText;
            setSyncStatus('蜷梧悄繧ｨ繝ｩ繝ｼ', 'var(--rose)');
            return;
        }
    }

    // 謌仙粥譎ゅ・縺ｿ繝ｭ繝ｼ繧ｫ繝ｫ迥ｶ諷九ｒ譖ｴ譁ｰ
    if (state.holidays[key] && !memo) {
        delete state.holidays[key];
        showToast("荳榊ｮ壻ｼ代ｒ隗｣髯､縺励∪縺励◆");
    } else {
        state.holidays[key] = { memo };
        showToast("荳榊ｮ壻ｼ代ｒ逋ｻ骭ｲ縺励∪縺励◆");
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
    if (countBadge) countBadge.textContent = `${keys.length} 莉ｶ`;

    if (keys.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-dim); font-size:0.85rem;">逋ｻ骭ｲ縺ｯ縺ゅｊ縺ｾ縺帙ｓ</div>';
        return;
    }

    container.innerHTML = keys.map(k => {
        const d = new Date(k);
        return `
            <div class="h-list-item">
                <div>
                    <div class="h-item-date">${d.getMonth() + 1}/${d.getDate()} (${CONFIG.DOW_JA[d.getDay()]})</div>
                    <div class="h-item-memo">${state.holidays[k].memo || '繝｡繝｢縺ｪ縺・}</div>
                </div>
                <button class="btn-delete-h" onclick="deleteHoliday('${k}')">ﾃ・/button>
            </div>
        `;
    }).join('');
}

async function deleteHoliday(key) {
    const originalHolidays = { ...state.holidays };

    // 讌ｽ隕ｳ逧ФI譖ｴ譁ｰ・育判髱｢荳翫・縺吶＄蜑企勁縺吶ｋ・・    delete state.holidays[key];
    renderAll();
    showToast("蜷梧悄荳ｭ...");

    if (CONFIG.API_URL_ALL) {
        try {
            const res = await apiFetch(CONFIG.API_URL_HOLIDAYS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ action: 'deleteHoliday', date: key })
            });
            if (!res.ok) throw new Error("Delete sync failed");
            showToast("蜑企勁縺励∪縺励◆");
        } catch (e) {
            console.error("Delete holiday sync error:", e);
            // 繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺溘ｉ蜈・・迥ｶ諷九↓繝ｭ繝ｼ繝ｫ繝舌ャ繧ｯ縺吶ｋ
            state.holidays = originalHolidays;
            renderAll();
            showToast("蜷梧悄繧ｨ繝ｩ繝ｼ・壼炎髯､縺ｮ蜷梧悄縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲・, "var(--rose)");
            setSyncStatus('蜷梧悄繧ｨ繝ｩ繝ｼ', 'var(--rose)');
        }
    } else {
        showToast("蜑企勁縺励∪縺励◆");
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

// 笏笏 UTILS 笏笏
function formatPhoneNumber(tel) {
    if (!tel) return "";
    let clean = String(tel).replace(/[^\d]/g, ""); // 謨ｰ蟄嶺ｻ･螟悶ｒ髯､蜴ｻ

    // 蜈磯ｭ縺ｮ0縺梧ｶ医∴縺ｦ縺・ｋ蝣ｴ蜷茨ｼ井ｾ・ "7022223333" -> "07022223333"・・    if (clean.length === 9 || clean.length === 10) {
        if (!clean.startsWith("0")) {
            clean = "0" + clean;
        }
    }

    // 11譯√・謳ｺ蟶ｯ髮ｻ隧ｱ・・90-1234-5678・峨・繝輔か繝ｼ繝槭ャ繝・    if (clean.length === 11) {
        return clean.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    // 10譯√・蝗ｺ螳夐崕隧ｱ・・3-1234-5678 縺ｪ縺ｩ・峨・繝輔か繝ｼ繝槭ャ繝・    if (clean.length === 10) {
        return clean.replace(/(\d{2,3})(\d{3,4})(\d{4})/, "$1-$2-$3");
    }

    return String(tel);
}

function formatReceivedFull(dateStr) {
    if (!dateStr) return "";
    if (dateStr.includes('GMT') || dateStr.includes('譌･譛ｬ讓呎ｺ匁凾') || /^[A-Za-z]{3}\s[A-Za-z]{3}/.test(dateStr)) {
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

    if (dateStr.includes('GMT') || dateStr.includes('譌･譛ｬ讓呎ｺ匁凾') || /^[A-Za-z]{3}\s[A-Za-z]{3}/.test(dateStr)) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            const month = d.getMonth() + 1;
            const day = d.getDate();
            const dow = CONFIG.DOW_JA[d.getDay()];
            return `${month}/${day}(${dow})`;
        }
    }

    // 蟷ｴ陦ｨ險・(2026/, 2026-, 2026蟷ｴ) 繧貞ｮ悟・縺ｫ蜑企勁縺励◆繧ｯ繝ｪ繝ｼ繝ｳ縺ｪ譁・ｭ怜・繧剃ｽ懊ｋ
    let cleaned = dateStr.replace(/20\d{2}[\/\-蟷ｴ]?/g, '').replace(/譌･$/, '').trim();

    // 縺吶〒縺ｫ繧ｫ繝・さ莉倥″縺ｮ譖懈律縺悟性縺ｾ繧後※縺・ｋ蝣ｴ蜷医・縲√き繝・さ繧貞濠隗偵↓邨ｱ荳縺励※縺昴・縺ｾ縺ｾ霑斐☆
    if (/\([譌･譛育↓豌ｴ譛ｨ驥大悄]\)/.test(cleaned) || /・・譌･譛育↓豌ｴ譛ｨ驥大悄]・・.test(cleaned)) {
        cleaned = cleaned.replace(/・・g, '(').replace(/・・g, ')');
        return cleaned;
    }

    // 譖懈律縺悟性縺ｾ繧後※縺・↑縺・ｴ蜷医√ヱ繝ｼ繧ｹ繧定ｩｦ縺ｿ繧・    let year = new Date().getFullYear();
    let month = 1;
    let day = 1;

    // 蜈・・譁・ｭ怜・縺九ｉ蟷ｴ繧呈歓蜃ｺ・医ｂ縺励≠繧後・・・    const yearMatch = dateStr.match(/(20\d{2})/);
    if (yearMatch) {
        year = parseInt(yearMatch[1], 10);
    }

    // 繧ｯ繝ｪ繝ｼ繝ｳ縺ｪ譁・ｭ怜・縺九ｉ譛域律繧呈歓蜃ｺ
    const mdMatch = cleaned.match(/(\d{1,2})[\/\-譛・(\d{1,2})/);
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

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function copyText(id) {
    const txt = document.getElementById(id).textContent;
    navigator.clipboard.writeText(txt);
    showToast("繧ｳ繝斐・縺励∪縺励◆");
}

function copyScript() {
    if (!state.selectedSlot) {
        showToast("譎る俣譫繧帝∈謚槭＠縺ｦ縺上□縺輔＞", "var(--rose)");
        return;
    }
    copyText('script-preview');
}

function showToast(msg, color = "var(--emerald)") {
    // 邁｡譏鍋噪縺ｪ騾夂衍螳溯｣・    const toast = document.createElement('div');
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

    // 譌･譖懈律繝√ぉ繝・け
    const d = new Date(year, month - 1, day);
    if (!isNaN(d.getTime()) && d.getDay() === 0) return 'sunday';

    // 荳榊ｮ壻ｼ代メ繧ｧ繝・け (YYYY-MM-DD蠖｢蠑上↓螟画鋤縺励※豈碑ｼ・
    const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (state.holidays[key]) return 'holiday';

    return false;
}

// 笏笏 ACTIONS 笏笏
async function submitFinal() {
    if (!state.selectedSlot) return;

    const a = state.selectedAppt;
    const script = document.getElementById('script-preview').textContent;
    const btn = document.getElementById('btn-submit-confirm');
    const originalText = btn.textContent;

    // 繧ｹ繝・・繧ｿ繧ｹ譖ｴ譁ｰ
    let targetDate;
    if (state.selectedChoiceIdx === 3) {
        targetDate = state.manualDate;
    } else {
        targetDate = a.choices[state.selectedChoiceIdx].date;
    }

    // 繝懊ち繝ｳ繧堤┌蜉ｹ蛹悶＠繝ｭ繝ｼ繝・ぅ繝ｳ繧ｰ陦ｨ遉ｺ
    btn.disabled = true;
    btn.classList.add("btn-loading");

    const confirmedData = { script, date: targetDate, time: state.selectedSlot };

    if (CONFIG.API_URL_ALL) {
        try {
            const res = await apiFetch(CONFIG.API_URL_STATUS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ action: 'updateStatus', id: a.id, status: 'done', confirmedData })
            });
            if (!res.ok) throw new Error("Sync failed");
        } catch (e) {
            console.error("Submit final sync error:", e);
            showToast("蜷梧悄繧ｨ繝ｩ繝ｼ・壹せ繝励Ξ繝・ラ繧ｷ繝ｼ繝医∈縺ｮ菫晏ｭ倥↓螟ｱ謨励＠縺ｾ縺励◆縲・, "var(--rose)");
            btn.disabled = false;
            btn.classList.remove("btn-loading");
            btn.textContent = originalText;
            setSyncStatus('蜷梧悄繧ｨ繝ｩ繝ｼ', 'var(--rose)');
            return; // 蜃ｦ逅・ｒ荳ｭ譁ｭ縺励√Δ繝ｼ繝繝ｫ縺ｯ髢峨§縺ｪ縺・        }
    }

    // 蜷梧悄謌仙粥譎ゅ・縺ｿ繝ｭ繝ｼ繧ｫ繝ｫ迥ｶ諷九ｒ譖ｴ譁ｰ縺励※繝｢繝ｼ繝繝ｫ繧帝哩縺倥ｋ
    a.status = 'done';
    a.confirmedData = confirmedData;

    btn.disabled = false;
    btn.classList.remove("btn-loading");
    btn.textContent = originalText;

    closeModal('modal-confirm');
    renderAll();
    showToast("莠育ｴ・｢ｺ螳壹ｒ菫晏ｭ倥＠縺ｾ縺励◆");
}

async function markAsPhoneProcessed() {
    const a = state.selectedAppt;
    const btn = document.querySelector("#modal-phone .btn-primary");
    const originalText = btn.textContent;

    // 繝懊ち繝ｳ繧堤┌蜉ｹ蛹悶＠繝ｭ繝ｼ繝・ぅ繝ｳ繧ｰ陦ｨ遉ｺ
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
            showToast("蜷梧悄繧ｨ繝ｩ繝ｼ・壹せ繝励Ξ繝・ラ繧ｷ繝ｼ繝医∈縺ｮ菫晏ｭ倥↓螟ｱ謨励＠縺ｾ縺励◆縲・, "var(--rose)");
            btn.disabled = false;
            btn.classList.remove("btn-loading");
            btn.textContent = originalText;
            setSyncStatus('蜷梧悄繧ｨ繝ｩ繝ｼ', 'var(--rose)');
            return; // 蜃ｦ逅・ｒ荳ｭ譁ｭ縺励√Δ繝ｼ繝繝ｫ縺ｯ髢峨§縺ｪ縺・        }
    }

    // 蜷梧悄謌仙粥譎ゅ・縺ｿ繝ｭ繝ｼ繧ｫ繝ｫ迥ｶ諷九ｒ譖ｴ譁ｰ縺励※繝｢繝ｼ繝繝ｫ繧帝哩縺倥ｋ
    a.status = 'done'; // 縺ｾ縺溘・ 'processed'

    btn.disabled = false;
    btn.classList.remove("btn-loading");
    btn.textContent = originalText;

    closeModal('modal-phone');
    renderAll();
    showToast("髮ｻ隧ｱ譯亥・貂医∩縺ｨ縺励※繝槭・繧ｯ縺励∪縺励◆");
}

// 笏笏 DUMMY DATA 笏笏
function simulateDummyData() {
    state.appts = [
        {
            id: "1", name: "繝・せ繝郁干蟄・, tel: "090-1111-2222", lineAccount: "(繝溘Λ邱・", receivedFull: "2026/05/15 10:20", receivedMMDD: "0515", status: "pending", isSecondChange: false, choices: [
                { date: "5/18(譛・", rangeLabel: "11:00縲・2:00", rangeStart: 11, rangeEnd: 12 },
                { date: "5/20(豌ｴ)", rangeLabel: "蜊亥ｾ・, rangeStart: 13, rangeEnd: 18 }
            ]
        },
        {
            id: "2", name: "繧ｵ繝ｳ繝励Ν螟ｪ驛・, tel: "080-3333-4444", lineAccount: "(繝溘Λc)", receivedFull: "2026/05/16 09:45", receivedMMDD: "0516", status: "pending", isSecondChange: true, choices: [
                { date: "5/22(驥・", rangeLabel: "邨よ律", rangeStart: 10, rangeEnd: 20 }
            ]
        },
        {
            id: "3", name: "菴占陸 蛛･", tel: "070-5555-6666", lineAccount: "(繝溘Λmo)", receivedFull: "2026/05/16 11:30", receivedMMDD: "0516", status: "phone", isSecondChange: true, choices: [
                { date: "5/25(譛・", rangeLabel: "蜊亥燕", rangeStart: 10, rangeEnd: 12 }
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
    state.holidays = { "2026-05-20": { memo: "荳榊ｮ壻ｼ・ } };
    state.customers = [
        { name: "繝・せ繝郁干蟄・, tel: "09011112222", changeCount: 1, isBlocked: false, lastUpdated: "2026/05/18 10:20" },
        { name: "繧ｵ繝ｳ繝励Ν螟ｪ驛・, tel: "08033334444", changeCount: 2, isBlocked: true, lastUpdated: "2026/05/18 11:30" }
    ];
}

// 笏笏 CUSTOMER MANAGEMENT FUNCTIONS 笏笏
let custCountInModal = 1;

function renderCustomers() {
    const tbody = document.getElementById('customer-tbody');
    if (!tbody) return;

    let list = state.customers || [];

    // 繝輔ぅ繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ
    if (state.searchCustomerQuery) {
        const q = state.searchCustomerQuery.toLowerCase();
        list = list.filter(c => c.name.includes(q) || c.tel.replace(/[^\d]/g, '').includes(q));
    }

    const countBadge = document.getElementById('customer-count');
    if (countBadge) {
        countBadge.textContent = `${list.length} 蜷港;
    }

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:80px; color:var(--text-dim)">隧ｲ蠖薙☆繧矩｡ｧ螳｢縺ｯ縺・∪縺帙ｓ</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(c => {
        const isBlocked = c.isBlocked === true || c.isBlocked === "true" || c.isBlocked === "TRUE";
        const blockClass = isBlocked ? 'tag-rose' : 'tag-emerald';
        const blockText = isBlocked ? '閥 繝悶Ο繝・け荳ｭ' : '泙 險ｱ蜿ｯ';
        const blockBtnText = isBlocked ? '隗｣髯､' : '繝悶Ο繝・け';

        // 莠育ｴ・､画峩蝗樊焚繧ｫ繧ｦ繝ｳ繝医・閭梧勹濶ｲ繧定ｨｭ螳夲ｼ・莉･荳翫・隴ｦ蜻願ｵ､・・        const actionCount = parseInt(c.changeCount || 0, 10);
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
                    <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px; margin-right: 6px;" onclick="openEditCustomerModal('${c.name}', '${c.tel}')">邱ｨ髮・/button>
                    <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px; color: var(--rose); border-color: var(--rose-glow);" onclick="deleteCustomer('${c.name}', '${c.tel}')">蜑企勁</button>
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

    // 讌ｽ隕ｳ逧・峩譁ｰ
    cust.changeCount = newCount;

    // 繧ゅ＠蝗樊焚縺・蝗樔ｻ･荳翫↓蠅励∴縺溘ｉ閾ｪ蜍輔ヶ繝ｭ繝・け縲・蝗樔ｻ･荳九↓貂帙▲縺溘ｉ閾ｪ蜍輔ヶ繝ｭ繝・け隗｣髯､縺ｫ縺吶ｋ
    let autoBlock = cust.isBlocked;
    if (newCount >= 2 && delta > 0) {
        autoBlock = true;
    } else if (newCount < 2 && delta < 0) {
        autoBlock = false;
    }
    cust.isBlocked = autoBlock;

    renderCustomers();

    if (CONFIG.API_URL_ALL) {
        showToast("蜷梧悄荳ｭ...");
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
            showToast("螟画峩蝗樊焚繧呈峩譁ｰ縺励∪縺励◆");
            loadData(); // 譛邨よ峩譁ｰ譌･譎よ峩譁ｰ縺ｮ縺溘ａ
        } catch (e) {
            console.error("Adjust count error:", e);
            cust.changeCount = originalCount; // 繝ｭ繝ｼ繝ｫ繝舌ャ繧ｯ
            renderCustomers();
            showToast("蜷梧悄繧ｨ繝ｩ繝ｼ・壹せ繝励Ξ繝・ラ繧ｷ繝ｼ繝医∈縺ｮ菫晏ｭ倥↓螟ｱ謨励＠縺ｾ縺励◆縲・, "var(--rose)");
            setSyncStatus('蜷梧悄繧ｨ繝ｩ繝ｼ', 'var(--rose)');
        }
    } else {
        showToast("螟画峩蝗樊焚繧呈峩譁ｰ縺励∪縺励◆・医ョ繝｢繝｢繝ｼ繝会ｼ・);
    }
}

async function toggleCustomerBlock(name, tel) {
    const cust = state.customers.find(c => c.name === name && c.tel === tel);
    if (!cust) return;

    let originalBlock = cust.isBlocked;
    let newBlock = !originalBlock;

    // 讌ｽ隕ｳ逧・峩譁ｰ
    cust.isBlocked = newBlock;
    renderCustomers();

    if (CONFIG.API_URL_ALL) {
        showToast("蜷梧悄荳ｭ...");
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
            showToast(newBlock ? "莠育ｴ・ｒ繝悶Ο繝・け縺励∪縺励◆" : "繝悶Ο繝・け繧定ｧ｣髯､縺励∪縺励◆");
            loadData();
        } catch (e) {
            console.error("Toggle block error:", e);
            cust.isBlocked = originalBlock; // 繝ｭ繝ｼ繝ｫ繝舌ャ繧ｯ
            renderCustomers();
            showToast("蜷梧悄繧ｨ繝ｩ繝ｼ・壹せ繝励Ξ繝・ラ繧ｷ繝ｼ繝医∈縺ｮ菫晏ｭ倥↓螟ｱ謨励＠縺ｾ縺励◆縲・, "var(--rose)");
            setSyncStatus('蜷梧悄繧ｨ繝ｩ繝ｼ', 'var(--rose)');
        }
    } else {
        showToast(newBlock ? "莠育ｴ・ｒ繝悶Ο繝・け縺励∪縺励◆・医ョ繝｢繝｢繝ｼ繝会ｼ・ : "繝悶Ο繝・け繧定ｧ｣髯､縺励∪縺励◆・医ョ繝｢繝｢繝ｼ繝会ｼ・);
    }
}

function openAddCustomerModal() {
    state.custModalMode = 'add';
    document.getElementById('customer-modal-title').textContent = '譁ｰ隕城｡ｧ螳｢縺ｮ逋ｻ骭ｲ';
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

    document.getElementById('customer-modal-title').textContent = '鬘ｧ螳｢諠・ｱ縺ｮ邱ｨ髮・;
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

    if (custCountInModal >= 2 && delta > 0) {
        document.getElementById('cust-blocked').checked = true;
    } else if (custCountInModal < 2 && delta < 0) {
        document.getElementById('cust-blocked').checked = false;
    }
}

async function saveCustomer() {
    const name = document.getElementById('cust-name').value.trim().replace(/\s+/g, "");
    const tel = document.getElementById('cust-tel').value.trim().replace(/[^\d]/g, "");
    const isBlocked = document.getElementById('cust-blocked').checked;

    if (!name || !tel) {
        alert("蜷榊燕縺ｨ髮ｻ隧ｱ逡ｪ蜿ｷ繧貞・蜉帙＠縺ｦ縺上□縺輔＞縲・);
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
            showToast("鬘ｧ螳｢諠・ｱ繧剃ｿ晏ｭ倥＠縺ｾ縺励◆");
        } catch (e) {
            console.error("Save customer error:", e);
            showToast("蜷梧悄繧ｨ繝ｩ繝ｼ・壻ｿ晏ｭ倥↓螟ｱ謨励＠縺ｾ縺励◆縲・, "var(--rose)");
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
        showToast("鬘ｧ螳｢諠・ｱ繧剃ｿ晏ｭ倥＠縺ｾ縺励◆・医ョ繝｢繝｢繝ｼ繝会ｼ・);
    }

    btn.disabled = false;
    btn.classList.remove("btn-loading");
    btn.textContent = originalText;
    closeModal('modal-customer');
    loadData();
    renderCustomers();
}

async function deleteCustomer(name, tel) {
    if (!confirm(`${name} 讒倥・鬘ｧ螳｢繝・・繧ｿ繧貞炎髯､縺励∪縺吶°・歃n(繧ｹ繝励Ξ繝・ラ繧ｷ繝ｼ繝医・螻･豁ｴ縺九ｉ蜑企勁縺輔ｌ縺ｾ縺・`)) return;

    if (CONFIG.API_URL_ALL) {
        showToast("蜷梧悄荳ｭ...");
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
            showToast("鬘ｧ螳｢繝・・繧ｿ繧貞炎髯､縺励∪縺励◆");
            loadData();
        } catch (e) {
            console.error("Delete customer error:", e);
            showToast("蜷梧悄繧ｨ繝ｩ繝ｼ・壼炎髯､縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲・, "var(--rose)");
            setSyncStatus('蜷梧悄繧ｨ繝ｩ繝ｼ', 'var(--rose)');
        }
    } else {
        state.customers = state.customers.filter(c => !(c.name === name && c.tel === tel));
        showToast("鬘ｧ螳｢繝・・繧ｿ繧貞炎髯､縺励∪縺励◆・医ョ繝｢繝｢繝ｼ繝会ｼ・);
        renderCustomers();
    }
}

async function revertStatusToPending() {
    const a = state.selectedAppt;
    if (!a) return;

    if (!confirm("譛ｬ蠖薙↓縺薙・莠育ｴ・｢ｺ螳壹ｒ蜿悶ｊ豸医＠縺ｦ縲∵悴蜃ｦ逅・・迥ｶ諷九↓謌ｻ縺励∪縺吶°・歃n・域ぅ閠・・螟画峩蝗樊焚縺ｮ繧ｫ繧ｦ繝ｳ繝医ｂ閾ｪ蜍慕噪縺ｫ1蝗槫ｷｮ縺怜ｼ輔°繧後∪縺呻ｼ・)) return;

    if (CONFIG.API_URL_ALL) {
        showToast("蜷梧悄荳ｭ...");
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

            showToast("譛ｪ蜃ｦ逅・↓謌ｻ縺励∪縺励◆");
            closeModal('modal-confirm');
            loadData();
        } catch (e) {
            console.error("Revert error:", e);
            showToast("蜷梧悄繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆", "var(--rose)");
        }
    } else {
        a.status = 'pending';
        a.confirmedDate = '';
        a.confirmedTime = '';
        a.confirmedScript = '';
        showToast("譛ｪ蜃ｦ逅・↓謌ｻ縺励∪縺励◆・医ョ繝｢繝｢繝ｼ繝会ｼ・);
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
    const container = document.getElementById("time-matrix-container");
    if (!container) return;
    container.innerHTML = "";

    const isHoliday = !!state.holidays[dateKey];
    
    let html = '<table class="time-matrix">';
    html += '<tr><th></th><th>00</th><th>15</th><th>30</th><th>45</th></tr>';

    for (let h = 10; h <= 20; h++) {
        if(h === 20) {
            html += `<tr><th>20譎・/th>`;
            const timeStr = '20:00';
            const slotKey = `${dateKey}_${timeStr}`;
            const isBlocked = state.blockedSlots.includes(slotKey);
            let cls = isHoliday ? "holiday-mode" : (isBlocked ? "blocked" : "");
            html += `<td class="${cls}" onclick="toggleBlockedSlot('${slotKey}')"></td><td colspan="3"></td></tr>`;
            break;
        }

        html += `<tr><th>${h}譎・/th>`;
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
        alert("髢句ｧ区凾蛻ｻ縺ｯ邨ゆｺ・凾蛻ｻ繧医ｊ蜑阪↓險ｭ螳壹＠縺ｦ縺上□縺輔＞縲・);
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

    // 讌ｽ隕ｳ逧ФI譖ｴ譁ｰ
    if (isBlocked) {
        state.blockedSlots = state.blockedSlots.filter(s => s !== slotKey);
    } else {
        state.blockedSlots.push(slotKey);
    }
    renderTimeSlotsBlocker(slotKey.split('_')[0]);

    try {
        const res = await apiFetch(`${'https://reserve-pro-dashboard.onrender.com/api/blocked-slots'}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, slotKey })
        });
        if (!res.ok) throw new Error("Sync failed");
    } catch (e) {
        console.error("Blocked slot sync error:", e);
        showToast("蜷梧悄繧ｨ繝ｩ繝ｼ", "var(--rose)");
        loadData(); // 繝ｭ繝ｼ繝ｫ繝舌ャ繧ｯ
    }
}

async function bulkToggleBlocks(slotsToToggle, action) {
    if (!slotsToToggle.length) return;
    
    // 讌ｽ隕ｳ逧ФI譖ｴ譁ｰ
    const originalSlots = [...state.blockedSlots];
    if (action === 'add') {
        const newSlots = new Set([...state.blockedSlots, ...slotsToToggle]);
        state.blockedSlots = Array.from(newSlots);
    } else {
        state.blockedSlots = state.blockedSlots.filter(s => !slotsToToggle.includes(s));
    }
    renderTimeSlotsBlocker(state.selectedCalDate);

    // API蜷梧悄
    try {
        const promises = slotsToToggle.map(slotKey => {
            return apiFetch(`${'https://reserve-pro-dashboard.onrender.com/api/blocked-slots'}`, {
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
        showToast("蜷梧悄繧ｨ繝ｩ繝ｼ", "var(--rose)");
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


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
let serviceAccount;
try {
    serviceAccount = require('./firebase-key.json');
} catch (e) {
    serviceAccount = { project_id: "test-mock" }; // CI繝・せ繝育畑縺ｮ繝繝溘・
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const path = require('path');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-2026';

const app = express();

// 繧ｻ繧ｭ繝･繝ｪ繝・ぅ繝倥ャ繝繝ｼ縺ｮ險ｭ螳夲ｼ医う繝ｳ繝ｩ繧､繝ｳ繧ｹ繧ｯ繝ｪ繝励ヨ遲峨ｒ險ｱ蜿ｯ縺吶ｋ縺溘ａCSP縺ｯ繧ｪ繝包ｼ・app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors());
app.use(express.json());

// 繝ｭ繧ｰ繧､繝ｳAPI
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // admin繧｢繧ｫ繧ｦ繝ｳ繝・    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
        return res.json({ token, role: 'admin' });
    }
    // staff繧｢繧ｫ繧ｦ繝ｳ繝茨ｼ磯夢隕ｧ縺ｮ縺ｿ・・    if (username === 'staff' && password === 'staff123') {
        const token = jwt.sign({ username, role: 'staff' }, JWT_SECRET, { expiresIn: '12h' });
        return res.json({ token, role: 'staff' });
    }
    
    return res.status(401).json({ error: '繝ｦ繝ｼ繧ｶ繝ｼ蜷阪∪縺溘・繝代せ繝ｯ繝ｼ繝峨′髢馴＆縺｣縺ｦ縺・∪縺吶・ });
});

// 隱崎ｨｼ繝溘ラ繝ｫ繧ｦ繧ｧ繧｢ (Token讀懆ｨｼ)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.status(401).json({ error: '隱崎ｨｼ繝医・繧ｯ繝ｳ縺悟ｿ・ｦ√〒縺吶・ });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({ error: '繝医・繧ｯ繝ｳ縺檎┌蜉ｹ縺ｾ縺溘・譛滄剞蛻・ｌ縺ｧ縺吶・ });
        req.user = user;
        next();
    });
}

// 讓ｩ髯千ｮ｡逅・Α繝峨Ν繧ｦ繧ｧ繧｢ (Admin蠢・・
function requireAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: '縺薙・謫堺ｽ懊ｒ螳溯｡後☆繧九↓縺ｯ邂｡逅・・ｨｩ髯舌′蠢・ｦ√〒縺吶・ });
    }
}

// 髱咏噪繝輔ぃ繧､繝ｫ縺ｮ謠蝉ｾ幢ｼ医ヵ繝ｭ繝ｳ繝医お繝ｳ繝臥判髱｢逕ｨ・・app.use(express.static(__dirname));
const PORT = process.env.PORT || 3001; // Render遲峨↓蟇ｾ蠢懊☆繧九◆繧∫腸蠅・､画焚縺九ｉ蜿門ｾ・
// Firebase縺九ｉ繝・・繧ｿ繧貞叙蠕・async function getHolidaysData() {
    try {
        const doc = await db.collection('settings').doc('holidaysData').get();
        if (!doc.exists) {
            return { holidays: {}, blockedSlots: [] };
        }
        return doc.data();
    } catch (e) {
        console.error("Error reading Firestore:", e);
        return { holidays: {}, blockedSlots: [] };
    }
}

// Firebase縺ｸ繝・・繧ｿ繧剃ｿ晏ｭ・async function saveHolidaysData(data) {
    try {
        await db.collection('settings').doc('holidaysData').set(data);
    } catch (e) {
        console.error("Error writing to Firestore:", e);
        throw e;
    }
}

// 逶｣譟ｻ繝ｭ繧ｰ・医が繝壹Ξ繝ｼ繧ｷ繝ｧ繝ｳ螻･豁ｴ・峨ｒ險倬鹸縺吶ｋ
async function saveAuditLog(username, action, details) {
    try {
        await db.collection('audit_logs').add({
            username: username || 'system',
            action: action,
            details: details,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch (e) {
        console.error("Error writing audit log:", e);
    }
}

// API: 蜈ｨ莉ｶ蜿門ｾ・(蜈ｨ讓ｩ髯舌・荳闊ｬ蜈ｬ髢九い繧ｯ繧ｻ繧ｹ蜿ｯ閭ｽ)
app.get('/api/holidays', async (req, res) => {
    const data = await getHolidaysData();
    res.json(data);
});

// API: 莨題ｨｺ譌･譖ｴ譁ｰ (Admin讓ｩ髯仙ｿ・・
app.post('/api/holidays', authenticateToken, requireAdmin, async (req, res) => {
    const action = req.body.action;
    const date = req.body.date;
    const memo = req.body.memo || "";

    if (!date) return res.status(400).json({ error: "Date is required" });

    const data = await getHolidaysData();
    if (!data.holidays) data.holidays = {};
    if (!data.blockedSlots) data.blockedSlots = [];

    if (action === 'addHoliday') {
        data.holidays[date] = { memo };
        await saveHolidaysData(data);
        await saveAuditLog(req.user.username, 'ADD_HOLIDAY', { date, memo });
        res.json({ success: true });
    } else if (action === 'deleteHoliday') {
        if (data.holidays[date]) {
            delete data.holidays[date];
            await saveHolidaysData(data);
            await saveAuditLog(req.user.username, 'DELETE_HOLIDAY', { date });
        }
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Unknown action" });
    }
});

// API: 莠育ｴ・ｸ榊庄譫縺ｮ譖ｴ譁ｰ (Admin讓ｩ髯仙ｿ・・
app.post('/api/blocked-slots', authenticateToken, requireAdmin, async (req, res) => {
    const action = req.body.action;
    const slotKey = req.body.slotKey; // e.g. "2026-05-20_10:15"

    if (!slotKey) return res.status(400).json({ error: "SlotKey is required" });

    try {
        const docRef = db.collection('settings').doc('holidaysData');
        
        if (action === 'add') {
            await docRef.set({
                blockedSlots: admin.firestore.FieldValue.arrayUnion(slotKey)
            }, { merge: true });
            await saveAuditLog(req.user.username, 'ADD_BLOCKED_SLOT', { slotKey });
            res.json({ success: true });
        } else if (action === 'delete') {
            await docRef.set({
                blockedSlots: admin.firestore.FieldValue.arrayRemove(slotKey)
            }, { merge: true });
            await saveAuditLog(req.user.username, 'DELETE_BLOCKED_SLOT', { slotKey });
            res.json({ success: true });
        } else {
            res.status(400).json({ error: "Unknown action" });
        }
    } catch (error) {
        console.error("Error updating blocked slots:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 豺ｱ螟・譎ゅ↓繝・Δ逕ｨ繝・・繧ｿ縺ｫ繝ｪ繧ｻ繝・ヨ縺吶ｋ螳壽悄螳溯｡後ち繧ｹ繧ｯ (豈取律00:00 JST)
cron.schedule('0 0 * * *', async () => {
    console.log('[Cron] 豺ｱ螟・譎・ 繝・・繧ｿ繝吶・繧ｹ繧貞・譛溽憾諷具ｼ医ョ繝｢逕ｨ繝・・繧ｿ・峨↓繝ｪ繧ｻ繝・ヨ縺励∪縺・);
    const demoData = {
        holidays: {},
        blockedSlots: [
            "2026-06-20_10:00",
            "2026-06-20_10:15"
        ]
    };
    try {
        await saveHolidaysData(demoData);
        console.log('[Cron] 繝ｪ繧ｻ繝・ヨ螳御ｺ・);
    } catch (e) {
        console.error('[Cron] 繝ｪ繧ｻ繝・ヨ螟ｱ謨・', e);
    }
}, {
    scheduled: true,
    timezone: "Asia/Tokyo"
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`=========================================`);
        console.log(` 莠育ｴ・す繧ｹ繝・Β逕ｨ 繝ｭ繝ｼ繧ｫ繝ｫ繧ｵ繝ｼ繝舌・ 遞ｼ蜒堺ｸｭ...`);
        console.log(` 繝昴・繝・ ${PORT}`);
        console.log(` 繝・・繧ｿ繝吶・繧ｹ: Firebase Firestore`);
        console.log(` 邨ゆｺ・☆繧句ｴ蜷医・縺薙・繧ｦ繧｣繝ｳ繝峨え繧帝哩縺倥ｋ縺・Ctrl+C 繧呈款縺励※縺上□縺輔＞`);
        console.log(`=========================================`);
    });
}

// 繝・せ繝育畑縺ｫapp繧偵お繧ｯ繧ｹ繝昴・繝・module.exports = app;


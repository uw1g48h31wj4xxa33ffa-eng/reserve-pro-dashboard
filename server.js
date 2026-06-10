require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
let serviceAccount;
try {
    serviceAccount = require('./firebase-key.json');
} catch (e) {
    serviceAccount = { project_id: "test-mock" }; // CIテスト用のダミー
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

// セキュリティヘッダーの設定（インラインスクリプト等を許可するためCSPはオフ）
app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors());
app.use(express.json());

// ログインAPI
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // adminアカウント
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
        return res.json({ token, role: 'admin' });
    }
    // staffアカウント（閲覧のみ）
    if (username === 'staff' && password === 'staff123') {
        const token = jwt.sign({ username, role: 'staff' }, JWT_SECRET, { expiresIn: '12h' });
        return res.json({ token, role: 'staff' });
    }
    
    return res.status(401).json({ error: 'ユーザー名またはパスワードが間違っています。' });
});

// 認証ミドルウェア (Token検証)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.status(401).json({ error: '認証トークンが必要です。' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'トークンが無効または期限切れです。' });
        req.user = user;
        next();
    });
}

// 権限管理ミドルウェア (Admin必須)
function requireAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'この操作を実行するには管理者権限が必要です。' });
    }
}

// 静的ファイルの提供（フロントエンド画面用）
app.use(express.static(__dirname));
const PORT = process.env.PORT || 3001; // Render等に対応するため環境変数から取得

// Firebaseからデータを取得
async function getHolidaysData() {
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

// Firebaseへデータを保存
async function saveHolidaysData(data) {
    try {
        await db.collection('settings').doc('holidaysData').set(data);
    } catch (e) {
        console.error("Error writing to Firestore:", e);
        throw e;
    }
}

// 監査ログ（オペレーション履歴）を記録する
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

// API: 全件取得 (全権限・一般公開アクセス可能)
app.get('/api/holidays', async (req, res) => {
    const data = await getHolidaysData();
    res.json(data);
});

// API: 休診日更新 (Admin権限必須)
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

// API: 予約不可枠の更新 (Admin権限必須)
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

// 深夜0時にデモ用データにリセットする定期実行タスク (毎日00:00 JST)
cron.schedule('0 0 * * *', async () => {
    console.log('[Cron] 深夜0時: データベースを初期状態（デモ用データ）にリセットします');
    const demoData = {
        holidays: {},
        blockedSlots: [
            "2026-06-20_10:00",
            "2026-06-20_10:15"
        ]
    };
    try {
        await saveHolidaysData(demoData);
        console.log('[Cron] リセット完了');
    } catch (e) {
        console.error('[Cron] リセット失敗:', e);
    }
}, {
    scheduled: true,
    timezone: "Asia/Tokyo"
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`=========================================`);
        console.log(` 予約システム用 ローカルサーバー 稼働中...`);
        console.log(` ポート: ${PORT}`);
        console.log(` データベース: Firebase Firestore`);
        console.log(` 終了する場合はこのウィンドウを閉じるか Ctrl+C を押してください`);
        console.log(`=========================================`);
    });
}

// テスト用にappをエクスポート
module.exports = app;

const request = require('supertest');

// Firebase Admin SDK をモック化（本番DBにアクセスしないように保護）
jest.mock('firebase-admin', () => {
    const mockFirestoreInstance = {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
            exists: true,
            data: () => ({ holidays: {}, blockedSlots: [] })
        }),
        set: jest.fn().mockResolvedValue(true),
        add: jest.fn().mockResolvedValue(true)
    };
    
    const firestoreMock = jest.fn(() => mockFirestoreInstance);
    firestoreMock.FieldValue = {
        serverTimestamp: jest.fn()
    };

    return {
        initializeApp: jest.fn(),
        credential: { cert: jest.fn() },
        firestore: firestoreMock
    };
});

// cronをモック化（テスト実行時にスケジュールタスクがハングしないようにする）
jest.mock('node-cron', () => ({
    schedule: jest.fn()
}));

const app = require('../server');

describe('SaaS Security & Authentication API Tests', () => {

    let adminToken = '';
    let staffToken = '';

    test('1. ログイン成功時にJWTトークンが発行されること (Admin)', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'admin', password: 'admin123' });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.role).toEqual('admin');
        adminToken = res.body.token;
    });

    test('2. ログイン成功時にJWTトークンが発行されること (Staff)', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'staff', password: 'staff123' });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.role).toEqual('staff');
        staffToken = res.body.token;
    });

    test('3. 不正なパスワードではログインが弾かれること', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'admin', password: 'wrongpassword' });
        
        expect(res.statusCode).toEqual(401);
    });

    test('4. トークンなしのデータアクセスが遮断されること (401 Unauthorized)', async () => {
        const res = await request(app).get('/api/holidays');
        expect(res.statusCode).toEqual(401);
    });

    test('5. トークンありでデータ取得が成功すること', async () => {
        const res = await request(app)
            .get('/api/holidays')
            .set('Authorization', `Bearer ${staffToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('holidays');
    });

    test('6. スタッフ権限でデータ更新（Admin専用API）を試みると遮断されること (403 Forbidden)', async () => {
        const res = await request(app)
            .post('/api/holidays')
            .set('Authorization', `Bearer ${staffToken}`)
            .send({ action: 'addHoliday', date: '2026-10-10' });
        expect(res.statusCode).toEqual(403);
    });

    test('7. 管理者(Admin)権限でデータ更新が成功すること', async () => {
        const res = await request(app)
            .post('/api/holidays')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ action: 'addHoliday', date: '2026-10-10', memo: 'テスト休診日' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});

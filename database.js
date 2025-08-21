const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 데이터베이스 파일 경로
const DB_PATH = path.join(__dirname, 'backlink.db');

// 데이터베이스 연결
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('데이터베이스 연결 오류:', err.message);
    } else {
        console.log('SQLite 데이터베이스에 연결되었습니다.');
        initializeDatabase();
    }
});

// 데이터베이스 초기화
function initializeDatabase() {
    // 사용자 테이블
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            points INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 충전 요청 테이블
    db.run(`
        CREATE TABLE IF NOT EXISTS charge_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount INTEGER NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            request_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            approved_time DATETIME NULL,
            admin_note TEXT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    // 포인트 거래 내역 테이블
    db.run(`
        CREATE TABLE IF NOT EXISTS point_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type VARCHAR(20) NOT NULL,
            amount INTEGER NOT NULL,
            balance_after INTEGER NOT NULL,
            description TEXT NOT NULL,
            reference_id VARCHAR(100) NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    // 주문 테이블 (기존 orders.json을 대체)
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_number VARCHAR(50) UNIQUE NOT NULL,
            user_id INTEGER NOT NULL,
            product VARCHAR(100) NOT NULL,
            website VARCHAR(255) NOT NULL,
            keywords TEXT NULL,
            email VARCHAR(100) NOT NULL,
            price INTEGER NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    console.log('데이터베이스 테이블이 초기화되었습니다.');
}

// 사용자 관련 함수들
const UserModel = {
    // 사용자 생성
    create: (userData, callback) => {
        const { username, email, password_hash } = userData;
        db.run(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, password_hash],
            function(err) {
                callback(err, this?.lastID);
            }
        );
    },

    // 이메일로 사용자 찾기
    findByEmail: (email, callback) => {
        db.get(
            'SELECT * FROM users WHERE email = ?',
            [email],
            callback
        );
    },

    // 사용자명으로 사용자 찾기
    findByUsername: (username, callback) => {
        db.get(
            'SELECT * FROM users WHERE username = ?',
            [username],
            callback
        );
    },

    // ID로 사용자 찾기
    findById: (id, callback) => {
        db.get(
            'SELECT * FROM users WHERE id = ?',
            [id],
            callback
        );
    },

    // 포인트 업데이트
    updatePoints: (userId, points, callback) => {
        db.run(
            'UPDATE users SET points = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [points, userId],
            callback
        );
    }
};

// 충전 요청 관련 함수들
const ChargeRequestModel = {
    // 충전 요청 생성
    create: (userId, amount, callback) => {
        db.run(
            'INSERT INTO charge_requests (user_id, amount) VALUES (?, ?)',
            [userId, amount],
            function(err) {
                callback(err, this?.lastID);
            }
        );
    },

    // 모든 충전 요청 조회 (관리자용)
    getAll: (callback) => {
        db.all(`
            SELECT cr.*, u.username, u.email 
            FROM charge_requests cr 
            JOIN users u ON cr.user_id = u.id 
            ORDER BY cr.request_time DESC
        `, callback);
    },

    // 충전 요청 승인
    approve: (requestId, adminNote, callback) => {
        db.run(
            'UPDATE charge_requests SET status = "approved", approved_time = CURRENT_TIMESTAMP, admin_note = ? WHERE id = ?',
            [adminNote, requestId],
            callback
        );
    },

    // 특정 충전 요청 조회
    findById: (id, callback) => {
        db.get(
            'SELECT * FROM charge_requests WHERE id = ?',
            [id],
            callback
        );
    }
};

// 포인트 거래 내역 관련 함수들
const PointTransactionModel = {
    // 거래 내역 생성
    create: (userId, type, amount, balanceAfter, description, referenceId, callback) => {
        db.run(
            'INSERT INTO point_transactions (user_id, type, amount, balance_after, description, reference_id) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, type, amount, balanceAfter, description, referenceId],
            callback
        );
    },

    // 사용자별 거래 내역 조회
    getByUserId: (userId, callback) => {
        db.all(
            'SELECT * FROM point_transactions WHERE user_id = ? ORDER BY created_at DESC',
            [userId],
            callback
        );
    }
};

// 주문 관련 함수들
const OrderModel = {
    // 주문 생성
    create: (orderData, callback) => {
        const { order_number, user_id, product, website, keywords, email, price } = orderData;
        db.run(
            'INSERT INTO orders (order_number, user_id, product, website, keywords, email, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [order_number, user_id, product, website, keywords, email, price],
            function(err) {
                callback(err, this?.lastID);
            }
        );
    },

    // 모든 주문 조회
    getAll: (callback) => {
        db.all(`
            SELECT o.*, u.username, u.email as user_email 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC
        `, callback);
    },

    // 사용자별 주문 조회
    getByUserId: (userId, callback) => {
        db.all(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId],
            callback
        );
    },

    // 주문 상태 업데이트
    updateStatus: (orderId, status, callback) => {
        db.run(
            'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, orderId],
            callback
        );
    }
};

module.exports = {
    db,
    UserModel,
    ChargeRequestModel,
    PointTransactionModel,
    OrderModel
};
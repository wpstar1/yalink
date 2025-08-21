const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserModel } = require('./database');

// JWT 비밀키 (실제 운영시에는 환경변수로 관리)
const JWT_SECRET = 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// 비밀번호 해시
function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

// 비밀번호 검증
function verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

// JWT 토큰 생성
function generateToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

// JWT 토큰 검증
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// 미들웨어: 로그인 확인
function requireAuth(req, res, next) {
    const token = req.session.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }
    
    req.user = decoded;
    next();
}

// 회원가입
function register(req, res) {
    const { username, email, password } = req.body;
    
    // 입력 검증
    if (!username || !email || !password) {
        return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ error: '비밀번호는 6자리 이상이어야 합니다.' });
    }
    
    // 이메일 중복 확인
    UserModel.findByEmail(email, (err, existingUser) => {
        if (err) {
            return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
        }
        
        if (existingUser) {
            return res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });
        }
        
        // 사용자명 중복 확인
        UserModel.findByUsername(username, (err, existingUser) => {
            if (err) {
                return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
            }
            
            if (existingUser) {
                return res.status(400).json({ error: '이미 사용 중인 사용자명입니다.' });
            }
            
            // 비밀번호 해시 후 사용자 생성
            const passwordHash = hashPassword(password);
            
            UserModel.create({ username, email, password_hash: passwordHash }, (err, userId) => {
                if (err) {
                    return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
                }
                
                // 생성된 사용자 정보 조회
                UserModel.findById(userId, (err, user) => {
                    if (err) {
                        return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
                    }
                    
                    // JWT 토큰 생성
                    const token = generateToken(user);
                    req.session.token = token;
                    
                    res.json({
                        success: true,
                        message: '회원가입이 완료되었습니다.',
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            points: user.points
                        },
                        token
                    });
                });
            });
        });
    });
}

// 로그인
function login(req, res) {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    }
    
    UserModel.findByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
        }
        
        if (!user) {
            return res.status(400).json({ error: '존재하지 않는 계정입니다.' });
        }
        
        if (!verifyPassword(password, user.password_hash)) {
            return res.status(400).json({ error: '비밀번호가 올바르지 않습니다.' });
        }
        
        // JWT 토큰 생성
        const token = generateToken(user);
        req.session.token = token;
        
        res.json({
            success: true,
            message: '로그인되었습니다.',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                points: user.points
            },
            token
        });
    });
}

// 로그아웃
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: '로그아웃 중 오류가 발생했습니다.' });
        }
        
        res.json({ success: true, message: '로그아웃되었습니다.' });
    });
}

// 사용자 정보 조회
function getProfile(req, res) {
    UserModel.findById(req.user.id, (err, user) => {
        if (err) {
            return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
        }
        
        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }
        
        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                points: user.points,
                created_at: user.created_at
            }
        });
    });
}

module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken,
    requireAuth,
    register,
    login,
    logout,
    getProfile
};
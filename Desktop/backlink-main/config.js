// 설정 파일
module.exports = {
    // 서버 설정
    port: process.env.PORT || 3001,
    
    // 텔레그램 봇 설정
    telegram: [
        {
            token: '8303236296:AAEKYhYA1GrS6oBztwkEepEdGqcSJzbJOWk',
            chatId: '7608775338'
        },
        {
            token: '8477059595:AAH_kCIP8lbmvgnL5hBj6kwJ-LJpIbBWYFU',
            chatId: '455532741'
        }
    ],
    
    // 이메일 설정
    email: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your-email@gmail.com', // 발송용 이메일
            pass: 'your-app-password' // Gmail 앱 패스워드
        }
    },
    
    // 계좌 정보
    bankAccount: {
        bank: '국민은행',
        account: '65030104274124',
        holder: '워크넷'
    }
};
// 상품 데이터
const products = {
    'profile-60': {
        name: '프로필 백링크 60개',
        price: '5만원',
        originalPrice: '10만원'
    },
    'profile-125': {
        name: '프로필 백링크 125개',
        price: '8만원',
        originalPrice: '20만원'
    },
    'profile-240': {
        name: '프로필 백링크 240개',
        price: '15만원',
        originalPrice: '40만원'
    },
    'web20-1000': {
        name: '웹2.0 백링크 스타터 패키지',
        price: '5만원',
        originalPrice: null
    },
    'web20-2500': {
        name: '웹2.0 백링크 프로페셔널 패키지',
        price: '10만원',
        originalPrice: null
    },
    'web20-5000': {
        name: '웹2.0 백링크 엔터프라이즈 패키지',
        price: '18만원',
        originalPrice: null
    },
    'domain-30': {
        name: '도메인 권한 상승 베이직 패키지',
        price: '5만원',
        originalPrice: null
    },
    'domain-40': {
        name: '도메인 권한 상승 프리미엄 패키지',
        price: '15만원',
        originalPrice: null
    },
    'domain-50': {
        name: '도메인 권한 상승 엔터프라이즈 패키지',
        price: '20만원',
        originalPrice: null
    },
    'program-10000': {
        name: '프로그램 백링크 스타터 패키지',
        price: '7만원',
        originalPrice: null
    },
    'program-30000': {
        name: '프로그램 백링크 프로페셔널 패키지',
        price: '10만원',
        originalPrice: null
    },
    'program-70000': {
        name: '프로그램 백링크 프리미엄 패키지',
        price: '20만원',
        originalPrice: null
    }
};

// 전역 변수
let selectedProduct = null;

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
    // 지금 신청하기 버튼 - 페이지 내에서 상품 섹션으로 스크롤
    const orderBtn = document.getElementById('orderBtn');
    if (orderBtn) {
        orderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 상품 선택 버튼 클릭 - order-now-btn 클래스 사용
    document.querySelectorAll('.order-now-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            selectProduct(productId);
        });
    });

    // 주문 폼 제출
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitOrder();
        });
    }


    // 모달 닫기 버튼들 (이벤트 위임 방식)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close')) {
            e.preventDefault();
            e.stopPropagation();
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        }
    });

    // 모달 외부 클릭 시 닫기 (주문 폼 모달 제외)
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this && this.id !== 'orderFormModal') {
                closeModal(this.id);
            }
        });
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="display: block"]');
            openModals.forEach(modal => {
                if (modal.id !== 'orderFormModal') {
                    closeModal(modal.id);
                }
            });
        }
    });
}

// 페이지 내 상품 섹션에는 탭이 없으므로 이 함수는 사용되지 않음
// 필요 시 나중에 사용 가능

// 상품 선택
function selectProduct(productId) {
    selectedProduct = productId;
    const product = products[productId];
    
    // 선택된 상품 정보 표시
    document.getElementById('selectedProductName').textContent = product.name;
    document.getElementById('selectedProductPrice').textContent = product.price;
    
    // 상품별 필드 설정
    setupFormFields(productId);
    
    // 주문 정보 입력 모달 열기 (페이지 내 상품에서 바로 열기)
    openModal('orderFormModal');
}

// 상품별 필드 설정
function setupFormFields(productId) {
    const keywordsGroup = document.getElementById('keywordsGroup');
    const keywordsInput = document.getElementById('keywords');
    
    // 도메인 권한 상승 상품인지 확인
    if (productId.startsWith('domain-')) {
        // 도메인 권한 상승: 키워드 불필요
        keywordsGroup.style.display = 'none';
        keywordsInput.required = false;
    } else {
        // 모든 백링크 상품: 키워드 1개 이상
        keywordsGroup.style.display = 'block';
        keywordsInput.required = true;
        keywordsInput.placeholder = '키워드1, 키워드2, 키워드3 (1개 이상)';
        keywordsGroup.querySelector('label').textContent = '타겟 키워드 (1개 이상, 쉼표로 구분) *';
    }
}

// 주문 제출
async function submitOrder() {
    const formData = new FormData(document.getElementById('orderForm'));
    const orderData = {
        product: selectedProduct,
        website: formData.get('website'),
        keywords: formData.get('keywords') || '', // 키워드가 없을 수도 있음
        email: formData.get('email'),
        timestamp: new Date().toISOString()
    };

    try {
        // 서버가 실행되지 않은 경우를 위한 임시 처리
        const orderNumber = generateOrderNumber();
        
        // 로컬 스토리지에 주문 정보 저장
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push({
            ...orderData,
            orderNumber: orderNumber,
            id: Date.now().toString(),
            status: 'pending',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // 주문 완료 처리
        showPaymentInfo(orderNumber);
        
    } catch (error) {
        console.error('주문 제출 오류:', error);
        alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 주문 번호 생성 함수 추가
function generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BL${year}${month}${day}${random}`;
}

// 결제 정보 표시
function showPaymentInfo(orderNumber) {
    const product = products[selectedProduct];
    
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('paymentProductName').textContent = product.name;
    document.getElementById('paymentAmount').textContent = product.price;
    
    closeModal('orderFormModal');
    openModal('paymentModal');
}

// 모달 열기
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 모달 닫기
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}


// 키워드 유효성 검사
function validateKeywords(keywords, productId) {
    // 도메인 권한 상승은 키워드 불필요
    if (productId.startsWith('domain-')) {
        return true;
    }
    
    const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
    
    // 모든 상품에서 키워드 1개 이상이면 OK
    return keywordArray.length >= 1;
}

// 폼 유효성 검사
function validateForm() {
    const website = document.getElementById('website').value;
    const keywords = document.getElementById('keywords').value;
    const email = document.getElementById('email').value;
    
    if (!website || !email) {
        alert('필수 항목을 모두 입력해주세요.');
        return false;
    }
    
    // 키워드 유효성 검사 (상품별로 다름)
    if (!validateKeywords(keywords, selectedProduct)) {
        if (selectedProduct.startsWith('domain-')) {
            // 도메인 권한 상승은 키워드 불필요
        } else {
            alert('키워드를 1개 이상 입력해주세요.');
        }
        return false;
    }
    
    return true;
}


// 애니메이션 효과
function addLoadingAnimation(button) {
    button.textContent = '처리 중...';
    button.disabled = true;
}

function removeLoadingAnimation(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
}


 
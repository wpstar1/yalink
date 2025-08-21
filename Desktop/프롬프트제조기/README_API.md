# SEO 자동 분석 API 설치 가이드

## 📁 파일 구조
```
/
├── seo-prompt-generator.html
├── seo-checklist.html
├── ai-seo-analyzer.html
├── api/
│   ├── config.php          # 설정 파일
│   ├── analyze.php         # 메인 분석 API
│   └── scraper.php         # 웹 스크래핑 클래스
└── README_API.md           # 이 파일
```

## 🚀 설치 방법

### 1. 파일질라 업로드
1. 모든 파일을 웹 서버에 업로드
2. PHP 7.4 이상 지원하는 호스팅 필요
3. cURL, DOM 확장 모듈 활성화 필요

### 2. API 설정 (선택사항)

**첫 설치 시:**
1. `api/config.example.php` 파일을 `api/config.php`로 복사
2. `config.php` 파일에서 API 키 설정:

```php
// Google PageSpeed Insights API 키 (선택사항)
define('GOOGLE_API_KEY', 'YOUR_ACTUAL_API_KEY_HERE');
```

**⚠️ 중요:** `config.php` 파일은 Git에 커밋하지 마세요! (API 키 보안)

**Google API 키 발급 방법:**
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. "API 및 서비스" → "라이브러리"
4. "PageSpeed Insights API" 검색하여 활성화
5. "사용자 인증 정보" → "API 키" 생성

### 3. 권한 설정
- `api/` 폴더: 실행 권한 (755)
- PHP 파일들: 읽기/실행 권한 (644)

## 🔧 기능

### 자동 분석 항목
- ✅ **제목 태그**: 길이, 키워드 포함 여부
- ✅ **메타 설명**: 길이, 존재 여부
- ✅ **H1 태그**: 개수, 내용
- ✅ **헤딩 구조**: H2-H6 구조 분석
- ✅ **이미지 최적화**: Alt 텍스트 비율
- ✅ **링크 구조**: 내부/외부 링크 개수
- ✅ **콘텐츠 길이**: 단어 수, 키워드 밀도
- ⚡ **페이지 속도**: Google API 연동시

### 자동 체크 항목
분석 결과에 따라 체크리스트에서 자동으로 체크됩니다:
- 기술적 SEO (5개 항목)
- 콘텐츠 최적화 (4개 항목) 
- 이미지/미디어 (2개 항목)

## 🎯 사용법

### 1. 기본 사용
1. `seo-checklist.html` 페이지 열기
2. 분석할 URL 입력
3. 키워드 입력 (선택사항)
4. "🚀 자동 분석 시작" 클릭

### 2. API 직접 호출 (개발자용)
```javascript
fetch('api/analyze.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        url: 'https://example.com',
        keyword: '키워드'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 📊 응답 데이터 구조
```json
{
    "success": true,
    "data": {
        "title": {
            "content": "페이지 제목",
            "length": 25,
            "score": 85
        },
        "metaDescription": {
            "content": "메타 설명",
            "length": 140,
            "score": 90
        },
        "overallScore": {
            "score": 75,
            "grade": "B+",
            "breakdown": {
                "technical": 80,
                "content": 70,
                "media": 85,
                "eeat": 65
            }
        },
        "checklist": {
            "technical": {
                "tech-1": true,
                "tech-2": true
            }
        },
        "recommendations": [
            {
                "type": "important",
                "category": "기술적 SEO",
                "issue": "문제점",
                "solution": "해결 방법"
            }
        ]
    }
}
```

## ⚠️ 주의사항

### 서버 요구사항
- PHP 7.4+
- cURL 확장 모듈
- DOM 확장 모듈
- 메모리: 최소 128MB
- 실행 시간: 30초 이상

### 제한사항
1. **로그인 필요 페이지**: 분석 불가
2. **JavaScript 렌더링**: 기본 HTML만 분석
3. **대용량 페이지**: 타임아웃 가능성
4. **API 제한**: Google API 일일 할당량 확인

### 에러 해결
```
403 Forbidden → 파일 권한 확인
500 Internal Error → PHP 에러 로그 확인
CORS Error → config.php 헤더 설정 확인
Timeout → 네트워크 또는 대상 사이트 문제
```

## 🔄 업데이트 로그
- v1.0: 기본 SEO 분석 기능
- v1.1: Google PageSpeed API 연동
- v1.2: 키워드 밀도 분석 추가
- v1.3: 자동 체크리스트 연동

## 💡 최적화 팁
1. **API 키 설정**: 페이지 속도 분석 활용
2. **키워드 입력**: 더 정확한 분석을 위해 메인 키워드 입력
3. **정기 분석**: 콘텐츠 수정 후 재분석 권장
4. **모바일 확인**: 반응형 디자인은 별도 확인 필요

## 🆘 문의
- 설치 문제: 호스팅 업체 기술지원 문의
- 기능 문의: 개발자 연락
- 에러 신고: PHP 에러 로그와 함께 문의
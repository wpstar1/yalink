<?php
// SEO 분석기 설정 파일 (예시)
// 실제 사용 시 config.php로 복사하고 API 키를 입력하세요.

// CORS 헤더 설정 (브라우저에서 API 호출 허용)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// JSON 응답 헤더
header('Content-Type: application/json; charset=utf-8');

// 옵션 요청 처리 (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Google PageSpeed Insights API 키 (선택사항)
// https://developers.google.com/speed/docs/insights/v5/get-started 에서 발급
define('GOOGLE_API_KEY', 'YOUR_API_KEY_HERE'); // 여기에 실제 API 키 입력

// 분석 결과 가중치 설정
define('WEIGHTS', [
    'title' => 15,           // 제목 최적화
    'meta_description' => 10, // 메타 설명
    'h1' => 10,              // H1 태그
    'headings' => 8,         // H2-H6 구조
    'images' => 12,          // 이미지 최적화
    'internal_links' => 8,   // 내부 링크
    'external_links' => 5,   // 외부 링크
    'content_length' => 10,  // 콘텐츠 길이
    'keyword_density' => 7,  // 키워드 밀도
    'page_speed' => 15       // 페이지 속도
]);

// 최소 콘텐츠 길이 (단어 수)
define('MIN_CONTENT_WORDS', 300);

// 최적 키워드 밀도 범위
define('OPTIMAL_KEYWORD_DENSITY_MIN', 0.5);
define('OPTIMAL_KEYWORD_DENSITY_MAX', 2.5);

// 타임아웃 설정 (초)
define('CURL_TIMEOUT', 30);

// 에러 로깅 함수
function logError($message) {
    error_log('[SEO Analyzer] ' . $message);
}

// 성공 응답 함수
function sendSuccess($data) {
    echo json_encode([
        'success' => true,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// 에러 응답 함수
function sendError($message, $code = 400) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error' => $message
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// URL 유효성 검사 함수
function validateUrl($url) {
    if (!$url) {
        return false;
    }
    
    // http:// 또는 https:// 추가
    if (!preg_match('/^https?:\/\//', $url)) {
        $url = 'https://' . $url;
    }
    
    return filter_var($url, FILTER_VALIDATE_URL) ? $url : false;
}

// 텍스트에서 키워드 밀도 계산
function calculateKeywordDensity($text, $keyword) {
    if (!$text || !$keyword) {
        return 0;
    }
    
    $text = strtolower(strip_tags($text));
    $keyword = strtolower($keyword);
    
    $words = str_word_count($text, 1, 'ㄱ-힣');
    $totalWords = count($words);
    
    if ($totalWords === 0) {
        return 0;
    }
    
    $keywordCount = substr_count($text, $keyword);
    
    return ($keywordCount / $totalWords) * 100;
}

// HTML에서 텍스트 추출
function extractTextFromHtml($html) {
    $text = strip_tags($html);
    $text = preg_replace('/\s+/', ' ', $text);
    return trim($text);
}

// 단어 수 계산
function countWords($text) {
    $text = extractTextFromHtml($text);
    return str_word_count($text, 0, 'ㄱ-힣');
}
?>
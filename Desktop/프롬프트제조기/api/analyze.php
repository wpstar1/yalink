<?php
require_once 'config.php';
require_once 'scraper.php';

// POST 요청만 허용
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('POST 메소드만 허용됩니다.', 405);
}

// 입력 데이터 받기
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendError('잘못된 JSON 데이터입니다.');
}

$url = $input['url'] ?? '';

// URL 유효성 검사
$validUrl = validateUrl($url);
if (!$validUrl) {
    sendError('유효하지 않은 URL입니다.');
}

try {
    // SEO 분석 시작
    $scraper = new SEOScraper($validUrl);
    
    // 각 SEO 요소 분석
    $results = [];
    
    // 1. 제목 분석
    $title = $scraper->getTitle();
    $results['title'] = $title;
    
    // 2. 메타 설명 분석
    $metaDesc = $scraper->getMetaDescription();
    $results['metaDescription'] = $metaDesc;
    
    // 3. H1 태그 분석
    $h1Tags = $scraper->getH1Tags();
    $results['h1'] = $h1Tags;
    
    // 4. 헤딩 구조 분석
    $headings = $scraper->getHeadingStructure();
    $results['headings'] = $headings;
    
    // 5. 이미지 분석
    $images = $scraper->getImages();
    $results['images'] = $images;
    
    // 6. 링크 분석
    $links = $scraper->getLinks();
    $results['links'] = $links;
    
    // 7. 콘텐츠 분석 (제목에서 키워드 자동 추출)
    $autoKeyword = extractKeywordFromTitle($title['content']);
    $content = $scraper->getContentAnalysis($autoKeyword);
    $results['content'] = $content;
    $results['autoKeyword'] = $autoKeyword;
    
    // 8. 페이지 속도 분석 (선택사항)
    $pageSpeed = $scraper->getPageSpeed();
    $results['pageSpeed'] = $pageSpeed;
    
    // 전체 SEO 점수 계산
    $overallScore = calculateOverallScore($results);
    $results['overallScore'] = $overallScore;
    
    // 체크리스트 자동 완성 데이터 생성
    $checklist = generateChecklistData($results, $autoKeyword);
    $results['checklist'] = $checklist;
    
    // 개선 사항 제안
    $recommendations = generateRecommendations($results, $autoKeyword);
    $results['recommendations'] = $recommendations;
    
    sendSuccess($results);
    
} catch (Exception $e) {
    logError('분석 오류: ' . $e->getMessage());
    sendError('페이지 분석 중 오류가 발생했습니다: ' . $e->getMessage());
}

// 제목에서 키워드 자동 추출
function extractKeywordFromTitle($title) {
    if (empty($title)) {
        return '';
    }
    
    // 불용어 제거 (조사, 접속사 등)
    $stopWords = [
        '의', '가', '을', '를', '이', '은', '는', '에', '에서', '으로', '로', '와', '과', '도', '만', '부터', '까지', '에게', '한테', '께', '에서', '에게서', '한테서', '께서',
        '그리고', '또한', '하지만', '그러나', '따라서', '그래서', '왜냐하면', '만약', '비록', '그러므로', '그런데', '그러면', '또는', '혹은',
        '추천', '소개', '방법', '가이드', '설명', '정보', '내용', '리스트', '목록', '베스트', '순위', '랭킹', '완벽', '완전', '최고', '최신', '2024', '2025'
    ];
    
    // 제목을 단어로 분할
    $words = preg_split('/[\s\-_\|\[\](){}「」『』<>""'']+/u', $title);
    $keywords = [];
    
    foreach ($words as $word) {
        $word = trim($word);
        
        // 길이가 2글자 이상이고 불용어가 아닌 경우
        if (mb_strlen($word) >= 2 && !in_array($word, $stopWords)) {
            // 숫자만 있는 단어 제외
            if (!preg_match('/^[0-9]+$/', $word)) {
                $keywords[] = $word;
            }
        }
    }
    
    // 처음 2개 단어를 조합하여 키워드 생성
    if (count($keywords) >= 2) {
        return $keywords[0] . ' ' . $keywords[1];
    } elseif (count($keywords) == 1) {
        return $keywords[0];
    }
    
    return '';
}

function calculateOverallScore($results) {
    $weights = WEIGHTS;
    $totalWeight = 0;
    $weightedScore = 0;
    
    // 각 요소별 점수에 가중치 적용
    if (isset($results['title']['score'])) {
        $weightedScore += $results['title']['score'] * $weights['title'];
        $totalWeight += $weights['title'];
    }
    
    if (isset($results['metaDescription']['score'])) {
        $weightedScore += $results['metaDescription']['score'] * $weights['meta_description'];
        $totalWeight += $weights['meta_description'];
    }
    
    if (isset($results['h1']['score'])) {
        $weightedScore += $results['h1']['score'] * $weights['h1'];
        $totalWeight += $weights['h1'];
    }
    
    if (isset($results['headings']['score'])) {
        $weightedScore += $results['headings']['score'] * $weights['headings'];
        $totalWeight += $weights['headings'];
    }
    
    if (isset($results['images']['score'])) {
        $weightedScore += $results['images']['score'] * $weights['images'];
        $totalWeight += $weights['images'];
    }
    
    if (isset($results['links']['score'])) {
        $weightedScore += $results['links']['score'] * $weights['internal_links'];
        $totalWeight += $weights['internal_links'];
        
        if ($results['links']['external']['count'] > 0) {
            $weightedScore += min(100, $results['links']['external']['count'] * 25) * $weights['external_links'];
            $totalWeight += $weights['external_links'];
        }
    }
    
    if (isset($results['content']['score'])) {
        $weightedScore += $results['content']['score'] * $weights['content_length'];
        $totalWeight += $weights['content_length'];
    }
    
    if (isset($results['content']['keywordScore'])) {
        $weightedScore += $results['content']['keywordScore'] * $weights['keyword_density'];
        $totalWeight += $weights['keyword_density'];
    }
    
    if (isset($results['pageSpeed']['score'])) {
        $weightedScore += $results['pageSpeed']['score'] * $weights['page_speed'];
        $totalWeight += $weights['page_speed'];
    }
    
    $overallScore = $totalWeight > 0 ? round($weightedScore / $totalWeight) : 0;
    
    return [
        'score' => $overallScore,
        'grade' => getScoreGrade($overallScore),
        'breakdown' => [
            'technical' => calculateTechnicalScore($results),
            'content' => calculateContentScore($results),
            'media' => calculateMediaScore($results),
            'eeat' => calculateEEATScore($results)
        ]
    ];
}

function getScoreGrade($score) {
    if ($score >= 90) return 'A+';
    if ($score >= 80) return 'A';
    if ($score >= 70) return 'B+';
    if ($score >= 60) return 'B';
    if ($score >= 50) return 'C+';
    if ($score >= 40) return 'C';
    return 'D';
}

function calculateTechnicalScore($results) {
    $scores = [];
    
    if (isset($results['title']['score'])) $scores[] = $results['title']['score'];
    if (isset($results['metaDescription']['score'])) $scores[] = $results['metaDescription']['score'];
    if (isset($results['h1']['score'])) $scores[] = $results['h1']['score'];
    if (isset($results['headings']['score'])) $scores[] = $results['headings']['score'];
    if (isset($results['pageSpeed']['score'])) $scores[] = $results['pageSpeed']['score'];
    
    return !empty($scores) ? round(array_sum($scores) / count($scores)) : 0;
}

function calculateContentScore($results) {
    $scores = [];
    
    if (isset($results['content']['score'])) $scores[] = $results['content']['score'];
    if (isset($results['content']['keywordScore'])) $scores[] = $results['content']['keywordScore'];
    if (isset($results['links']['score'])) $scores[] = $results['links']['score'];
    
    return !empty($scores) ? round(array_sum($scores) / count($scores)) : 0;
}

function calculateMediaScore($results) {
    if (isset($results['images']['score'])) {
        return $results['images']['score'];
    }
    return 0;
}

function calculateEEATScore($results) {
    // E-E-A-T는 주로 콘텐츠 품질과 신뢰성 기반
    $score = 60; // 기본 점수
    
    // 외부 링크가 있으면 신뢰성 증가
    if (isset($results['links']['external']['count']) && $results['links']['external']['count'] > 0) {
        $score += 20;
    }
    
    // 충분한 콘텐츠 길이가 있으면 전문성 증가
    if (isset($results['content']['wordCount']) && $results['content']['wordCount'] >= 1000) {
        $score += 20;
    }
    
    return min(100, $score);
}

function generateChecklistData($results, $keyword) {
    $checklist = [
        'technical' => [],
        'content' => [],
        'media' => [],
        'eeat' => []
    ];
    
    // 기술적 SEO 체크
    $checklist['technical']['tech-1'] = isset($results['title']['content']) && !empty($results['title']['content']) && $results['title']['score'] >= 70;
    $checklist['technical']['tech-2'] = isset($results['metaDescription']['content']) && !empty($results['metaDescription']['content']) && $results['metaDescription']['score'] >= 70;
    $checklist['technical']['tech-3'] = isset($results['h1']['count']) && $results['h1']['count'] === 1;
    $checklist['technical']['tech-4'] = isset($results['headings']['structure']['h2']) && !empty($results['headings']['structure']['h2']);
    $checklist['technical']['tech-5'] = isset($results['pageSpeed']['score']) && $results['pageSpeed']['score'] >= 50;
    
    // 콘텐츠 최적화 체크
    $checklist['content']['content-1'] = isset($results['content']['keywordScore']) && $results['content']['keywordScore'] >= 70;
    $checklist['content']['content-2'] = isset($results['content']['wordCount']) && $results['content']['wordCount'] >= MIN_CONTENT_WORDS;
    $checklist['content']['content-5'] = isset($results['links']['internal']['count']) && $results['links']['internal']['count'] >= 3;
    $checklist['content']['content-8'] = isset($results['links']['external']['count']) && $results['links']['external']['count'] >= 2;
    
    // 이미지/미디어 체크
    $checklist['media']['media-1'] = isset($results['images']['altPercentage']) && $results['images']['altPercentage'] >= 90;
    $checklist['media']['media-4'] = isset($results['images']['total']) && $results['images']['total'] >= 3;
    
    return $checklist;
}

function generateRecommendations($results, $keyword) {
    $recommendations = [];
    
    // 제목 개선 사항
    if (!isset($results['title']['content']) || empty($results['title']['content'])) {
        $recommendations[] = [
            'type' => 'critical',
            'category' => '기술적 SEO',
            'issue' => '페이지 제목이 없습니다.',
            'solution' => '60자 이내의 매력적인 제목을 추가하세요.'
        ];
    } else if ($results['title']['score'] < 70) {
        if ($results['title']['length'] > 60) {
            $recommendations[] = [
                'type' => 'important',
                'category' => '기술적 SEO',
                'issue' => '페이지 제목이 너무 깁니다. (' . $results['title']['length'] . '자)',
                'solution' => '60자 이내로 줄이세요.'
            ];
        } else if ($results['title']['length'] < 30) {
            $recommendations[] = [
                'type' => 'important',
                'category' => '기술적 SEO',
                'issue' => '페이지 제목이 너무 짧습니다. (' . $results['title']['length'] . '자)',
                'solution' => '30-60자 사이로 늘리세요.'
            ];
        }
    }
    
    // 메타 설명 개선 사항
    if (!isset($results['metaDescription']['content']) || empty($results['metaDescription']['content'])) {
        $recommendations[] = [
            'type' => 'critical',
            'category' => '기술적 SEO',
            'issue' => '메타 설명이 없습니다.',
            'solution' => '120-160자의 매력적인 메타 설명을 추가하세요.'
        ];
    }
    
    // H1 태그 개선 사항
    if (!isset($results['h1']['count']) || $results['h1']['count'] === 0) {
        $recommendations[] = [
            'type' => 'critical',
            'category' => '기술적 SEO',
            'issue' => 'H1 태그가 없습니다.',
            'solution' => '페이지의 주제를 나타내는 H1 태그를 추가하세요.'
        ];
    } else if ($results['h1']['count'] > 1) {
        $recommendations[] = [
            'type' => 'important',
            'category' => '기술적 SEO',
            'issue' => 'H1 태그가 ' . $results['h1']['count'] . '개 있습니다.',
            'solution' => 'H1 태그는 페이지당 1개만 사용하세요.'
        ];
    }
    
    // 이미지 Alt 텍스트 개선 사항
    if (isset($results['images']['withoutAlt']) && $results['images']['withoutAlt'] > 0) {
        $recommendations[] = [
            'type' => 'important',
            'category' => '이미지/미디어',
            'issue' => $results['images']['withoutAlt'] . '개의 이미지에 Alt 텍스트가 없습니다.',
            'solution' => '모든 이미지에 의미있는 Alt 텍스트를 추가하세요.'
        ];
    }
    
    // 콘텐츠 길이 개선 사항
    if (isset($results['content']['wordCount']) && $results['content']['wordCount'] < MIN_CONTENT_WORDS) {
        $recommendations[] = [
            'type' => 'important',
            'category' => '콘텐츠',
            'issue' => '콘텐츠가 너무 짧습니다. (현재 ' . $results['content']['wordCount'] . '단어)',
            'solution' => '최소 ' . MIN_CONTENT_WORDS . '단어 이상으로 늘리세요.'
        ];
    }
    
    // 키워드 밀도 개선 사항
    if (!empty($keyword) && isset($results['content']['keywordDensity'])) {
        $density = $results['content']['keywordDensity'];
        if ($density < OPTIMAL_KEYWORD_DENSITY_MIN) {
            $recommendations[] = [
                'type' => 'recommended',
                'category' => '콘텐츠',
                'issue' => '키워드 밀도가 낮습니다. (현재 ' . $density . '%)',
                'solution' => '키워드를 좀 더 자연스럽게 포함시키세요. (권장: ' . OPTIMAL_KEYWORD_DENSITY_MIN . '-' . OPTIMAL_KEYWORD_DENSITY_MAX . '%)'
            ];
        } else if ($density > OPTIMAL_KEYWORD_DENSITY_MAX) {
            $recommendations[] = [
                'type' => 'important',
                'category' => '콘텐츠',
                'issue' => '키워드 밀도가 높습니다. (현재 ' . $density . '%)',
                'solution' => '키워드 사용을 줄이세요. (권장: ' . OPTIMAL_KEYWORD_DENSITY_MIN . '-' . OPTIMAL_KEYWORD_DENSITY_MAX . '%)'
            ];
        }
    }
    
    // 내부 링크 개선 사항
    if (isset($results['links']['internal']['count']) && $results['links']['internal']['count'] < 3) {
        $recommendations[] = [
            'type' => 'recommended',
            'category' => '콘텐츠',
            'issue' => '내부 링크가 부족합니다. (현재 ' . $results['links']['internal']['count'] . '개)',
            'solution' => '관련 페이지로의 내부 링크를 3-5개 추가하세요.'
        ];
    }
    
    return $recommendations;
}
?>
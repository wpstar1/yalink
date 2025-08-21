<?php
require_once 'config.php';

class SEOScraper {
    private $html;
    private $url;
    private $dom;
    
    public function __construct($url) {
        $this->url = $url;
        $this->fetchPage();
        $this->parseHTML();
    }
    
    private function fetchPage() {
        $ch = curl_init();
        
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => CURL_TIMEOUT,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false
        ]);
        
        $this->html = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_error($ch)) {
            curl_close($ch);
            throw new Exception('페이지를 가져올 수 없습니다: ' . curl_error($ch));
        }
        
        curl_close($ch);
        
        if ($httpCode >= 400) {
            throw new Exception('HTTP 오류: ' . $httpCode);
        }
        
        if (!$this->html) {
            throw new Exception('페이지 내용이 비어있습니다.');
        }
    }
    
    private function parseHTML() {
        $this->dom = new DOMDocument();
        
        // HTML 파싱 에러 억제
        libxml_use_internal_errors(true);
        
        // UTF-8 인코딩 처리
        $html = mb_convert_encoding($this->html, 'HTML-ENTITIES', 'UTF-8');
        $this->dom->loadHTML($html);
        
        libxml_clear_errors();
    }
    
    // 제목 태그 분석
    public function getTitle() {
        $titleNodes = $this->dom->getElementsByTagName('title');
        if ($titleNodes->length > 0) {
            $title = trim($titleNodes->item(0)->textContent);
            return [
                'content' => $title,
                'length' => mb_strlen($title),
                'score' => $this->scoreTitleLength(mb_strlen($title))
            ];
        }
        return ['content' => '', 'length' => 0, 'score' => 0];
    }
    
    // 메타 설명 분석
    public function getMetaDescription() {
        $xpath = new DOMXPath($this->dom);
        $metaNodes = $xpath->query("//meta[@name='description']");
        
        if ($metaNodes->length > 0) {
            $description = trim($metaNodes->item(0)->getAttribute('content'));
            return [
                'content' => $description,
                'length' => mb_strlen($description),
                'score' => $this->scoreMetaLength(mb_strlen($description))
            ];
        }
        return ['content' => '', 'length' => 0, 'score' => 0];
    }
    
    // H1 태그 분석
    public function getH1Tags() {
        $h1Nodes = $this->dom->getElementsByTagName('h1');
        $h1Tags = [];
        
        foreach ($h1Nodes as $h1) {
            $h1Tags[] = trim($h1->textContent);
        }
        
        return [
            'count' => count($h1Tags),
            'content' => $h1Tags,
            'score' => $this->scoreH1Count(count($h1Tags))
        ];
    }
    
    // 헤딩 구조 분석 (H1-H6)
    public function getHeadingStructure() {
        $headings = [];
        
        for ($i = 1; $i <= 6; $i++) {
            $nodes = $this->dom->getElementsByTagName('h' . $i);
            $headings['h' . $i] = [];
            
            foreach ($nodes as $node) {
                $headings['h' . $i][] = trim($node->textContent);
            }
        }
        
        return [
            'structure' => $headings,
            'score' => $this->scoreHeadingStructure($headings)
        ];
    }
    
    // 이미지 분석
    public function getImages() {
        $imgNodes = $this->dom->getElementsByTagName('img');
        $images = [];
        $withAlt = 0;
        $withoutAlt = 0;
        
        foreach ($imgNodes as $img) {
            $src = $img->getAttribute('src');
            $alt = $img->getAttribute('alt');
            
            $images[] = [
                'src' => $src,
                'alt' => $alt,
                'hasAlt' => !empty($alt)
            ];
            
            if (!empty($alt)) {
                $withAlt++;
            } else {
                $withoutAlt++;
            }
        }
        
        $total = count($images);
        $altPercentage = $total > 0 ? ($withAlt / $total) * 100 : 0;
        
        return [
            'total' => $total,
            'withAlt' => $withAlt,
            'withoutAlt' => $withoutAlt,
            'altPercentage' => round($altPercentage, 1),
            'images' => $images,
            'score' => $this->scoreImageAlt($altPercentage)
        ];
    }
    
    // 링크 분석
    public function getLinks() {
        $linkNodes = $this->dom->getElementsByTagName('a');
        $internal = [];
        $external = [];
        
        $currentDomain = parse_url($this->url, PHP_URL_HOST);
        
        foreach ($linkNodes as $link) {
            $href = $link->getAttribute('href');
            $text = trim($link->textContent);
            
            if (empty($href) || $href === '#') continue;
            
            // 상대 URL을 절대 URL로 변환
            if (strpos($href, 'http') !== 0) {
                if (strpos($href, '/') === 0) {
                    $href = parse_url($this->url, PHP_URL_SCHEME) . '://' . $currentDomain . $href;
                } else {
                    continue; // 상대 경로는 건너뛰기
                }
            }
            
            $linkDomain = parse_url($href, PHP_URL_HOST);
            
            if ($linkDomain === $currentDomain) {
                $internal[] = ['url' => $href, 'text' => $text];
            } else {
                $external[] = ['url' => $href, 'text' => $text];
            }
        }
        
        return [
            'internal' => [
                'count' => count($internal),
                'links' => $internal
            ],
            'external' => [
                'count' => count($external),
                'links' => $external
            ],
            'score' => $this->scoreLinkStructure(count($internal), count($external))
        ];
    }
    
    // 콘텐츠 분석
    public function getContentAnalysis($keyword = '') {
        // body 태그 내용만 추출
        $bodyNodes = $this->dom->getElementsByTagName('body');
        $bodyContent = '';
        
        if ($bodyNodes->length > 0) {
            $bodyContent = $bodyNodes->item(0)->textContent;
        }
        
        $text = extractTextFromHtml($bodyContent);
        $wordCount = countWords($text);
        
        $analysis = [
            'wordCount' => $wordCount,
            'characterCount' => mb_strlen($text),
            'score' => $this->scoreContentLength($wordCount)
        ];
        
        // 키워드 밀도 계산
        if (!empty($keyword)) {
            $density = calculateKeywordDensity($text, $keyword);
            $analysis['keywordDensity'] = round($density, 2);
            $analysis['keywordScore'] = $this->scoreKeywordDensity($density);
        }
        
        return $analysis;
    }
    
    // 페이지 속도 분석 (Google PageSpeed Insights API 사용)
    public function getPageSpeed() {
        if (empty(GOOGLE_API_KEY)) {
            return [
                'available' => false,
                'message' => 'Google API 키가 설정되지 않았습니다.'
            ];
        }
        
        $apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' . 
                  urlencode($this->url) . '&key=' . GOOGLE_API_KEY;
        
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $apiUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30
        ]);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        if ($response) {
            $data = json_decode($response, true);
            
            if (isset($data['lighthouseResult']['categories']['performance']['score'])) {
                $score = $data['lighthouseResult']['categories']['performance']['score'] * 100;
                return [
                    'available' => true,
                    'score' => round($score),
                    'rating' => $this->getSpeedRating($score)
                ];
            }
        }
        
        return [
            'available' => false,
            'message' => 'PageSpeed 데이터를 가져올 수 없습니다.'
        ];
    }
    
    // 점수 계산 함수들
    private function scoreTitleLength($length) {
        if ($length >= 30 && $length <= 60) return 100;
        if ($length >= 20 && $length <= 70) return 80;
        if ($length >= 10 && $length <= 80) return 60;
        return 20;
    }
    
    private function scoreMetaLength($length) {
        if ($length >= 120 && $length <= 160) return 100;
        if ($length >= 100 && $length <= 180) return 80;
        if ($length >= 50 && $length <= 200) return 60;
        return 20;
    }
    
    private function scoreH1Count($count) {
        if ($count === 1) return 100;
        if ($count === 0) return 0;
        return 50; // 복수 H1은 권장하지 않음
    }
    
    private function scoreHeadingStructure($headings) {
        $score = 0;
        $hasH1 = !empty($headings['h1']);
        $hasH2 = !empty($headings['h2']);
        
        if ($hasH1) $score += 50;
        if ($hasH2) $score += 30;
        if (!empty($headings['h3'])) $score += 20;
        
        return min(100, $score);
    }
    
    private function scoreImageAlt($percentage) {
        if ($percentage >= 90) return 100;
        if ($percentage >= 70) return 80;
        if ($percentage >= 50) return 60;
        if ($percentage >= 30) return 40;
        return 20;
    }
    
    private function scoreLinkStructure($internal, $external) {
        $score = 0;
        
        if ($internal >= 3) $score += 50;
        else if ($internal >= 1) $score += 30;
        
        if ($external >= 2) $score += 50;
        else if ($external >= 1) $score += 30;
        
        return $score;
    }
    
    private function scoreContentLength($wordCount) {
        if ($wordCount >= 1000) return 100;
        if ($wordCount >= 500) return 80;
        if ($wordCount >= 300) return 60;
        if ($wordCount >= 150) return 40;
        return 20;
    }
    
    private function scoreKeywordDensity($density) {
        if ($density >= OPTIMAL_KEYWORD_DENSITY_MIN && $density <= OPTIMAL_KEYWORD_DENSITY_MAX) {
            return 100;
        }
        if ($density >= 0.3 && $density <= 3.0) {
            return 70;
        }
        return 30;
    }
    
    private function getSpeedRating($score) {
        if ($score >= 90) return 'Fast';
        if ($score >= 50) return 'Average';
        return 'Slow';
    }
}
?>
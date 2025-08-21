# 깃하이라이트 (Git Highlight)

매일 업데이트되는 GitHub 인기 프로젝트를 자동으로 요약해주는 웹 서비스입니다.

## 🌟 주요 기능

- GitHub 트렌딩 페이지에서 인기 저장소 자동 수집
- OpenAI API를 활용한 프로젝트 README 자동 요약
- 프로젝트별 주요 코드 예시 자동 추출
- 깔끔한 카드 형태의 UI로 정보 제공

## 🛠️ 기술 스택

- **백엔드**: Python, Flask
- **프론트엔드**: HTML, CSS
- **데이터 수집**: BeautifulSoup4, Requests
- **AI 요약**: OpenAI GPT API

## ⚙️ 설치 및 실행 방법

1. 저장소 복제
```
git clone [저장소 URL]
cd 깃하이라이트
```

2. 의존성 설치
```
pip install -r requirements.txt
```

3. `.env` 파일 설정 (OpenAI API 키, GitHub 토큰)
```
OPENAI_API_KEY="your_openai_api_key"
# GITHUB_TOKEN="your_github_token"  # 선택사항
```

4. 데이터 수집 스크립트 실행
```
python trending_fetcher.py
```

5. 웹 서버 실행
```
python app.py
```

6. 웹 브라우저에서 `http://localhost:5000` 접속

## 📝 사용 방법

- 웹 서비스에 접속하면 자동으로 오늘의 인기 GitHub 프로젝트 목록과 요약을 볼 수 있습니다.
- 매일 새로운 트렌딩 프로젝트가 업데이트됩니다.
- 각 프로젝트 카드에는 요약, 주요 기능, 코드 예시가 포함되어 있습니다.

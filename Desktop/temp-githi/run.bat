@echo off
echo 깃하이라이트 서비스를 시작합니다...

echo.
echo 1. GitHub 트렌딩 프로젝트 데이터 수집 중...
python trending_fetcher.py

echo.
echo 2. 웹 서버 시작 중...
start python app.py

echo.
echo 3. 브라우저에서 깃하이라이트 열기...
timeout /t 3 > nul
start http://localhost:5000

echo.
echo 깃하이라이트가 성공적으로 시작되었습니다!
echo 브라우저에서 http://localhost:5000 으로 접속하세요.
echo.

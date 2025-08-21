import os
import subprocess
import webbrowser
import time
import sys

def main():
    print("🌟 깃하이라이트 서비스를 시작합니다...")
    
    # 현재 디렉토리를 스크립트 위치로 변경
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # 패키지 설치 확인
    try:
        import flask
        import requests
        import bs4
        import dotenv
        import openai
        print("✅ 필요한 패키지가 이미 설치되어 있습니다.")
    except ImportError:
        print("📦 필요한 패키지를 설치합니다...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    # GitHub 트렌딩 프로젝트 데이터 수집
    print("\n📊 GitHub 트렌딩 프로젝트 데이터 수집 중...")
    subprocess.run([sys.executable, "trending_fetcher.py"])
    
    # 웹 서버 시작 (백그라운드에서 실행)
    print("\n🚀 웹 서버 시작 중...")
    if os.name == 'nt':  # Windows
        flask_process = subprocess.Popen(["start", "python", "app.py"], shell=True)
    else:  # Linux/Mac
        flask_process = subprocess.Popen([sys.executable, "app.py"])
    
    # 웹 서버가 시작될 때까지 잠시 대기
    print("⏳ 웹 서버 시작 대기 중...")
    time.sleep(3)
    
    # 브라우저에서 웹사이트 열기
    print("\n🌐 브라우저에서 깃하이라이트 열기...")
    webbrowser.open("http://localhost:5000")
    
    print("\n✨ 깃하이라이트가 성공적으로 시작되었습니다!")
    print("   브라우저에서 http://localhost:5000 으로 접속하세요.")
    
    # 프로세스가 종료되지 않도록 유지
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 깃하이라이트를 종료합니다...")
        flask_process.terminate()

if __name__ == "__main__":
    main()

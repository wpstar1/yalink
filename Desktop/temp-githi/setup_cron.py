#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
이 스크립트는 PythonAnywhere 또는 기타 호스팅 환경에서 
GitHub 트렌딩 데이터 수집 작업을 예약하는 방법을 설명합니다.
"""

import sys
import os

def setup_pythonanywhere_task():
    """
    PythonAnywhere에서 작업을 설정하는 방법 안내
    """
    print("=== PythonAnywhere에서 작업 설정하기 ===")
    print("1. PythonAnywhere 계정에 로그인")
    print("2. 대시보드에서 'Tasks' 탭 열기")
    print("3. 매일 특정 시간(예: 자정)에 실행되도록 예약 작업 생성")
    print("4. 다음 명령어를 작업으로 추가:")
    print(f"   python {os.path.join(os.getcwd(), 'fetch_github_trending.py')}")
    print("\n자동으로 매일 자정에 GitHub 트렌딩 데이터를 수집합니다.")

def setup_heroku_scheduler():
    """
    Heroku Scheduler 사용 안내
    """
    print("=== Heroku Scheduler 설정하기 ===")
    print("1. Heroku 계정에 로그인 및 앱 생성")
    print("2. 다음 명령어로 Heroku Scheduler 애드온 추가:")
    print("   heroku addons:create scheduler:standard")
    print("3. 다음 명령어로 스케줄러 대시보드 열기:")
    print("   heroku addons:open scheduler")
    print("4. 'Add Job' 버튼 클릭 후 다음 명령어 추가:")
    print("   python fetch_github_trending.py")
    print("5. 매일 실행되도록 'Daily' 옵션 선택 및 시간 설정")

def setup_aws_lambda():
    """
    AWS Lambda + EventBridge를 사용한 작업 예약 안내
    """
    print("=== AWS Lambda + EventBridge 설정하기 ===")
    print("1. AWS Management Console에 로그인")
    print("2. Lambda 함수 생성 (Python 런타임 선택)")
    print("3. fetch_github_trending.py 코드를 Lambda 함수에 업로드")
    print("4. 필요한 라이브러리를 Layer로 추가 또는 배포 패키지에 포함")
    print("5. EventBridge(CloudWatch Events)에서 cron 표현식을 사용하여 일일 트리거 생성:")
    print("   cron(0 0 * * ? *) # 매일 UTC 자정에 실행")

def setup_github_actions():
    """
    GitHub Actions를 사용한 작업 예약 안내
    """
    github_workflow = """name: Daily GitHub Trending Fetch

on:
  schedule:
    - cron: '0 0 * * *'  # 매일 UTC 자정에 실행
  workflow_dispatch:      # 수동 트리거 옵션 추가

jobs:
  fetch-trending:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
          
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          
      - name: Fetch GitHub trending
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SECRET: ${{ secrets.SUPABASE_SECRET }}
        run: python fetch_github_trending.py
        
      - name: Commit changes
        run: |
          git config --local user.email "actions@github.com"
          git config --local user.name "GitHub Actions"
          git add data/
          git commit -m "Update GitHub trending data for $(date +'%Y-%m-%d')" || echo "No changes to commit"
          
      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          branch: ${{ github.ref }}
"""
    
    print("=== GitHub Actions 워크플로우 설정하기 ===")
    print("1. 프로젝트를 GitHub 저장소로 푸시")
    print("2. 저장소에 .github/workflows 디렉토리 생성")
    print("3. 아래 내용으로 .github/workflows/fetch-trending.yml 파일 생성:")
    print("\n" + github_workflow)
    print("\n4. GitHub 저장소의 'Settings' > 'Secrets' 에서 다음 시크릿 설정:")
    print("   - OPENAI_API_KEY")
    print("   - SUPABASE_URL")
    print("   - SUPABASE_SECRET")

def main():
    """
    메인 함수
    """
    print("\n== GitHub 트렌딩 데이터 자동 수집 설정 가이드 ==\n")
    
    options = {
        "1": ("PythonAnywhere 작업 설정", setup_pythonanywhere_task),
        "2": ("Heroku Scheduler 설정", setup_heroku_scheduler),
        "3": ("AWS Lambda + EventBridge 설정", setup_aws_lambda),
        "4": ("GitHub Actions 워크플로우 설정", setup_github_actions)
    }
    
    while True:
        print("\n사용할 호스팅 환경을 선택하세요:")
        for key, (name, _) in options.items():
            print(f"{key}. {name}")
        print("q. 종료")
        
        choice = input("\n선택: ").strip()
        
        if choice.lower() == 'q':
            print("설정 가이드를 종료합니다.")
            break
        
        if choice in options:
            _, function = options[choice]
            function()
        else:
            print("잘못된 선택입니다. 다시 선택해주세요.")

if __name__ == "__main__":
    main()

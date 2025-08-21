#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import json
import time
import random
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import logging
import sys
import openai
from dotenv import load_dotenv

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("github_trending.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("github_trending")

# 환경 변수 로드
load_dotenv()

# API 키 설정
openai.api_key = os.environ.get("OPENAI_API_KEY")

# Supabase 설정
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SECRET")

# 헤더 설정
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
}

def get_github_trending(language=None):
    """GitHub 트렌딩 페이지에서 인기 저장소 정보를 가져옵니다."""
    url = "https://github.com/trending"
    if language:
        url += f"/{language}"
    
    logger.info(f"GitHub 트렌딩 URL 요청: {url}")
    
    # 요청 실패 시 최대 3번 재시도
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=HEADERS, timeout=10)
            response.raise_for_status()
            break
        except requests.exceptions.RequestException as e:
            logger.error(f"GitHub 트렌딩 요청 실패 (시도 {attempt+1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                time.sleep(2)  # 재시도 전 잠시 대기
            else:
                logger.error("최대 재시도 횟수 초과. GitHub 트렌딩 데이터를 가져오지 못했습니다.")
                return []
    
    soup = BeautifulSoup(response.text, "html.parser")
    repo_items = soup.select("article.Box-row")
    
    trending_repos = []
    
    for item in repo_items:
        try:
            # 저장소 이름
            name_element = item.select_one("h2.h3 a")
            if not name_element:
                continue
                
            full_name = name_element.text.strip().replace("\n", "").replace(" ", "")
            
            # 링크
            link = f"https://github.com/{full_name}"
            
            # 설명
            description = ""
            desc_element = item.select_one("p")
            if desc_element:
                description = desc_element.text.strip()
            
            # 스타 수
            star_element = item.select_one("span.d-inline-block.float-sm-right")
            stars = "0"
            if star_element:
                stars_text = star_element.text.strip()
                stars = stars_text
            
            # 언어
            language_element = item.select_one("span[itemprop='programmingLanguage']")
            language = ""
            if language_element:
                language = language_element.text.strip()
            
            trending_repos.append({
                "name": full_name,
                "link": link,
                "description": description,
                "stars": stars,
                "language": language
            })
        except Exception as e:
            logger.error(f"저장소 정보 파싱 중 오류: {e}")
    
    logger.info(f"{len(trending_repos)}개의 GitHub 트렌딩 저장소를 가져왔습니다.")
    return trending_repos

def generate_summary_with_gpt(repo_data):
    """GPT를 사용하여 저장소 요약 및 특징을 생성합니다."""
    try:
        description = repo_data.get("description", "")
        name = repo_data.get("name", "")
        language = repo_data.get("language", "")
        stars = repo_data.get("stars", "")
        
        prompt = f"""
다음은 GitHub 저장소에 대한 정보입니다:
- 저장소 이름: {name}
- 설명: {description}
- 주요 언어: {language}
- 스타 수: {stars}

이 정보를 바탕으로 아래 두 가지를 작성해주세요:
1. 간결한 한국어 요약 (3-4문장, 최대 150자)
2. 이 저장소의 주요 특징 3가지 (각 특징은 한 문장으로, 불릿 포인트로 구성)
3. 코드나 기술적 특징을 보여주는 짧은 예시 (주석 포함)

한국어로 작성해 주세요.
"""

        response = openai.ChatCompletion.create(
            model="gpt-4",  # or "gpt-3.5-turbo" for a cheaper option
            messages=[
                {"role": "system", "content": "당신은 기술 콘텐츠 작가입니다. GitHub 저장소를 한국어로 요약하고 핵심 특징을 추출합니다."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        
        # 응답 파싱
        parts = content.split("\n\n")
        summary = parts[0].replace("요약: ", "").strip() if len(parts) > 0 else ""
        
        feature_section = ""
        code_section = ""
        
        for part in parts:
            if "특징" in part.lower() or "기능" in part.lower():
                feature_section = part
            elif "코드" in part.lower() or "예시" in part.lower():
                code_section = part
        
        if not feature_section and len(parts) > 1:
            feature_section = parts[1]
        
        if not code_section and len(parts) > 2:
            code_section = parts[2]
        
        # 특징에서 불릿 포인트, 숫자 등 제거
        feature_lines = feature_section.split("\n")
        cleaned_features = []
        for line in feature_lines:
            line = line.strip()
            if line and not line.lower().startswith(("특징", "주요 특징", "기능", "주요 기능")):
                # 불릿 포인트, 숫자 등 제거
                cleaned_line = line.lstrip("- 123456789.•✓✔︎☑︎").strip()
                if cleaned_line:
                    cleaned_features.append(cleaned_line)
        
        # 코드 섹션 정리
        if code_section:
            # 헤더 제거
            lines = code_section.split("\n")
            code_lines = []
            for i, line in enumerate(lines):
                if i == 0 and ("코드" in line.lower() or "예시" in line.lower()):
                    continue
                code_lines.append(line)
            code_section = "\n".join(code_lines).strip()
        
        return {
            "summary": summary,
            "feature": "\n".join(cleaned_features),
            "code": code_section
        }
    except Exception as e:
        logger.error(f"GPT 요약 생성 중 오류: {e}")
        return {
            "summary": f"{name}은 GitHub에서 {stars}개의 스타를 받은 {language} 프로젝트입니다. {description}",
            "feature": "- 특징 정보를 가져오지 못했습니다.",
            "code": "// 코드 예시를 가져오지 못했습니다."
        }

def save_to_json(repos, filename):
    """저장소 정보를 JSON 파일로 저장합니다."""
    try:
        data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
        if not os.path.exists(data_dir):
            os.makedirs(data_dir)
        
        filepath = os.path.join(data_dir, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(repos, f, ensure_ascii=False, indent=2)
        
        logger.info(f"저장소 정보를 {filepath}에 저장했습니다.")
        return True
    except Exception as e:
        logger.error(f"JSON 파일 저장 중 오류: {e}")
        return False

def save_to_supabase(repos, date):
    """저장소 정보를 Supabase에 저장합니다."""
    try:
        # REST API 직접 호출
        import requests
        
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
        
        for repo in repos:
            # 저장소 ID 값이 있는지 확인하고 제거
            if "id" in repo:
                del repo["id"]
                
            # collected_date 추가
            repo["collected_date"] = date
            
            # stars 값을 정수로 변환
            if "stars" in repo:
                stars = repo["stars"]
                try:
                    if isinstance(stars, str):
                        if 'k' in stars.lower():
                            # k가 있으면 1000 곱하기 (예: 50k -> 50000)
                            stars = stars.lower().replace('k+', '').replace('k', '').strip()
                            stars_num = int(float(stars) * 1000)
                        else:
                            # 그 외의 경우는 숫자만 추출
                            stars_num = int(''.join(c for c in stars if c.isdigit()))
                        repo["stars"] = stars_num
                    else:
                        repo["stars"] = int(stars)
                except:
                    repo["stars"] = 0
            
            endpoint = f"{SUPABASE_URL}/rest/v1/repositories"
            response = requests.post(endpoint, headers=headers, json=repo)
            
            if response.status_code not in [200, 201, 204]:
                logger.error(f"Supabase 저장 실패: {response.status_code} - {response.text}")
                
        logger.info(f"저장소 정보를 Supabase에 저장했습니다.")
        return True
    except Exception as e:
        logger.error(f"Supabase 저장 중 오류: {e}")
        return False

def main():
    """메인 함수"""
    logger.info("GitHub 트렌딩 데이터 수집 시작")
    
    # 오늘 날짜
    today = datetime.now().strftime("%Y-%m-%d")
    
    # 한국어 저장소와 일반 트렌딩 저장소 모두 수집
    trending_repos = get_github_trending()
    korean_repos = get_github_trending("korean")
    
    # 중복 제거를 위해 이름으로 사전 생성
    combined_repos = {}
    
    for repo in korean_repos + trending_repos:
        if repo["name"] not in combined_repos:
            # GPT로 요약 생성
            logger.info(f"저장소 {repo['name']} 요약 생성 중...")
            summary_data = generate_summary_with_gpt(repo)
            
            # 요약 정보 추가
            repo.update(summary_data)
            
            # 사전에 추가
            combined_repos[repo["name"]] = repo
            
            # 요청 간 지연 (API 제한 회피)
            time.sleep(random.uniform(1, 3))
    
    # 사전을 리스트로 변환
    final_repos = list(combined_repos.values())
    
    # JSON 파일 저장
    filename = f"{today}.json"
    json_saved = save_to_json(final_repos, filename)
    
    # Supabase 저장
    supabase_saved = save_to_supabase(final_repos, today)
    
    if json_saved and supabase_saved:
        logger.info("GitHub 트렌딩 데이터 수집 및 저장 완료")
    else:
        logger.warning("일부 저장 작업이 실패했습니다")
    
    return final_repos

if __name__ == "__main__":
    main()

import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime
import re
import base64
from dotenv import load_dotenv
import openai
from models import Repository, supabase_client

# .env 파일 로드
load_dotenv()

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

def fetch_trending_repos(language=None, since="daily", limit=10):
    """GitHub 트렌딩 페이지에서 인기 저장소 목록을 가져옵니다"""
    url = "https://github.com/trending"
    
    if language:
        url += f"/{language}"
    
    url += f"?since={since}"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    
    repos = []
    repo_items = soup.select("article.Box-row")
    
    for item in repo_items[:limit]:
        try:
            # 저장소 이름 추출 (username/reponame 형식)
            repo_name = item.select_one("h2 a").get_text(strip=True).replace(" ", "").replace("\n", "")
            
            # 별 개수 추출 및 숫자 변환
            stars_text = item.select_one("span.d-inline-block.float-sm-right").get_text(strip=True)
            stars = int(re.sub(r'[^0-9]', '', stars_text.replace(',', '')))
            
            # 저장소 URL 생성
            repo_url = f"https://github.com/{repo_name}"
            
            repos.append({
                "name": repo_name,
                "link": repo_url,
                "stars": stars
            })
        except Exception as e:
            print(f"Error parsing repo: {e}")
    
    return repos

def get_repo_readme(repo_name):
    """GitHub API를 사용하여 저장소의 README 내용을 가져옵니다"""
    
    # GitHub API 토큰 (익명 요청 시 속도 제한이 있습니다)
    github_token = os.getenv("GITHUB_TOKEN", "")
    
    headers = {}
    if github_token:
        headers["Authorization"] = f"token {github_token}"
    
    api_url = f"https://api.github.com/repos/{repo_name}/readme"
    
    try:
        response = requests.get(api_url, headers=headers)
        if response.status_code == 200:
            content = response.json().get("content", "")
            # Base64로 인코딩된 README 내용을 디코딩
            readme_text = base64.b64decode(content).decode("utf-8")
            return readme_text
        else:
            print(f"Failed to fetch README: {response.status_code}")
            return "README를 가져오는 데 실패했습니다."
    except Exception as e:
        print(f"Error fetching README: {e}")
        return "README를 가져오는 데 오류가 발생했습니다."

def extract_code_examples(readme_text):
    """README에서 코드 예제를 추출합니다"""
    # 코드 블록 패턴: ```언어명\n코드\n```
    code_blocks = re.findall(r'```(?:\w+)?\n(.*?)\n```', readme_text, re.DOTALL)
    
    # 대체 패턴: `코드`
    if not code_blocks:
        inline_code = re.findall(r'`([^`]+)`', readme_text)
        if inline_code:
            return inline_code[0]
    
    # 코드 블록 찾기에 실패하면 명령어 형태 텍스트 찾기 시도
    if not code_blocks:
        command_lines = re.findall(r'(?:^|\n)(?:[$>]|npm|yarn|pip|python|git) [^\n]+', readme_text)
        if command_lines:
            return command_lines[0].strip()
    
    return code_blocks[0] if code_blocks else "코드 예시를 찾을 수 없습니다"

def summarize_repo_with_gpt(repo_data, readme_text):
    """OpenAI GPT를 사용하여 저장소 README를 요약합니다"""
    
    # 프롬프트 생성
    prompt = f"""
너는 똑똑한 개발 도우미야. 아래 GitHub 프로젝트 정보를 보고, 다음 조건에 맞춰 요약해줘.

조건:
1. 모든 결과는 **한국어**로 출력해줘.
2. 이 프로젝트가 **무엇을 하는지** 2~3문장으로 요약해줘.
3. 이 프로젝트의 **주요 기능**을 한 문장으로 정리해줘.

입력:
---
프로젝트명: {repo_data['name']}
GitHub 링크: {repo_data['link']}
README 내용:
\"\"\"{readme_text[:3000]}\"\"\"
Star 수: {repo_data['stars']}
---

출력 형식:
---
요약: (한글로 2~3문장 요약)
기능: (한 문장 기능 정리)
"""

    try:
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes GitHub repositories in Korean."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=300
        )
        
        # 응답에서 요약과 기능 추출
        summary_text = response.choices[0].message.content
        
        # 요약과 기능 구분
        summary = ""
        feature = ""
        
        for line in summary_text.split('\n'):
            if line.startswith("요약:"):
                summary = line.replace("요약:", "").strip()
            elif line.startswith("기능:"):
                feature = line.replace("기능:", "").strip()
        
        # 기본값 설정
        if not summary:
            summary = f"이 프로젝트는 {repo_data['name'].split('/')[-1]} 관련 기능을 제공하는 오픈소스 프로젝트입니다."
        if not feature:
            feature = f"다양한 {repo_data['name'].split('/')[-1]} 관련 기능을 제공합니다."
            
        return summary, feature
        
    except Exception as e:
        print(f"OpenAI API 요청 중 오류 발생: {e}")
        return (
            f"이 프로젝트는 {repo_data['name'].split('/')[-1]} 관련 기능을 제공하는 오픈소스 프로젝트입니다.",
            f"다양한 {repo_data['name'].split('/')[-1]} 관련 기능을 제공합니다."
        )

def save_repo_to_db(repo_data):
    """저장소 데이터를 Supabase에 저장"""
    try:
        # 이미 있는 저장소인지 확인
        response = supabase_client.table('repositories').select('*').eq('name', repo_data['name']).execute()
        
        if response.data and len(response.data) > 0:
            # 이미 있는 경우 데이터 업데이트
            repo_id = response.data[0]['id']
            update_data = {
                'link': repo_data['link'],
                'summary': repo_data['summary'],
                'feature': repo_data['feature'],
                'code': repo_data['code'],
                'stars': repo_data['stars'],
                'collected_date': datetime.utcnow().date().isoformat()
            }
            supabase_client.table('repositories').update(update_data).eq('id', repo_id).execute()
        else:
            # 새 저장소 추가
            new_repo_data = {
                'name': repo_data['name'],
                'link': repo_data['link'],
                'summary': repo_data['summary'],
                'feature': repo_data['feature'],
                'code': repo_data['code'],
                'stars': repo_data['stars'],
                'collected_date': datetime.utcnow().date().isoformat(),
                'created_at': datetime.utcnow().isoformat()
            }
            supabase_client.table('repositories').insert(new_repo_data).execute()
        
        return True
    except Exception as e:
        print(f"Supabase 저장 중 오류 발생: {e}")
        return False

def summarize_repo(repo_data, readme_text):
    """저장소를 요약합니다"""
    
    # OpenAI API로 요약 생성
    summary, feature = summarize_repo_with_gpt(repo_data, readme_text)
    
    # README에서 코드 예시 추출
    code_example = extract_code_examples(readme_text)
    
    # 300자를 초과하는 코드 예시 자르기
    if len(code_example) > 300:
        code_example = code_example[:300] + "..."
    
    return {
        "name": repo_data["name"],
        "link": repo_data["link"],
        "summary": summary,
        "feature": feature,
        "code": code_example,
        "stars": repo_data["stars"]
    }

def main():
    """메인 함수: GitHub 트렌딩 프로젝트를 가져와 요약하고 Supabase에 저장"""
    print("GitHub 트렌딩 리포지토리 가져오는 중...")
    trending_repos = fetch_trending_repos(limit=5)  # 상위 5개만 가져오기
    
    results = []
    for repo in trending_repos:
        print(f"처리 중: {repo['name']}")
        readme = get_repo_readme(repo['name'])
        repo_data = summarize_repo(repo, readme)
        results.append(repo_data)
        
        # Supabase에 저장
        save_repo_to_db(repo_data)
    
    # 오늘 날짜로 파일 이름 생성 (백업용)
    today = datetime.now().strftime("%Y-%m-%d")
    output_dir = "data"
    
    # 디렉토리가 없으면 생성
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # JSON 파일로 저장 (백업용)
    output_file = os.path.join(output_dir, f"{today}.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"완료! {len(results)}개의 프로젝트가 Supabase에 저장되었습니다.")

if __name__ == "__main__":
    main()

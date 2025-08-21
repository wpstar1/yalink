from flask import Flask, render_template, jsonify, request, redirect, url_for, flash, make_response
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
import json
import os
import glob
from datetime import datetime, timedelta
from models import User, Repository, Bookmark, Comment, supabase_client
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'githighlight-secret-key')

# 로그인 매니저 설정
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.get_by_id(user_id)

@app.route("/")
def index():
    """메인 페이지"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    try:
        # 1. 먼저 JSON 파일에서 데이터 로드 시도 (우선순위 변경)
        json_file = f"data/{today}.json"
        if os.path.exists(json_file):
            with open(json_file, "r", encoding="utf-8") as f:
                repos = json.load(f)
                print(f"JSON 파일에서 {len(repos)}개의 프로젝트를 로드했습니다.")
        else:
            # 가장 최신 JSON 파일 찾기
            data_files = glob.glob("data/*.json")
            if data_files:
                latest_file = sorted(data_files, reverse=True)[0]
                with open(latest_file, "r", encoding="utf-8") as f:
                    repos = json.load(f)
                today = os.path.basename(latest_file).replace(".json", "")
                print(f"최신 JSON 파일({latest_file})에서 {len(repos)}개의 프로젝트를 로드했습니다.")
            else:
                # 2. JSON 파일이 없으면 데이터베이스에서 시도
                today_date = datetime.now().date().isoformat()
                response = supabase_client.table('repositories').select('*').eq('collected_date', today_date).execute()
                repositories = [Repository(**repo) for repo in response.data]
                
                if not repositories:
                    # 최신 날짜 조회
                    latest_date = Repository.get_latest_date()
                    if latest_date:
                        response = supabase_client.table('repositories').select('*').eq('collected_date', latest_date).execute()
                        repositories = [Repository(**repo) for repo in response.data]
                        today = datetime.strptime(latest_date, "%Y-%m-%d").strftime("%Y-%m-%d")
                
                repos = [repo.to_dict() for repo in repositories]
                print(f"데이터베이스에서 {len(repos)}개의 프로젝트를 로드했습니다.")
        
        # 최신 순서대로 정렬 (기존 별점 정렬 대신 최신순 정렬)
        # JSON 파일에 추가된 순서대로 유지하기 위해 리스트를 뒤집음
        repos = list(reversed(repos))
        print(f"프로젝트를 최신순으로 정렬했습니다.")
    
    except Exception as e:
        print(f"데이터 로딩 중 오류 발생: {e}")
        repos = []
    
    # 사용자가 로그인 상태이면 북마크 정보 추가
    if current_user.is_authenticated:
        # 사용자의 북마크 가져오기
        user_bookmarks = current_user.bookmarks
        bookmarked_repo_ids = {bookmark.repo_id: bookmark.id for bookmark in user_bookmarks}
        
        # 저장소 목록에 북마크 여부 추가
        for repo in repos:
            repo_obj = Repository.get_by_name(repo['name'])
            if repo_obj:
                # 저장소 ID 추가 (댓글 기능을 위해)
                repo['id'] = repo_obj.id
                repo['bookmarked'] = repo_obj.id in bookmarked_repo_ids
                if repo['bookmarked']:
                    repo['bookmark_id'] = bookmarked_repo_ids[repo_obj.id]
                
                # 댓글 수 추가
                try:
                    # 직접 API 호출로 댓글 수 조회
                    import requests
                    
                    # Supabase 정보
                    supabase_url = os.environ.get('SUPABASE_URL')
                    supabase_key = os.environ.get('SUPABASE_SECRET')
                    
                    headers = {
                        'apikey': supabase_key,
                        'Authorization': f'Bearer {supabase_key}',
                        'Content-Type': 'application/json'
                    }
                    
                    endpoint = f"{supabase_url}/rest/v1/comments?repo_id=eq.{repo_obj.id}&select=id"
                    response = requests.get(endpoint, headers=headers)
                    
                    if response.status_code == 200:
                        repo['comment_count'] = len(response.json())
                    else:
                        repo['comment_count'] = 0
                except Exception as e:
                    print(f"댓글 수 조회 중 오류: {e}")
                    repo['comment_count'] = 0
            else:
                # 저장소가 DB에 없으면 저장
                new_repo = Repository(
                    name=repo['name'],
                    link=repo['link'],
                    summary=repo['summary'],
                    feature=repo['feature'],
                    code=repo['code'],
                    stars=repo['stars'],
                    collected_date=today
                )
                new_repo.save()
                repo['id'] = new_repo.id
                repo['bookmarked'] = False
                repo['comment_count'] = 0

    print(f"총 {len(repos)}개의 프로젝트를 표시합니다.")
    return render_template("index.html", repos=repos, today=today)

@app.route("/api/repositories")
def get_repositories():
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        
        # 데이터 디렉토리의 모든 JSON 파일 찾기
        json_files = glob.glob('data/*.json')
        if not json_files:
            return jsonify({'success': False, 'message': '데이터를 찾을 수 없습니다.'})
        
        # 가장 최근 파일 선택 (파일명 기준)
        latest_file = max(json_files)
        
        with open(latest_file, 'r', encoding='utf-8') as f:
            repos_data = json.load(f)
        
        # 시작 인덱스와 종료 인덱스 계산
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        
        # 페이지에 해당하는 저장소 데이터 추출
        paginated_repos = repos_data[start_idx:end_idx]
        
        return jsonify({
            'success': True,
            'repositories': paginated_repos,
            'hasMore': end_idx < len(repos_data)
        })
    except Exception as e:
        app.logger.error(f"저장소 API 호출 중 오류 발생: {str(e)}")
        return jsonify({'success': False, 'message': str(e)})

@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
        
    error = None
    username = request.cookies.get('saved_username', '')
    remember = bool(username)
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        remember_me = 'remember' in request.form
        
        user = User.get_by_username(username)
        
        if user and user.check_password(password):
            login_user(user)
            
            # 쿠키에 아이디 저장 설정
            response = make_response(redirect(url_for('index')))
            if remember_me:
                response.set_cookie('saved_username', username, max_age=30*24*60*60)  # 30일 유지
            else:
                response.delete_cookie('saved_username')
                
            return response
        else:
            error = '아이디 또는 비밀번호가 올바르지 않습니다.'
    
    return render_template('login.html', error=error, username=username, remember=remember)

@app.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
        
    error = None
    username = ''
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        password_confirm = request.form.get('password_confirm')
        
        # 유효성 검사
        if len(username) < 4 or len(username) > 20:
            error = '아이디는 4~20자 사이로 입력해주세요.'
        elif not username.isalnum():
            error = '아이디는 영문자와 숫자만 사용 가능합니다.'
        elif len(password) < 4:
            error = '비밀번호는 4자 이상 입력해주세요.'
        elif password != password_confirm:
            error = '비밀번호가 일치하지 않습니다.'
        else:
            # 이미 사용 중인 사용자명인지 확인
            existing_user = User.get_by_username(username)
            if existing_user:
                error = '이미 사용 중인 아이디입니다.'
            else:
                # 사용자 생성
                user = User(username=username)
                user.set_password(password)
                user.save()
                
                # 자동 로그인
                login_user(user)
                return redirect(url_for('index'))
    
    return render_template('register.html', error=error, username=username)

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route("/about")
def about():
    return render_template('about.html')

@app.route("/add_bookmark", methods=["POST"])
@login_required
def add_bookmark():
    try:
        # 요청 데이터에서 저장소 이름 가져오기
        repo_name = request.json.get('repo_name')
        if not repo_name:
            return jsonify({"success": False, "message": "저장소 이름이 필요합니다."})
            
        # 디버깅 정보 출력
        print(f"북마크 추가 시도: {repo_name}, 사용자: {current_user.id}")
        
        # 저장소 정보 가져오기
        repo = Repository.get_by_name(repo_name)
        
        if not repo:
            # 데이터베이스에 저장소 데이터가 없는 경우, JSON 파일에서 찾기
            try:
                found = False
                data_files = glob.glob("data/*.json")
                
                for file in data_files:
                    with open(file, "r", encoding="utf-8") as f:
                        repos_data = json.load(f)
                        for repo_data in repos_data:
                            if repo_data['name'] == repo_name:
                                # 데이터베이스에 저장소 추가
                                repo = Repository(
                                    name=repo_data['name'],
                                    link=repo_data['link'],
                                    summary=repo_data['summary'],
                                    feature=repo_data['feature'],
                                    code=repo_data['code'],
                                    stars=repo_data['stars'],
                                    collected_date=datetime.now().date().isoformat()
                                )
                                repo.save()
                                found = True
                                print(f"저장소 생성됨: {repo.id}")
                                break
                    if found:
                        break
                        
                if not found:
                    return jsonify({"success": False, "message": "프로젝트를 찾을 수 없습니다."})
            except Exception as e:
                print(f"JSON 파일 처리 중 오류: {e}")
                return jsonify({"success": False, "message": f"오류 발생: {e}"})
        
        # repo가 없거나 id가 없는 경우 처리
        if not repo or not hasattr(repo, 'id') or not repo.id:
            print(f"유효하지 않은 저장소 객체: {repo}")
            return jsonify({"success": False, "message": "유효하지 않은 저장소 정보입니다."})
            
        # 이미 북마크가 있는지 확인
        existing = Bookmark.get_by_user_repo(current_user.id, repo.id)
        if existing:
            return jsonify({"success": False, "message": "이미 북마크에 추가된 프로젝트입니다."})
        
        # 북마크 추가
        bookmark = Bookmark(user_id=current_user.id, repo_id=repo.id)
        bookmark.save()
        
        print(f"북마크 추가 성공: {bookmark.id}, 레포: {repo.id}")
        return jsonify({"success": True, "bookmark_id": bookmark.id})
    
    except Exception as e:
        print(f"북마크 추가 중 예외 발생: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "message": f"북마크 추가 중 오류: {str(e)}"})

@app.route("/bookmark/<path:repo_name>", methods=["POST"])
@login_required
def old_add_bookmark(repo_name):
    try:
        print(f"기존 경로로 북마크 추가 시도: {repo_name}")
        # 디버깅 정보 출력
        print(f"북마크 추가 시도: {repo_name}, 사용자: {current_user.id}")
        
        # 저장소 정보 가져오기
        repo = Repository.get_by_name(repo_name)
        
        if not repo:
            # 데이터베이스에 저장소 데이터가 없는 경우, JSON 파일에서 찾기
            try:
                found = False
                data_files = glob.glob("data/*.json")
                
                for file in data_files:
                    with open(file, "r", encoding="utf-8") as f:
                        repos_data = json.load(f)
                        for repo_data in repos_data:
                            if repo_data['name'] == repo_name:
                                # 데이터베이스에 저장소 추가
                                repo = Repository(
                                    name=repo_data['name'],
                                    link=repo_data['link'],
                                    summary=repo_data['summary'],
                                    feature=repo_data['feature'],
                                    code=repo_data['code'],
                                    stars=repo_data['stars'],
                                    collected_date=datetime.now().date().isoformat()
                                )
                                repo.save()
                                found = True
                                print(f"저장소 생성됨: {repo.id}")
                                break
                    if found:
                        break
                        
                if not found:
                    return jsonify({"success": False, "message": "프로젝트를 찾을 수 없습니다."})
            except Exception as e:
                print(f"JSON 파일 처리 중 오류: {e}")
                return jsonify({"success": False, "message": f"오류 발생: {e}"})
        
        # repo가 없거나 id가 없는 경우 처리
        if not repo or not hasattr(repo, 'id') or not repo.id:
            print(f"유효하지 않은 저장소 객체: {repo}")
            return jsonify({"success": False, "message": "유효하지 않은 저장소 정보입니다."})
            
        # 이미 북마크가 있는지 확인
        existing = Bookmark.get_by_user_repo(current_user.id, repo.id)
        if existing:
            return jsonify({"success": False, "message": "이미 북마크에 추가된 프로젝트입니다."})
        
        # 북마크 추가
        bookmark = Bookmark(user_id=current_user.id, repo_id=repo.id)
        bookmark.save()
        
        print(f"북마크 추가 성공: {bookmark.id}, 레포: {repo.id}")
        return jsonify({"success": True, "bookmark_id": bookmark.id})
    
    except Exception as e:
        print(f"북마크 추가 중 예외 발생: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "message": f"북마크 추가 중 오류: {str(e)}"})

@app.route("/bookmark/<int:bookmark_id>", methods=["DELETE"])
@login_required
def remove_bookmark(bookmark_id):
    bookmark = Bookmark.get_by_id(bookmark_id)
    
    if not bookmark or bookmark.user_id != current_user.id:
        return jsonify({"success": False, "message": "북마크를 찾을 수 없습니다."})
    
    bookmark.delete()
    
    return jsonify({"success": True})

@app.route("/bookmarks")
@login_required
def view_bookmarks():
    # 사용자의 북마크 가져오기
    user_bookmarks = current_user.bookmarks
    
    # 북마크 목록 생성
    bookmarks = []
    for bookmark in user_bookmarks:
        repo = bookmark.repository
        if repo:
            bookmark_data = {
                'id': bookmark.id,
                'repo_name': repo.name,
                'repo_link': repo.link,
                'repo_summary': repo.summary,
                'repo_feature': repo.feature,
                'repo_code': repo.code,
                'repo_stars': repo.stars,
                'created_at': bookmark.created_at
            }
            bookmarks.append(bookmark_data)
    
    return render_template("bookmarks.html", bookmarks=bookmarks)

@app.route("/refresh")
def refresh_data():
    """수동으로 데이터 새로고침"""
    try:
        import trending_fetcher
        trending_fetcher.main()
        return jsonify({"success": True, "message": "데이터가 성공적으로 새로고침되었습니다."})
    except Exception as e:
        return jsonify({"success": False, "message": f"오류 발생: {e}"})

# 댓글 관련 API 엔드포인트
@app.route('/comments/<int:repo_id>', methods=['GET'])
def get_comments(repo_id):
    """저장소 ID에 해당하는 댓글 목록 조회"""
    try:
        comments = Comment.get_by_repo(repo_id)
        
        # 댓글 목록을 JSON으로 변환
        comments_data = []
        for comment in comments:
            # 댓글 작성자 정보 가져오기
            user = User.get_by_id(comment.user_id)
            username = user.username if user else "알 수 없음"
            
            # 날짜 형식 변환 시도
            try:
                if isinstance(comment.created_at, str):
                    created_at = datetime.fromisoformat(comment.created_at.replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M')
                else:
                    created_at = comment.created_at
            except:
                created_at = comment.created_at
            
            comments_data.append({
                'id': comment.id,
                'user_id': comment.user_id,
                'username': username,
                'repo_id': comment.repo_id,
                'content': comment.content,
                'created_at': created_at
            })
        
        # 프론트엔드와 호환되는 형식으로 반환
        return jsonify({'success': True, 'comments': comments_data})
    except Exception as e:
        print(f"댓글 목록 조회 중 오류: {e}")
        return jsonify({'success': False, 'message': f'댓글을 불러오는 중 오류가 발생했습니다: {str(e)}'})

@app.route('/comments', methods=['POST'])
def add_comment():
    """댓글 추가"""
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "로그인이 필요합니다"})
    
    try:
        data = request.get_json()
        repo_id = data.get('repo_id')
        content = data.get('content')
        
        if not repo_id or not content:
            return jsonify({"success": False, "message": "저장소 ID와 댓글 내용이 필요합니다"})
        
        # 댓글 생성 및 저장
        comment = Comment(
            user_id=current_user.id,
            repo_id=repo_id,
            content=content
        )
        success = comment.save()
        
        if success:
            # 작성자 이름도 함께 반환
            return jsonify({
                "success": True, 
                "message": "댓글이 작성되었습니다",
                "comment": {
                    "id": comment.id,
                    "user_id": comment.user_id,
                    "username": current_user.username,
                    "content": comment.content,
                    "created_at": comment.created_at
                }
            })
        else:
            return jsonify({"success": False, "message": "댓글 저장 중 오류가 발생했습니다"})
            
    except Exception as e:
        print(f"댓글 추가 중 오류: {e}")
        return jsonify({"success": False, "message": f"오류 발생: {str(e)}"})

@app.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    """댓글 삭제"""
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "로그인이 필요합니다"})
    
    try:
        # 댓글 삭제 시도
        success = Comment.delete(comment_id, current_user.id)
        
        if success:
            return jsonify({"success": True, "message": "댓글이 삭제되었습니다"})
        else:
            return jsonify({"success": False, "message": "댓글 삭제 중 오류가 발생했습니다"})
            
    except Exception as e:
        print(f"댓글 삭제 중 오류: {e}")
        return jsonify({"success": False, "message": f"오류 발생: {str(e)}"})

# Supabase 테이블 설정 - 처음 실행 시 한 번만 필요
@app.route("/setup_db")
def setup_db():
    """데이터베이스 테이블을 초기화합니다."""
    try:
        # 테이블 생성 SQL 문
        sql_commands = [
            """
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(80) UNIQUE NOT NULL,
                password_hash VARCHAR(256) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS repositories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(120) NOT NULL,
                link VARCHAR(250) NOT NULL,
                summary TEXT,
                feature TEXT,
                code TEXT,
                stars TEXT,
                collected_date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS bookmarks (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                repo_id INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(user_id, repo_id)
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                repo_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """
        ]
        
        # 직접 REST API 호출로 SQL 실행
        import requests
        
        # Supabase 정보
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_SECRET')
        
        headers = {
            'apikey': supabase_key,
            'Authorization': f'Bearer {supabase_key}',
            'Content-Type': 'application/json',
            'Prefer': 'resolution=ignore-duplicates'
        }
        
        # SQL 실행
        for sql in sql_commands:
            endpoint = f"{supabase_url}/rest/v1/rpc/execute_sql"
            data = {
                "sql": sql
            }
            response = requests.post(endpoint, headers=headers, json=data)
            
            if response.status_code >= 400:
                print(f"SQL 실행 중 오류: {response.text}")
                raise Exception(f"SQL 실행 오류: {response.text}")
        
        return jsonify({
            "success": True, 
            "message": "데이터베이스 테이블이 성공적으로 생성되었습니다."
        })
    except Exception as e:
        print(f"데이터베이스 설정 중 오류 발생: {e}")
        return jsonify({"success": False, "message": f"오류 발생: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)

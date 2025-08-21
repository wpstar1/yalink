import os
import json
import sqlite3
import glob
from datetime import datetime
from flask import Flask
from dotenv import load_dotenv
from models import db, User, Repository, Bookmark

# .env 파일 로드
load_dotenv()

def create_app():
    """Flask 앱 생성 및 설정"""
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'githighlight-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    return app

def migrate_users(sqlite_conn, flask_app):
    """사용자 정보 마이그레이션"""
    print("사용자 데이터 마이그레이션 중...")
    
    cursor = sqlite_conn.cursor()
    cursor.execute("SELECT id, username, password_hash, created_at FROM users")
    users = cursor.fetchall()
    
    with flask_app.app_context():
        migrated_count = 0
        for user_data in users:
            user_id, username, password_hash, created_at = user_data
            
            # 이미 존재하는 사용자인지 확인
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                print(f"  사용자 '{username}'는 이미 존재합니다. 건너뜁니다.")
                continue
            
            # created_at이 None이면 현재 시간으로 설정
            if not created_at:
                created_at = datetime.utcnow()
            
            # 새 사용자 생성
            new_user = User(
                id=user_id,
                username=username,
                password_hash=password_hash,
                created_at=created_at
            )
            db.session.add(new_user)
            migrated_count += 1
        
        db.session.commit()
        print(f"  {migrated_count}명의 사용자 데이터가 마이그레이션되었습니다.")

def migrate_repositories(flask_app):
    """저장소 정보 마이그레이션"""
    print("저장소 데이터 마이그레이션 중...")
    
    # JSON 파일에서 저장소 데이터 가져오기
    data_files = glob.glob("data/*.json")
    if not data_files:
        print("  마이그레이션할 저장소 데이터가 없습니다.")
        return
    
    latest_file = sorted(data_files, reverse=True)[0]
    print(f"  최신 데이터 파일 사용: {latest_file}")
    
    with open(latest_file, "r", encoding="utf-8") as f:
        repos_data = json.load(f)
    
    with flask_app.app_context():
        migrated_count = 0
        for repo_data in repos_data:
            # 이미 존재하는 저장소인지 확인
            existing_repo = Repository.query.filter_by(name=repo_data['name']).first()
            if existing_repo:
                print(f"  저장소 '{repo_data['name']}'는 이미 존재합니다. 건너뜁니다.")
                continue
            
            # 새 저장소 추가
            new_repo = Repository(
                name=repo_data['name'],
                link=repo_data['link'],
                summary=repo_data['summary'],
                feature=repo_data['feature'],
                code=repo_data['code'],
                stars=repo_data['stars'],
                collected_date=datetime.now().date()
            )
            db.session.add(new_repo)
            migrated_count += 1
        
        db.session.commit()
        print(f"  {migrated_count}개의 저장소 데이터가 마이그레이션되었습니다.")

def migrate_bookmarks(sqlite_conn, flask_app):
    """북마크 정보 마이그레이션"""
    print("북마크 데이터 마이그레이션 중...")
    
    cursor = sqlite_conn.cursor()
    cursor.execute("""
        SELECT id, user_id, repo_name, repo_link, repo_summary, repo_feature, repo_code, repo_stars, created_at 
        FROM bookmarks
    """)
    bookmarks = cursor.fetchall()
    
    if not bookmarks:
        print("  마이그레이션할 북마크 데이터가 없습니다.")
        return
    
    with flask_app.app_context():
        migrated_count = 0
        for bookmark_data in bookmarks:
            (bookmark_id, user_id, repo_name, repo_link, repo_summary, 
             repo_feature, repo_code, repo_stars, created_at) = bookmark_data
            
            # 사용자 존재 확인
            user = User.query.get(user_id)
            if not user:
                print(f"  사용자 ID {user_id}가 존재하지 않습니다. 북마크를 건너뜁니다.")
                continue
            
            # 저장소 존재 확인 또는 생성
            repo = Repository.query.filter_by(name=repo_name).first()
            if not repo:
                print(f"  저장소 '{repo_name}'를 생성합니다.")
                repo = Repository(
                    name=repo_name,
                    link=repo_link,
                    summary=repo_summary,
                    feature=repo_feature,
                    code=repo_code,
                    stars=repo_stars,
                    collected_date=datetime.now().date()
                )
                db.session.add(repo)
                db.session.commit()  # repo_id를 얻기 위해 먼저 저장
            
            # 이미 존재하는 북마크인지 확인
            existing_bookmark = Bookmark.query.filter_by(user_id=user_id, repo_id=repo.id).first()
            if existing_bookmark:
                print(f"  사용자 ID {user_id}의 저장소 '{repo_name}' 북마크는 이미 존재합니다. 건너뜁니다.")
                continue
            
            # created_at이 None이면 현재 시간으로 설정
            if not created_at:
                created_at = datetime.utcnow()
            
            # 새 북마크 생성
            new_bookmark = Bookmark(
                id=bookmark_id,
                user_id=user_id,
                repo_id=repo.id,
                created_at=created_at
            )
            db.session.add(new_bookmark)
            migrated_count += 1
        
        db.session.commit()
        print(f"  {migrated_count}개의 북마크 데이터가 마이그레이션되었습니다.")

def main():
    """SQLite에서 MySQL로 데이터 마이그레이션"""
    print("SQLite에서 MySQL로 데이터 마이그레이션을 시작합니다...")
    
    # Flask 앱 생성
    app = create_app()
    
    # MySQL 데이터베이스 테이블 생성
    with app.app_context():
        db.create_all()
        print("MySQL 데이터베이스 테이블이 생성되었습니다.")
    
    # SQLite 데이터베이스 연결
    sqlite_path = 'githighlight.db'
    if not os.path.exists(sqlite_path):
        print(f"SQLite 데이터베이스 파일({sqlite_path})을 찾을 수 없습니다.")
        
        # SQLite 파일이 없으면 저장소 데이터만 마이그레이션
        migrate_repositories(app)
        print("마이그레이션이 완료되었습니다.")
        return
    
    try:
        sqlite_conn = sqlite3.connect(sqlite_path)
        
        # 사용자, 저장소, 북마크 데이터 마이그레이션
        migrate_users(sqlite_conn, app)
        migrate_repositories(app)
        migrate_bookmarks(sqlite_conn, app)
        
        # SQLite 연결 종료
        sqlite_conn.close()
        print("마이그레이션이 성공적으로 완료되었습니다!")
        
    except sqlite3.Error as e:
        print(f"SQLite 오류: {e}")
    except Exception as e:
        print(f"마이그레이션 중 오류 발생: {e}")

if __name__ == "__main__":
    main()

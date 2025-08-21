from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
from dotenv import load_dotenv
import supabase
from supabase import create_client, Client

# .env 파일 로드
load_dotenv()

# Supabase 클라이언트 설정
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")  # SUPABASE_KEY 대신 SUPABASE_ANON_KEY 사용
supabase_client: Client = create_client(supabase_url, supabase_key)

class User(UserMixin):
    """사용자 모델"""
    
    def __init__(self, id=None, username=None, password_hash=None, created_at=None):
        self.id = id
        self.username = username
        self.password_hash = password_hash
        self.created_at = created_at or datetime.utcnow().isoformat()
        self._bookmarks = None  # 지연 로딩용
    
    def set_password(self, password):
        """비밀번호 해시 설정"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """비밀번호 확인"""
        return check_password_hash(self.password_hash, password)
    
    @classmethod
    def get_by_id(cls, user_id):
        """ID로 사용자 조회"""
        response = supabase_client.table('users').select('*').eq('id', user_id).execute()
        if response.data and len(response.data) > 0:
            user_data = response.data[0]
            return cls(
                id=user_data['id'],
                username=user_data['username'],
                password_hash=user_data['password_hash'],
                created_at=user_data['created_at']
            )
        return None
    
    @classmethod
    def get_by_username(cls, username):
        """사용자명으로 사용자 조회"""
        response = supabase_client.table('users').select('*').eq('username', username).execute()
        if response.data and len(response.data) > 0:
            user_data = response.data[0]
            return cls(
                id=user_data['id'],
                username=user_data['username'],
                password_hash=user_data['password_hash'],
                created_at=user_data['created_at']
            )
        return None
    
    def save(self):
        """사용자 저장 또는 업데이트"""
        user_data = {
            'username': self.username,
            'password_hash': self.password_hash,
            'created_at': self.created_at
        }
        
        if self.id is not None:
            # 업데이트
            response = supabase_client.table('users').update(user_data).eq('id', self.id).execute()
        else:
            # 새 사용자 생성
            response = supabase_client.table('users').insert(user_data).execute()
            if response.data and len(response.data) > 0:
                self.id = response.data[0]['id']
        
        return self
    
    def delete(self):
        """사용자 삭제"""
        if self.id is not None:
            supabase_client.table('users').delete().eq('id', self.id).execute()
    
    @property
    def bookmarks(self):
        """사용자의 북마크 목록"""
        if self._bookmarks is None:
            response = supabase_client.table('bookmarks').select('*').eq('user_id', self.id).execute()
            self._bookmarks = [Bookmark(**item) for item in response.data]
        return self._bookmarks
    
    def __repr__(self):
        return f'<User {self.username}>'


class Repository:
    """저장소 모델"""
    
    def __init__(self, id=None, name=None, link=None, summary=None, feature=None, code=None, stars=None, collected_date=None, created_at=None):
        self.id = id
        self.name = name
        self.link = link
        self.summary = summary
        self.feature = feature
        self.code = code
        self.stars = stars
        self.collected_date = collected_date
        self.created_at = created_at or datetime.now().isoformat()

    def save(self):
        """저장소를 데이터베이스에 저장"""
        repo_data = {
            'name': self.name,
            'link': self.link,
            'summary': self.summary,
            'feature': self.feature,
            'code': self.code,
            'collected_date': self.collected_date
        }
        
        # stars 필드 처리 - 문자열에서 숫자 추출
        if self.stars:
            try:
                # 숫자만 추출 (예: "50k+" -> 50000)
                if isinstance(self.stars, str):
                    if 'k+' in self.stars.lower():
                        # k가 있으면 1000 곱하기 (예: 50k -> 50000)
                        num_str = self.stars.lower().replace('k+', '').replace('k', '').strip()
                        stars_num = int(float(num_str) * 1000)
                    else:
                        # 그 외의 경우는 숫자만 추출
                        stars_num = int(''.join(c for c in self.stars if c.isdigit()))
                    repo_data['stars'] = stars_num
                else:
                    repo_data['stars'] = self.stars
            except Exception as e:
                print(f"stars 변환 중 오류: {e}, 값: {self.stars}")
                # 오류 발생 시 기본값 사용
                repo_data['stars'] = 0
        else:
            repo_data['stars'] = 0

        try:
            if self.id:
                response = supabase_client.table('repositories').update(repo_data).eq('id', self.id).execute()
                return self
            else:
                response = supabase_client.table('repositories').insert(repo_data).execute()
                if response.data and len(response.data) > 0:
                    self.id = response.data[0]['id']
                return self
        except Exception as e:
            print(f"저장소 저장 중 오류 발생: {e}")
            return None
    
    @classmethod
    def get_by_id(cls, repo_id):
        """ID로 저장소 조회"""
        response = supabase_client.table('repositories').select('*').eq('id', repo_id).execute()
        if response.data and len(response.data) > 0:
            return cls(**response.data[0])
        return None
    
    @classmethod
    def get_by_name(cls, name):
        """이름으로 저장소 조회"""
        response = supabase_client.table('repositories').select('*').eq('name', name).execute()
        if response.data and len(response.data) > 0:
            return cls(**response.data[0])
        return None
    
    @classmethod
    def get_by_date(cls, collected_date):
        """날짜로 저장소 목록 조회"""
        response = supabase_client.table('repositories').select('*').eq('collected_date', collected_date).execute()
        return [cls(**item) for item in response.data]
    
    @classmethod
    def get_latest_date(cls):
        """가장 최신 수집 날짜 조회"""
        response = supabase_client.table('repositories').select('collected_date').order('collected_date', desc=True).limit(1).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]['collected_date']
        return None
    
    def to_dict(self):
        """저장소 데이터를 딕셔너리로 변환"""
        return {
            'name': self.name,
            'link': self.link,
            'summary': self.summary,
            'feature': self.feature,
            'code': self.code,
            'stars': self.stars
        }
    
    def __repr__(self):
        return f'<Repository {self.name}>'


class Bookmark:
    """북마크 모델"""
    
    def __init__(self, id=None, user_id=None, repo_id=None, created_at=None):
        self.id = id
        self.user_id = user_id
        self.repo_id = repo_id
        self.created_at = created_at or datetime.utcnow().isoformat()
        self._repository = None  # 지연 로딩용
    
    @classmethod
    def get_by_id(cls, bookmark_id):
        """ID로 북마크 조회"""
        response = supabase_client.table('bookmarks').select('*').eq('id', bookmark_id).execute()
        if response.data and len(response.data) > 0:
            return cls(**response.data[0])
        return None
    
    @classmethod
    def get_by_user_repo(cls, user_id, repo_id):
        """사용자 ID와 저장소 ID로 북마크 조회"""
        response = supabase_client.table('bookmarks').select('*').eq('user_id', user_id).eq('repo_id', repo_id).execute()
        if response.data and len(response.data) > 0:
            return cls(**response.data[0])
        return None
    
    def save(self):
        """북마크 저장"""
        bookmark_data = {
            'user_id': self.user_id,
            'repo_id': self.repo_id,
            'created_at': self.created_at
        }
        
        if self.id is not None:
            # 업데이트
            response = supabase_client.table('bookmarks').update(bookmark_data).eq('id', self.id).execute()
        else:
            # 북마크 생성
            response = supabase_client.table('bookmarks').insert(bookmark_data).execute()
            if response.data and len(response.data) > 0:
                self.id = response.data[0]['id']
        
        return self
    
    def delete(self):
        """북마크 삭제"""
        if self.id is not None:
            supabase_client.table('bookmarks').delete().eq('id', self.id).execute()
    
    @property
    def repository(self):
        """북마크된 저장소 가져오기"""
        if self._repository is None and self.repo_id is not None:
            self._repository = Repository.get_by_id(self.repo_id)
        return self._repository
    
    def __repr__(self):
        return f'<Bookmark {self.id}>'


class Comment:
    """댓글 모델 클래스"""

    def __init__(self, id=None, user_id=None, repo_id=None, content=None, created_at=None):
        self.id = id
        self.user_id = user_id
        self.repo_id = repo_id
        self.content = content
        self.created_at = created_at

    def save(self):
        """댓글을 데이터베이스에 저장"""
        try:
            # 기존 데이터 확인 및 추가
            data = {
                "user_id": self.user_id,
                "repo_id": self.repo_id,
                "content": self.content
            }
            
            # Supabase 직접 API 호출
            import requests
            import os
            
            # Supabase 정보
            supabase_url = os.environ.get('SUPABASE_URL')
            supabase_key = os.environ.get('SUPABASE_SECRET')
            
            headers = {
                'apikey': supabase_key,
                'Authorization': f'Bearer {supabase_key}',
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
            
            endpoint = f"{supabase_url}/rest/v1/comments"
            response = requests.post(endpoint, headers=headers, json=data)
            
            if response.status_code >= 400:
                print(f"댓글 저장 중 오류: {response.text}")
                return False
                
            result = response.json()
            self.id = result[0]['id'] if isinstance(result, list) and len(result) > 0 else None
            return True
                
        except Exception as e:
            print(f"댓글 저장 중 오류 발생: {e}")
            return False

    @classmethod
    def get_by_repo(cls, repo_id):
        """저장소 ID로 댓글 목록 조회"""
        try:
            # Supabase 직접 API 호출
            import requests
            import os
            
            # Supabase 정보
            supabase_url = os.environ.get('SUPABASE_URL')
            supabase_key = os.environ.get('SUPABASE_SECRET')
            
            headers = {
                'apikey': supabase_key,
                'Authorization': f'Bearer {supabase_key}',
                'Content-Type': 'application/json'
            }
            
            endpoint = f"{supabase_url}/rest/v1/comments?repo_id=eq.{repo_id}&order=created_at.desc"
            response = requests.get(endpoint, headers=headers)
            
            if response.status_code >= 400:
                print(f"댓글 조회 중 오류: {response.text}")
                return []
                
            comments_data = response.json()
            
            # 댓글 객체 생성
            comments = []
            for data in comments_data:
                comment = cls(
                    id=data.get('id'),
                    user_id=data.get('user_id'),
                    repo_id=data.get('repo_id'),
                    content=data.get('content'),
                    created_at=data.get('created_at')
                )
                comments.append(comment)
            
            return comments
            
        except Exception as e:
            print(f"댓글 조회 중 오류 발생: {e}")
            return []

    @classmethod
    def delete(cls, comment_id, user_id):
        """댓글 삭제"""
        try:
            # Supabase 직접 API 호출
            import requests
            import os
            
            # Supabase 정보
            supabase_url = os.environ.get('SUPABASE_URL')
            supabase_key = os.environ.get('SUPABASE_SECRET')
            
            headers = {
                'apikey': supabase_key,
                'Authorization': f'Bearer {supabase_key}',
                'Content-Type': 'application/json'
            }
            
            # 자신의 댓글만 삭제할 수 있도록 조건 추가
            endpoint = f"{supabase_url}/rest/v1/comments?id=eq.{comment_id}&user_id=eq.{user_id}"
            response = requests.delete(endpoint, headers=headers)
            
            if response.status_code >= 400:
                print(f"댓글 삭제 중 오류: {response.text}")
                return False
                
            return True
            
        except Exception as e:
            print(f"댓글 삭제 중 오류 발생: {e}")
            return False

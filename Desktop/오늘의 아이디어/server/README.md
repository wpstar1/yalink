# 바이브코딩 아이디어 모음 - 서버

매일 아침 5시에 GPT를 통해 돈이 될 만한 아이디어를 5개씩 자동으로 가져오는 서버 컴포넌트입니다.

## 기능

- 매일 아침 5시에 자동으로 GPT API를 통해 아이디어 5개 수집
- 수집된 아이디어를 Supabase 데이터베이스에 저장
- 프론트엔드에서 API를 통해 아이디어 조회 가능
- 댓글 및 북마크 관리 API 제공

## 설치 방법

1. 필요한 패키지 설치:
```
cd server
npm install
```

2. 서버 실행:
```
npm start
```

## 수동으로 아이디어 가져오기 (테스트용)

서버가 실행된 상태에서 아래 명령어를 실행하면 GPT로부터 5개의 아이디어를 즉시 가져올 수 있습니다:

```
curl -X POST http://localhost:3000/api/fetch-ideas
```

또는 브라우저에서 서버 실행 후 다음 주소로 접속:
`http://localhost:3000/api/ideas`

## Supabase 테이블 구조

### Ideas 테이블
```sql
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  tag TEXT NOT NULL,
  summary TEXT NOT NULL,
  features TEXT NOT NULL,
  target TEXT NOT NULL,
  revenue TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Comments 테이블
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  idea_id UUID REFERENCES ideas(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Bookmarks 테이블
```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  idea_id UUID REFERENCES ideas(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, idea_id)
);
```

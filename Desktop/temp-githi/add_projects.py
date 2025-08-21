import os
import json
from datetime import datetime
from dotenv import load_dotenv
from models import Repository

# 환경 변수 로드
load_dotenv()

# 오늘 날짜
today = datetime.now().date().isoformat()

# 추가할 GitHub 프로젝트 데이터
new_projects = [
    {
        "name": "openai/whisper",
        "link": "https://github.com/openai/whisper",
        "summary": "OpenAI에서 개발한 범용 음성 인식 모델입니다. 다양한 언어의 음성을 인식하고 텍스트로 변환하는 강력한 기능을 제공합니다.",
        "feature": "다국어 음성 인식, 실시간 자막 생성, API 인터페이스 제공",
        "code": """
import whisper

model = whisper.load_model("base")
result = model.transcribe("audio.mp3")
print(result["text"])
        """,
        "stars": "50k+"
    },
    {
        "name": "microsoft/TypeChat",
        "link": "https://github.com/microsoft/TypeChat",
        "summary": "자연어를 타입스크립트 데이터 구조로 변환해주는 라이브러리입니다. 복잡한 사용자 입력을 구조화된 데이터로 손쉽게 변환할 수 있습니다.",
        "feature": "자연어-구조화 데이터 변환, TypeScript 통합, 스키마 기반 검증",
        "code": """
import { TypeChat } from "typechat";

// 스키마 정의
const schema = `
interface Order {
  items: CartItem[];
  address: Address;
}
`;

const result = await typeChat.translate("2개의 아메리카노와 1개의 치즈케이크 주문해줘");
console.log(result.data);
        """,
        "stars": "19k+"
    },
    {
        "name": "lm-sys/FastChat",
        "link": "https://github.com/lm-sys/FastChat",
        "summary": "다양한 오픈소스 대화형 AI 모델을 간편하게 배포하고 사용할 수 있는 플랫폼입니다. Vicuna, Alpaca, LLaMA 등 다양한 모델을 지원합니다.",
        "feature": "웹 UI, API 서버, 모델 평가 도구 제공",
        "code": """
from fastchat.serve.controller import Controller
from fastchat.serve.model_worker import ModelWorker
from fastchat.serve.api import APIServer

# 컨트롤러 시작
controller = Controller()
controller.start()

# 모델 워커 시작
worker = ModelWorker("vicuna-7b", controller_addr="localhost:21001")
worker.start()

# API 서버 시작
api_server = APIServer(controller_addr="localhost:21001")
api_server.start()
        """,
        "stars": "31k+"
    },
    {
        "name": "oven-sh/bun",
        "link": "https://github.com/oven-sh/bun",
        "summary": "자바스크립트와 타입스크립트를 위한 초고속 올인원 런타임입니다. Node.js보다 빠른 속도와 향상된 개발자 경험을 제공합니다.",
        "feature": "빠른 자바스크립트 실행, 내장 번들러, 테스트 러너, NPM 호환성",
        "code": """
// 서버 실행
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Bun 서버에 오신 것을 환영합니다!");
  },
});

console.log(`서버가 ${server.port}번 포트에서 실행 중입니다`);
        """,
        "stars": "65k+"
    },
    {
        "name": "refinedev/refine",
        "link": "https://github.com/refinedev/refine",
        "summary": "React 기반의 내부 도구 개발을 위한 프레임워크입니다. 관리자 패널, 대시보드, B2B 애플리케이션을 빠르게 구축할 수 있습니다.",
        "feature": "CRUD 작업 자동화, 인증 시스템, 다양한 UI 프레임워크 지원",
        "code": """
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";

import { PostList, PostCreate, PostEdit, PostShow } from "pages/posts";

function App() {
  return (
    <Refine
      dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
      routerProvider={routerProvider}
      resources={[
        {
          name: "posts",
          list: PostList,
          create: PostCreate,
          edit: PostEdit,
          show: PostShow,
        },
      ]}
    />
  );
}
        """,
        "stars": "17k+"
    },
    {
        "name": "langchain-ai/langchain",
        "link": "https://github.com/langchain-ai/langchain",
        "summary": "LLM(대규모 언어 모델)을 활용한 애플리케이션 개발을 위한 프레임워크입니다. 다양한 모델을 통합하고 체인 및 에이전트 패턴을 제공합니다.",
        "feature": "프롬프트 최적화, 체인 및 에이전트 구현, 벡터 데이터베이스 통합",
        "code": """
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

# 프롬프트 템플릿 정의
template = """질문: {question}
대답:"""

prompt = PromptTemplate(template=template, input_variables=["question"])

# 체인 생성
llm = OpenAI(temperature=0.9)
chain = LLMChain(llm=llm, prompt=prompt)

# 실행
print(chain.run("파이썬으로 웹 스크래핑을 어떻게 하나요?"))
        """,
        "stars": "75k+"
    },
    {
        "name": "shadcn-ui/ui",
        "link": "https://github.com/shadcn-ui/ui",
        "summary": "아름다운 UI 컴포넌트 모음으로, 직접 복사하여 사용할 수 있습니다. Radix UI와 Tailwind CSS를 기반으로 하며 고도의 커스터마이징이 가능합니다.",
        "feature": "접근성 우수, 다크 모드 지원, 재사용 가능한 컴포넌트",
        "code": """
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function DemoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>알림 설정</CardTitle>
        <CardDescription>앱 알림을 관리하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>카드의 주요 내용이 들어갑니다.</p>
      </CardContent>
      <CardFooter>
        <button>저장</button>
      </CardFooter>
    </Card>
  )
}
        """,
        "stars": "45k+"
    },
    {
        "name": "vercel/next.js",
        "link": "https://github.com/vercel/next.js",
        "summary": "React 기반의 풀스택 웹 프레임워크로, 서버 사이드 렌더링과 정적 웹사이트 생성을 모두 지원합니다. 개발자 경험을 극대화한 도구입니다.",
        "feature": "서버 컴포넌트, 증분 정적 재생성, 자동 이미지 최적화, API 라우트",
        "code": """
// app/page.tsx - React 서버 컴포넌트
export default async function Home() {
  const products = await getProducts();
  
  return (
    <main>
      <h1>제품 목록</h1>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>
    </main>
  );
}
        """,
        "stars": "115k+"
    },
    {
        "name": "AmruthPillai/Reactive-Resume",
        "link": "https://github.com/AmruthPillai/Reactive-Resume",
        "summary": "무료 오픈소스 이력서 빌더로, 사용자 친화적인 인터페이스를 제공하고 다양한 템플릿을 지원합니다. 프라이버시를 중시하며 이력서 데이터는 로컬에 저장됩니다.",
        "feature": "다양한 템플릿, 다국어 지원, PDF 내보내기, 데이터 백업 및 복원",
        "code": """
import { Resume, Section, Field } from '@reactive-resume/schema';
import { useResume } from '@reactive-resume/hooks';

function ResumeEditor() {
  const { resume, setResume } = useResume();
  
  const updateField = (section: Section, id: string, field: Field, value: string) => {
    setResume({
      ...resume,
      sections: {
        ...resume.sections,
        [section]: {
          ...resume.sections[section],
          items: resume.sections[section].items.map(item => 
            item.id === id ? { ...item, [field]: value } : item
          )
        }
      }
    });
  };
  
  // 이력서 에디터 UI 렌더링 코드
}
        """,
        "stars": "18k+"
    },
    {
        "name": "withastro/astro",
        "link": "https://github.com/withastro/astro",
        "summary": "콘텐츠 중심 웹사이트를 위한 올인원 웹 프레임워크입니다. 다양한 UI 프레임워크를 통합하며 HTML 우선 접근 방식으로 최적의 성능을 제공합니다.",
        "feature": "아일랜드 아키텍처, 제로 JS 기본 설정, 다양한 통합 지원, 콘텐츠 컬렉션",
        "code": """
---
// src/pages/index.astro
import Layout from '../layouts/Main.astro';
import Card from '../components/Card.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
---

<Layout title="내 블로그">
  <h1>최신 게시물</h1>
  <div class="grid">
    {posts.map(post => (
      <Card 
        title={post.data.title}
        description={post.data.description}
        url={`/blog/${post.slug}`}
      />
    ))}
  </div>
</Layout>
        """,
        "stars": "38k+"
    }
]

def add_projects_to_database():
    """10개의 새로운 GitHub 프로젝트를 데이터베이스에 추가합니다."""
    
    count = 0
    for project in new_projects:
        # 이미 존재하는지 확인
        existing = Repository.get_by_name(project['name'])
        
        if not existing:
            # 데이터베이스에 추가
            repo = Repository(
                name=project['name'],
                link=project['link'],
                summary=project['summary'],
                feature=project['feature'],
                code=project['code'],
                stars=project['stars'],
                collected_date=today
            )
            repo.save()
            count += 1
            print(f"추가됨: {project['name']}")
        else:
            print(f"이미 존재함: {project['name']}")
    
    print(f"\n총 {count}개의 새 프로젝트가 추가되었습니다.")
    
    # JSON 파일에도 저장
    json_file = f"data/{today}.json"
    
    # 기존 JSON 파일이 있는지 확인하고 없으면 새로 생성
    try:
        if os.path.exists(json_file):
            with open(json_file, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        else:
            existing_data = []
            
        # 새 프로젝트를 JSON에 추가 (중복 방지)
        existing_names = [repo['name'] for repo in existing_data]
        for project in new_projects:
            if project['name'] not in existing_names:
                existing_data.append(project)
                
        # 파일 저장
        os.makedirs("data", exist_ok=True)
        with open(json_file, "w", encoding="utf-8") as f:
            json.dump(existing_data, f, ensure_ascii=False, indent=2)
            
        print(f"JSON 파일이 업데이트되었습니다: {json_file}")
    except Exception as e:
        print(f"JSON 파일 업데이트 중 오류 발생: {e}")
    
if __name__ == "__main__":
    add_projects_to_database()

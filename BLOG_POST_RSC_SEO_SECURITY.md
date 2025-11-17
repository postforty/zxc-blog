# Next.js 블로그 프로젝트에서의 React Server Components와 SEO 최적화

## 1. React Server Components (RSC) 개요

### 1-1. RSC의 등장 배경

React Server Components는 React 18에서 도입된 새로운 패러다임으로, 서버에서 실행되는 컴포넌트를 통해 클라이언트로 전송되는 JavaScript 번들 크기를 줄이고 초기 로딩 성능을 개선하는 것을 목표로 한다. 기존의 Server-Side Rendering(SSR)과는 다른 접근 방식을 취하며, 컴포넌트 단위로 서버와 클라이언트의 역할을 분리할 수 있다.

### 1-2. 하이드레이션(Hydration) 이해하기

하이드레이션은 SSR과 RSC의 차이를 이해하는 핵심 개념이다.

#### 1-2-1. 하이드레이션이란?

하이드레이션은 서버에서 렌더링된 정적 HTML에 JavaScript를 "주입"하여 인터랙티브하게 만드는 과정이다. 이 과정은 다음 단계로 진행된다.

- **1단계 - 서버 렌더링**: 서버에서 React 컴포넌트를 HTML 문자열로 변환한다.

- **2단계 - HTML 전송**: 생성된 HTML을 클라이언트로 전송하여 사용자가 즉시 콘텐츠를 볼 수 있다.

- **3단계 - JavaScript 다운로드**: 클라이언트에서 React 번들을 다운로드한다.

- **4단계 - 하이드레이션 실행**: React가 기존 HTML에 이벤트 리스너와 상태를 연결한다.

```typescript
// 하이드레이션 과정 예시
// 서버: HTML 생성
const html = ReactDOMServer.renderToString(<App />);

// 클라이언트: 하이드레이션
ReactDOM.hydrate(<App />, document.getElementById("root"));
```

#### 1-2-2. 하이드레이션의 문제점

- **이중 렌더링**: 서버와 클라이언트에서 동일한 컴포넌트를 두 번 렌더링한다.

- **번들 크기 증가**: 모든 컴포넌트의 JavaScript 코드가 클라이언트로 전송되어야 한다.

- **인터랙션 지연**: JavaScript가 로드되고 하이드레이션이 완료될 때까지 사용자 입력이 무시된다.

- **메모리 사용**: 클라이언트에서 전체 컴포넌트 트리를 메모리에 유지해야 한다.

```typescript
// SSR의 하이드레이션 문제 예시
// 서버에서 렌더링 (1번째)
export async function getServerSideProps() {
  const posts = await fetchPosts(); // 서버에서 데이터 페칭
  return { props: { posts } };
}

// 클라이언트에서 다시 렌더링 (2번째)
export default function PostList({ posts }) {
  // 이 컴포넌트의 모든 코드가 클라이언트 번들에 포함됨
  // 하이드레이션 과정에서 다시 한 번 렌더링됨
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} /> // 이 코드도 번들에 포함
      ))}
    </div>
  );
}
```

### 1-3. SSR과 RSC의 차이점

#### 1-3-1. Server-Side Rendering (SSR)

- **동작 방식**: 서버에서 HTML을 생성하여 클라이언트로 전송한 후, 클라이언트에서 Hydration 과정을 통해 JavaScript를 실행하여 인터랙티브하게 만든다.

- **번들 크기**: 모든 컴포넌트의 JavaScript 코드가 클라이언트로 전송된다.

- **하이드레이션**: 전체 페이지에 대해 하이드레이션이 필요하다.

- **렌더링 시점**: 요청 시점에 서버에서 HTML을 생성한다.

```typescript
// 전통적인 SSR (getServerSideProps)
export async function getServerSideProps() {
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();

  return {
    props: { posts },
  };
}

// 클라이언트에서 전체 컴포넌트가 하이드레이션됨
export default function PostList({ posts }) {
  // 이 컴포넌트의 모든 코드가 클라이언트 번들에 포함됨
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

#### 1-3-2. React Server Components (RSC)

- **동작 방식**: 서버 컴포넌트는 서버에서만 실행되며, 그 결과만 클라이언트로 전송된다. 클라이언트 컴포넌트는 필요한 경우에만 사용된다.

- **번들 크기**: 서버 컴포넌트의 코드는 클라이언트로 전송되지 않아 번들 크기가 크게 감소한다.

- **하이드레이션**: 서버 컴포넌트는 하이드레이션이 불필요하며, 클라이언트 컴포넌트만 선택적으로 하이드레이션된다.

- **렌더링 시점**: 컴포넌트 단위로 서버/클라이언트 실행 위치를 결정할 수 있다.

```typescript
// RSC 방식 (Next.js 13+ App Router)
// 서버 컴포넌트 - 하이드레이션 불필요
async function getPost(id: string) {
  const res = await fetch(`${API_URL}/api/posts/${id}`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function PostDetailPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <div>
      {/* 서버 컴포넌트 - 번들에 포함되지 않음 */}
      <PostViewServer post={post} />

      {/* 클라이언트 컴포넌트 - 이 부분만 하이드레이션됨 */}
      <PostInteractions post={post} />
    </div>
  );
}
```

### 1-4. RSC의 주요 특징

- **Zero Bundle Size**: 서버 컴포넌트의 코드는 클라이언트 번들에 포함되지 않는다.

- **Direct Backend Access**: 서버 컴포넌트에서 직접 데이터베이스나 파일 시스템에 접근할 수 있다.

- **Automatic Code Splitting**: 클라이언트 컴포넌트는 자동으로 코드 분할된다.

- **No Hydration Overhead**: 서버 컴포넌트는 Hydration이 필요 없어 초기 로딩이 빠르다.

- **Selective Hydration**: 클라이언트 컴포넌트만 선택적으로 하이드레이션되어 성능이 향상된다.

## 2. 프로젝트에서의 RSC 적용 사례

### 2-1. 게시글 상세 페이지 구조

본 프로젝트에서는 게시글 상세 페이지를 서버 컴포넌트와 클라이언트 컴포넌트로 분리하여 구현하였다.

#### 2-1-1. 서버 컴포넌트 (page.tsx)

```typescript
// frontend/src/app/(blog)/posts/[id]/page.tsx
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  // 조회수 증가 (서버에서 처리)
  await incrementViewCount(id);

  return (
    <div>
      <PostViewServer post={post} />
      <PostInteractions post={post} />
      <PostNavigationBar prevPost={prevPost} nextPost={nextPost} />
      <PostDetailClient postId={post.id.toString()} />
    </div>
  );
}
```

- **데이터 페칭**: 서버에서 직접 API를 호출하여 게시글 데이터를 가져온다.

- **조회수 증가**: 서버 사이드에서 처리하여 클라이언트 JavaScript 없이도 동작한다.

- **컴포넌트 조합**: 서버 컴포넌트와 클라이언트 컴포넌트를 혼합하여 사용한다.

#### 2-1-2. 클라이언트 컴포넌트 (PostInteractions.tsx)

```typescript
// frontend/src/app/(blog)/posts/[id]/PostInteractions.tsx
"use client";

export default function PostInteractions({ post }: PostInteractionsProps) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [user, setUser] = useState<any>(null);

  const handleLike = async () => {
    // 좋아요 처리 로직
  };

  return (
    <>
      {isAdmin && (
        <div className="flex justify-end gap-4">
          <Link href={`/editor/${post.id}`}>편집</Link>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}
      <button onClick={handleLike}>
        <Heart className="h-4 w-4" />
        <span>{likes}</span>
      </button>
    </>
  );
}
```

- **인터랙션 처리**: 좋아요, 편집, 삭제 등 사용자 상호작용이 필요한 부분만 클라이언트 컴포넌트로 구현한다.

- **상태 관리**: useState를 사용하여 클라이언트 상태를 관리한다.

- **이벤트 핸들러**: onClick 등의 이벤트 핸들러를 사용한다.

### 2-2. 컴포넌트 분리 전략

#### 2-2-1. 서버 컴포넌트로 구현한 부분

- **게시글 내용 렌더링**: 정적인 콘텐츠는 서버에서 렌더링한다.

- **메타데이터 생성**: SEO를 위한 메타데이터는 서버에서 생성한다.

- **초기 데이터 페칭**: 페이지 로드 시 필요한 데이터는 서버에서 가져온다.

#### 2-2-2. 클라이언트 컴포넌트로 구현한 부분

- **사용자 인터랙션**: 좋아요, 댓글 작성 등 사용자 입력이 필요한 부분이다.

- **실시간 업데이트**: 좋아요 수, 댓글 목록 등 동적으로 변경되는 데이터이다.

- **인증 상태 관리**: 로그인 상태에 따른 UI 변경이다.

## 3. SEO 최적화

### 3-1. RSC와 SEO의 관계

React Server Components는 서버에서 완전한 HTML을 생성하여 클라이언트로 전송하기 때문에 검색 엔진 크롤러가 콘텐츠를 쉽게 인덱싱할 수 있다. 이는 전통적인 Client-Side Rendering(CSR)의 SEO 문제를 근본적으로 해결한다.

### 3-2. 메타데이터 생성

#### 3-2-1. 정적 메타데이터

```typescript
// frontend/src/app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "ZXCVB Blog",
    template: "%s | ZXCVB Blog",
  },
  description: "Next.js와 React 19로 구축된 현대적인 기술 블로그",
  keywords: ["블로그", "개발", "기술", "Next.js", "React"],
  authors: [{ name: "ZXCVB" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://zxcvb-blog.com",
    siteName: "ZXCVB Blog",
    title: "ZXCVB Blog",
    description: "Next.js와 React 19로 구축된 현대적인 기술 블로그",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZXCVB Blog",
    description: "Next.js와 React 19로 구축된 현대적인 기술 블로그",
  },
};
```

- **기본 메타데이터**: 사이트 전체에 적용되는 기본 정보를 정의한다.

- **Open Graph**: 소셜 미디어 공유 시 표시될 정보를 설정한다.

- **Twitter Card**: 트위터 공유 시 표시될 카드 형식을 지정한다.

#### 3-2-2. 동적 메타데이터

```typescript
// frontend/src/app/(blog)/posts/[id]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const title = post.title.ko || post.title.en || "Untitled";
  const summary = post.summary?.ko || post.summary?.en || "";

  return {
    title: title,
    description: summary,
    openGraph: {
      title: title,
      description: summary,
      type: "article",
      publishedTime: post.createdAt,
      authors: [post.author?.name || "Unknown"],
    },
  };
}
```

- **동적 생성**: 각 게시글의 내용에 맞는 메타데이터를 동적으로 생성한다.

- **다국어 지원**: 한국어와 영어 콘텐츠를 모두 지원한다.

- **Article 타입**: Open Graph에서 article 타입을 사용하여 게시글임을 명시한다.

### 3-3. 추가 SEO 고려사항

#### 3-3-1. 구조화된 데이터 (Structured Data)

검색 엔진이 콘텐츠를 더 잘 이해할 수 있도록 JSON-LD 형식의 구조화된 데이터를 추가하는 것이 권장된다.

```typescript
// 게시글 페이지에 추가할 구조화된 데이터 예시
const structuredData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title.ko,
  description: post.summary?.ko,
  author: {
    "@type": "Person",
    name: post.author?.name,
  },
  datePublished: post.createdAt,
  dateModified: post.updatedAt,
};
```

#### 3-3-2. 시맨틱 HTML

- **적절한 HTML 태그 사용**: `<article>`, `<header>`, `<nav>` 등 시맨틱 태그를 사용한다.

- **제목 계층 구조**: `<h1>`, `<h2>`, `<h3>` 등을 올바른 순서로 사용한다.

- **이미지 alt 속성**: 모든 이미지에 적절한 대체 텍스트를 제공한다.

#### 3-3-3. 사이트맵과 robots.txt

```typescript
// frontend/src/app/sitemap.ts
export default async function sitemap() {
  const posts = await getAllPosts();

  const postUrls = posts.map((post) => ({
    url: `https://zxcvb-blog.com/posts/${post.id}`,
    lastModified: post.updatedAt || post.createdAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://zxcvb-blog.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...postUrls,
  ];
}
```

#### 3-3-4. 페이지 로딩 성능

- **이미지 최적화**: Next.js의 Image 컴포넌트를 사용하여 자동 최적화한다.

- **코드 분할**: 동적 import를 사용하여 필요한 코드만 로드한다.

- **캐싱 전략**: 적절한 캐싱 정책을 설정하여 재방문 시 로딩 속도를 개선한다.

```typescript
// 캐싱 전략 예시
const res = await fetch(`${API_URL}/api/posts/${id}`, {
  cache: "no-store", // 항상 최신 데이터
  // 또는
  next: { revalidate: 3600 }, // 1시간마다 재검증
});
```

## 4. 보안 고려사항

### 4-1. 민감 정보 노출 문제

RSC를 사용할 때 서버에서 가져온 데이터가 클라이언트로 전송되는 과정에서 민감한 정보가 노출될 수 있다. 본 프로젝트에서 발견된 보안 취약점과 해결 방법을 소개한다.

#### 4-1-1. 문제 상황

게시글 상세 페이지의 HTML 소스에서 다음과 같은 민감 정보가 노출되었다.

```json
{
  "author": {
    "id": 1,
    "googleId": "106550795763881150660",
    "name": "Dandy",
    "email": "ubithus@gmail.com",
    "password": null,
    "role": "Admin",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "createdAt": "2025-11-13T01:10:37.681Z"
  }
}
```

- **refreshToken**: JWT Refresh Token이 평문으로 노출되어 공격자가 사용자 권한을 탈취할 수 있다.

- **email**: 사용자 이메일 주소가 노출되어 스팸이나 피싱 공격에 악용될 수 있다.

- **googleId**: 소셜 로그인 식별자가 노출되어 사용자 계정을 특정할 수 있다.

#### 4-1-2. 해결 방법

백엔드 API에서 데이터를 반환할 때 민감한 정보를 필터링하도록 수정하였다.

```typescript
// backend/src/api/posts/posts.service.ts
export const getPostById = async (id: number) => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
          createdAt: true,
          // email, password, refreshToken, googleId는 제외
        },
      },
      tags: true,
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              role: true,
              createdAt: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
```

- **명시적 필드 선택**: `include: { author: true }` 대신 `select`를 사용하여 필요한 필드만 선택한다.

- **중첩 관계 처리**: 댓글과 답글의 작성자 정보도 동일하게 필터링한다.

- **일관성 유지**: 모든 API 엔드포인트에서 동일한 필터링 정책을 적용한다.

### 4-2. 개발 환경과 프로덕션 환경의 차이

#### 4-2-1. 파일 경로 노출

개발 모드에서는 디버깅을 위해 실제 파일 경로가 HTML 소스에 포함된다.

```
C:\\Users\\dandycode\\Documents\\GitHub\\zxc-blog\\frontend\\.next\\dev\\server\\chunks\\ssr\\...
```

이는 Next.js 개발 모드의 정상적인 동작이며, 다음을 위해 필요하다.

- **소스맵 (Source Maps)**: 에러 발생 시 정확한 파일 위치를 파악한다.

- **Hot Module Replacement (HMR)**: 코드 변경 시 즉시 반영한다.

- **상세한 에러 스택 트레이스**: 디버깅을 용이하게 한다.

#### 4-2-2. 프로덕션 빌드 설정

프로덕션 환경에서는 소스맵을 제거하여 내부 구조를 노출하지 않도록 설정한다.

```typescript
// frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 프로덕션에서 소스맵 제거 (보안 강화)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
```

- **소스맵 제거**: 프로덕션 빌드에서 브라우저 소스맵을 생성하지 않는다.

- **파일 경로 난독화**: 빌드 과정에서 파일 경로가 자동으로 난독화된다.

- **번들 최적화**: 불필요한 디버그 정보가 제거되어 번들 크기가 감소한다.

### 4-3. 추가 보안 권장사항

#### 4-3-1. 즉시 조치 사항

- **노출된 토큰 무효화**: 데이터베이스에서 노출된 refreshToken을 삭제한다.

- **영향받은 사용자 재로그인**: 보안을 위해 모든 사용자에게 재로그인을 요청한다.

- **API 응답 검증**: 모든 API 엔드포인트의 응답 데이터를 검토한다.

#### 4-3-2. 장기 보안 강화

- **API 응답 직렬화 레이어**: 모든 API 응답을 통과하는 직렬화 레이어를 추가하여 민감 정보를 자동으로 필터링한다.

- **환경 변수 관리**: `.env` 파일을 `.gitignore`에 추가하고, 민감한 정보는 환경 변수로 관리한다.

- **CORS 정책 강화**: 허용된 도메인만 API에 접근할 수 있도록 제한한다.

- **Rate Limiting**: API 요청 횟수를 제한하여 무차별 대입 공격을 방지한다.

```typescript
// Rate Limiting 예시 (Express.js)
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100개 요청
  message: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
});

app.use("/api/", limiter);
```

#### 4-3-3. 모니터링 및 로깅

- **비정상적인 API 호출 패턴 감지**: 짧은 시간에 많은 요청이 발생하는 경우를 감지한다.

- **토큰 탈취 시도 로깅**: 유효하지 않은 토큰으로 접근 시도를 기록한다.

- **민감 정보 노출 자동 검사**: CI/CD 파이프라인에 보안 검사 도구를 통합한다.

## 5. 결론

### 5-1. RSC의 장점

- **성능 향상**: 클라이언트 번들 크기 감소로 초기 로딩 속도가 개선된다.

- **SEO 최적화**: 서버에서 완전한 HTML을 생성하여 검색 엔진 최적화가 용이하다.

- **개발 경험 개선**: 서버와 클라이언트 코드를 명확하게 분리하여 유지보수가 쉽다.

- **보안 강화**: 민감한 로직을 서버에서만 실행하여 클라이언트 노출을 방지한다.

### 5-2. 주의사항

- **데이터 필터링**: 서버에서 클라이언트로 전송되는 데이터에 민감 정보가 포함되지 않도록 주의한다.

- **컴포넌트 분리**: 서버 컴포넌트와 클라이언트 컴포넌트의 경계를 명확히 한다.

- **캐싱 전략**: 적절한 캐싱 정책을 설정하여 성능과 데이터 신선도의 균형을 맞춘다.

- **환경별 설정**: 개발 환경과 프로덕션 환경의 설정을 구분하여 관리한다.

### 5-3. 향후 개선 방향

- **구조화된 데이터 추가**: JSON-LD를 사용하여 검색 엔진이 콘텐츠를 더 잘 이해하도록 한다.

- **이미지 ��적화**: Next.js Image 컴포넌트를 활용하여 이미지 로딩 성능을 개선한다.

- **Progressive Enhancement**: JavaScript가 비활성화된 환경에서도 기본 기능이 동작하도록 한다.

- **접근성 개선**: ARIA 속성과 키보드 네비게이션을 추가하여 모든 사용자가 사용할 수 있도록 한다.

React Server Components는 현대적인 웹 애플리케이션 개발에서 성능, SEO, 보안을 모두 고려할 수 있는 강력한 도구이다. 본 프로젝트에서의 경험을 바탕으로 RSC를 효과적으로 활용하면 사용자 경험과 개발 생산성을 동시에 향상시킬 수 있다.

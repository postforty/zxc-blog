# 블로그 아키텍처 설계

이 문서는 블로그 프로젝트의 프론트엔드 아키텍처를 정의합니다. 컴포넌트 구조, 데이터 모델, 페이지 라우팅에 대한 설계를 포함합니다.

## 1. 데이터 모델

초기에는 클라이언트 측에서 사용할 데이터의 구조를 다음과 같이 정의합니다.

### Post (게시물)

```typescript
interface Post {
  id: string; // 고유 식별자 (예: a-simple-post)
  title: string; // 제목
  content: string; // 내용 (Markdown 형식)
  author: string; // 작성자
  createdAt: string; // 생성일 (ISO 8601 형식)
  summary?: string; // 목록에 표시될 짧은 요약
}
```

**[백엔드 연동 시 동적 콘텐츠 다국어 처리 방안]**

블로그 게시물(`Post`)과 같이 동적으로 생성되는 콘텐츠의 다국어 처리는 UI 텍스트와는 다르게 데이터베이스 레벨에서 관리되어야 합니다. 백엔드 연동 시 다음 방안 중 하나를 고려하여 구현합니다.

1.  **언어별 컬럼 추가:** `Post` 모델에 각 언어별 제목과 내용을 위한 컬럼을 추가합니다. (예: `title_en`, `content_en`, `title_ko`, `content_ko`)
2.  **별도 번역 테이블 사용:** `Post` 테이블과 1:N 관계를 가지는 `PostTranslation` 테이블을 생성하여 `post_id`, `language_code`, `title`, `content` 등을 저장합니다.

프론트엔드는 사용자가 선택한 언어 정보를 백엔드에 전달하고, 백엔드는 해당 언어의 콘텐츠를 조회하여 반환합니다. 프론트엔드는 백엔드로부터 받은 언어별 콘텐츠를 직접 렌더링하며, `react-i18next`는 UI 텍스트 번역에만 사용됩니다.

### Comment (댓글)

```typescript
interface Comment {
  id: string; // 고유 식별자
  postId: string; // 연결된 게시물의 id
  author: string; // 작성자
  content: string; // 내용
  createdAt: string; // 생성일 (ISO 8601 형식)
}
```

## 2. 페이지 및 라우팅

React Router를 사용하여 다음 페이지들을 관리합니다.

*   `/` : **게시물 목록 페이지 (Home)**
    *   모든 게시물의 목록을 보여줍니다.
*   `/posts/:id` : **게시물 상세 페이지 (Post Detail)**
    *   특정 게시물의 전체 내용과 댓글을 보여줍니다.
*   `/editor` : **새 게시물 작성 페이지 (New Post)**
    *   새로운 게시물을 작성하는 에디터 페이지입니다.
*   `/editor/:id` : **게시물 수정 페이지 (Edit Post)**
    *   기존 게시물을 수정하는 에디터 페이지입니다.

## 3. 컴포넌트 구조

컴포넌트는 재사용성과 관심사 분리를 고려하여 다음과 같이 구조화합니다.

```
src
├── components/
│   ├── ui/  (Shadcn/UI 컴포넌트가 위치할 디렉토리)
│   │   ├── button.tsx
│   │   └── ...
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx (Header, Footer 등을 포함하는 공통 레이아웃)
│   │   └── language/
│   │       └── LanguageSwitcher.tsx (언어 선택 UI)
│   └── posts/
│       ├── PostList.tsx
│       ├── PostListItem.tsx
│       ├── PostView.tsx
│       └── PostEditor.tsx
│   └── comments/
│       ├── CommentList.tsx
│       └── CommentForm.tsx
│   └── analytics/
│       └── VisitorCounter.tsx (방문자 수를 표시하는 컴포넌트)
└── pages/
    ├── HomePage.tsx (게시물 목록)
    ├── PostDetailPage.tsx (게시물 상세)
    └── EditorPage.tsx (게시물 작성/수정)
```

### 컴포넌트 설명

*   **Layout:** 모든 페이지에 공통적으로 적용될 레이아웃 (헤더, 푸터 포함).
*   **Header:** 사이트 제목과 네비게이션 링크를 포함.
*   **PostList:** 게시물 목록을 렌더링.
*   **PostListItem:** `PostList` 내의 개별 게시물 아이템.
*   **PostView:** 단일 게시물의 제목과 본문을 보여주는 컴포넌트.
*   **PostEditor:** 새 게시물 작성 및 수정을 위한 마크다운 에디터.
*   **CommentList:** 특정 게시물에 달린 댓글 목록.
*   **CommentForm:** 새로운 댓글을 작성하는 폼.
*   **HomePage:** `PostList`를 포함하는 메인 페이지.
*   **PostDetailPage:** `PostView`와 `CommentList`, `CommentForm`을 포함하는 상세 페이지.
*   **EditorPage:** `PostEditor`를 포함하는 작성/수정 페이지.

## 4. 방문자 통계 모듈

*   **목표:** 블로그의 일일 방문자 수와 전체 방문자 수를 추적하고 표시합니다.
*   **데이터 저장:** `localStorage`를 사용하여 `dailyVisitors` (일일 방문자 수), `totalVisitors` (전체 방문자 수), `lastVisitDate` (마지막 방문 날짜)를 저장합니다.
*   **로직:**
    *   페이지 로드 시 `localStorage`에서 방문자 데이터를 읽어옵니다.
    *   `lastVisitDate`와 현재 날짜를 비교하여 날짜가 다르면 `dailyVisitors`를 0으로 초기화하고 `lastVisitDate`를 업데이트합니다.
    *   `dailyVisitors`와 `totalVisitors`를 1씩 증가시킵니다.
    *   업데이트된 방문자 데이터를 `localStorage`에 저장합니다.
*   **통합:** `Layout` 컴포넌트 또는 `Footer` 컴포넌트에 `VisitorCounter.tsx` 컴포넌트를 통합하여 방문자 수를 표시합니다.

## 5. 다국어 지원 모듈

*   **목표:** 블로그 콘텐츠와 UI를 여러 언어로 제공하여 사용자 경험을 향상시킵니다.
*   **라이브러리:** `react-i18next` 및 `i18next`를 사용하여 다국어 기능을 구현합니다.
*   **번역 파일:** `public/locales/{lang}/translation.json` 경로에 언어별 번역 파일을 저장합니다. (예: `public/locales/en/translation.json`, `public/locales/ko/translation.json`)
*   **언어 감지 및 저장:** 사용자의 브라우저 언어를 감지하고, 사용자가 선택한 언어를 `localStorage`에 저장하여 유지합니다.
*   **언어 전환:** `LanguageSwitcher.tsx` 컴포넌트를 통해 사용자가 언어를 쉽게 변경할 수 있도록 합니다.
*   **통합:** `Header` 또는 `Layout` 컴포넌트에 `LanguageSwitcher.tsx`를 통합하고, 필요한 텍스트에 `useTranslation` 훅을 적용합니다.

## 6. 서버 사이드 렌더링(SSR) 아키텍처 (Vite + Express)

기존 CSR(Client-Side Rendering) 방식의 SEO 한계를 극복하기 위해, Vite와 백엔드 Express 서버를 연동하여 서버 사이드 렌더링을 구현합니다.

### 6.1. 주요 변경 사항 및 파일 구조

SSR 도입을 위해 프론트엔드 프로젝트에 다음과 같은 파일들이 추가/변경됩니다.

```
src
├── ...
├── entry-client.tsx  // 클라이언트 측 진입점 (Hydration 담당)
└── entry-server.tsx  // 서버 측 진입점 (HTML 렌더링 담당)
```

*   **`entry-server.tsx` (신규):**
    *   서버 환경에서 실행될 React 애플리케이션의 진입점입니다.
    *   Express 서버로부터 요청 URL을 받아, `react-router-dom`의 `StaticRouterProvider`와 `ReactDOMServer.renderToString()`을 사용해 React 컴포넌트를 HTML 문자열로 렌더링합니다.
    *   데이터 fetching 로직을 포함하여 렌더링에 필요한 데이터를 미리 가져옵니다.
    *   `react-helmet-async`를 사용하여 동적 메타 태그를 생성하고 추출합니다.

*   **`entry-client.tsx` (기존 `main.tsx` 역할 변경):**
    *   브라우저에서 실행될 클라이언트 측 진입점입니다.
    *   서버가 생성한 HTML 구조에 React를 연결하고, 이벤트 핸들러 등을 첨부하여 인터랙티브한 상태로 만드는 'Hydration' 과정을 담당합니다. (`ReactDOM.hydrateRoot` 사용)

*   **`backend/src/app.ts` (백엔드 서버 수정):**
    *   모든 프론트엔드 페이지 요청(`*`)을 처리하는 미들웨어를 추가합니다.
    *   Vite 개발 서버 또는 프로덕션 빌드 결과물을 사용하여 `entry-server.tsx`의 렌더링 함수를 호출합니다.
    *   렌더링된 HTML, 데이터, 메타 태그를 `index.html` 템플릿에 삽입하여 최종 HTML을 클라이언트에게 반환합니다.

### 6.2. SSR 요청 처리 흐름

1.  **사용자 요청:** 브라우저가 특정 페이지 URL(예: `/posts/my-post`)로 서버에 요청을 보냅니다.
2.  **Express 서버 처리:** 백엔드 Express 서버가 이 요청을 받아, SSR 처리 미들웨어를 실행합니다.
3.  **HTML 템플릿 로드:** 서버는 `frontend/dist/client/index.html` 파일을 템플릿으로 읽어옵니다.
4.  **서버 사이드 렌더링:**
    *   서버는 `frontend/dist/server/entry-server.js` 모듈을 로드합니다.
    *   요청된 URL에 해당하는 게시물 데이터를 DB에서 조회합니다.
    *   조회된 데이터를 포함하여 React 앱을 HTML 문자열로 렌더링(`renderToString`)하고, 메타 태그를 생성합니다.
5.  **HTML 조합 및 응답:**
    *   서버는 템플릿의 특정 위치(예: `<!--ssr-outlet-->`)에 렌더링된 HTML 문자열과 메타 태그를 삽입합니다.
    *   초기 데이터를 `<script>` 태그에 담아 클라이언트 측 Hydration에 사용하도록 전달합니다.
    *   완성된 HTML 페이지를 브라우저에 응답으로 보냅니다.
6.  **클라이언트 측 Hydration:**
    *   브라우저는 HTML을 수신하여 렌더링하고, `entry-client.js` 스크립트를 다운로드하여 실행합니다.
    *   `entry-client.js`는 서버가 내려준 초기 데이터를 사용하여 `hydrateRoot`를 실행, 정적인 HTML 페이지를 동적인 React 애플리케이션으로 전환합니다.
    *   이후의 페이지 이동은 CSR 방식으로 동작하여 빠른 사용자 경험을 제공합니다.

### 6.3. 라우팅 변경 사항

*   **`react-router-dom`**이 서버와 클라이언트 양쪽에서 모두 사용됩니다.
*   서버에서는 `createStaticHandler`와 `createStaticRouter`를, 클라이언트에서는 `createBrowserRouter`를 사용하여 라우팅을 설정합니다. 이를 통해 초기 로드는 SSR로, 이후 탐색은 CSR로 동작하게 됩니다.

### 6.4. 데이터 동기화 및 Hydration Mismatch 방지

- 서버에서 페칭한 데이터를 `window.__INITIAL_DATA__`에 직렬화하여 주입
- XSS 방지를 위해 `JSON.stringify().replace(/</g, '\\u003c')` 사용
- 클라이언트는 이 데이터를 읽어 동일한 초기 상태로 시작
- 시간, 랜덤 값 등 비결정적 데이터는 서버 값을 클라이언트에 전달

### 6.5. 개발/프로덕션 환경별 처리

**개발 환경:**
- Vite 개발 서버를 미들웨어 모드로 실행
- `ssrLoadModule`을 통해 HMR 지원
- 빌드 없이 즉시 변경사항 반영

**프로덕션 환경:**
- `frontend/dist/server/entry-server.js` 사전 빌드된 번들 사용
- `frontend/dist/client` 정적 파일 서빙
- 캐싱 전략 적용 가능

### 6.6. 에러 핸들링

**SSR 렌더링 실패 시:**
- Fallback으로 기본 HTML 반환 (CSR로 전환)
- 에러 로깅 및 모니터링
- 사용자에게는 정상적인 페이지 제공

**404 처리:**
- `StaticRouter`의 context를 통한 404 감지
- 서버에서 404 상태 코드 설정
- SEO를 위한 적절한 404 페이지 렌더링

### 6.7. 성능 최적화

**서버 사이드:**
- 렌더링 결과 캐싱 (Redis 등)
- 데이터베이스 쿼리 최적화
- CDN을 통한 정적 자산 배포

**클라이언트 사이드:**
- Code Splitting (React.lazy)
- 컴포넌트별 lazy loading
- 중요하지 않은 컴포넌트는 CSR로 처리

**측정 지표:**
- TTFB (Time To First Byte)
- FCP (First Contentful Paint)
- TTI (Time To Interactive)

### 6.8. SEO 최적화 구현

**동적 메타 태그 (react-helmet-async):**
- 페이지별 title, description 생성
- Open Graph 태그 (소셜 미디어 공유)
- Canonical URL 설정

**구조화된 데이터:**
- JSON-LD 스키마 추가
- Article, BreadcrumbList 등 적용

**사이트맵 생성:**
- `/sitemap.xml` 엔드포인트 구현
- 모든 게시물 URL 포함
- 최종 수정일 명시

### 6.9. 보안 사항

**XSS 방지:**
- 초기 데이터 직렬화 시 특수문자 이스케이프
- `dangerouslySetInnerHTML` 사용 최소화
- Content Security Policy 설정

**CSRF 방지:**
- API 엔드포인트에 CSRF 토큰 적용
- SameSite 쿠키 속성 설정

### 6.10. Vite 설정 예시

**vite.config.ts 주요 설정:**
- `build.ssrManifest: true` - SSR 매니페스트 생성
- `build.rollupOptions.input` - 클라이언트/서버 진입점 분리
- `ssr.noExternal` - SSR 시 번들에 포함할 패키지 지정

**주의사항:**
- `react-helmet-async`는 `ssr.noExternal`에 포함 필요
- CSS 모듈은 서버 빌드에도 포함되어야 함

### 6.11. 개발 및 빌드 프로세스

**개발 모드 실행:**
1. 백엔드 서버 시작 (Vite 미들웨어 포함)
2. Vite가 프론트엔드 코드를 메모리에서 변환
3. HMR을 통한 실시간 업데이트

**프로덕션 빌드:**
1. `vite build` - 클라이언트 번들 생성
2. `vite build --ssr` - 서버 번들 생성
3. Express 서버 배포

**배포 체크리스트:**
- 환경 변수 설정 확인
- 정적 파일 경로 검증
- 에러 모니터링 설정

### 6.12. SSR 도입 시 고려사항

**장점:**
- SEO 최적화
- 초기 로딩 성능 개선
- 소셜 미디어 공유 최적화

**단점:**
- 서버 리소스 사용 증가
- 복잡도 상승
- 디버깅 난이도 증가

**적합한 페이지:**
- 게시물 상세 페이지 (필수)
- 게시물 목록 페이지
- 정적 콘텐츠 페이지

**CSR 유지가 나은 페이지:**
- 로그인 필요 페이지
- 대시보드, 관리자 페이지
- 실시간 업데이트가 많은 페이지

### 6.13. React Router Data APIs 활용

**Loader 함수 활용:**
- 라우트별 데이터 페칭 로직을 loader로 분리
- 서버/클라이언트 모두에서 동일한 loader 실행
- `createStaticHandler`가 자동으로 loader 호출

**중요:**
- loader는 순수 함수여야 함 (브라우저 API 사용 불가)
- 에러 처리는 ErrorBoundary로
- defer를 사용한 스트리밍 SSR 고려

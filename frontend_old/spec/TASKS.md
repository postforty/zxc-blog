# 블로그 개발 작업 목록 (Task List)

이 문서는 블로그 개발을 위한 작업 항목들을 나열하고 진행 상황을 추적합니다.

## 1. 초기 설정

- [x] Vite + React + TS 프로젝트 생성
- [x] `spec/PRD.md` (제품 요구사항 명세서) 작성
- [x] `spec/ARCHITECTURE.md` (아키텍처 설계) 작성
- [x] Shadcn/UI 및 Tailwind CSS 설정
- [x] `spec/TASKS.md` (작업 목록) 작성

## 2. 기본 구조 및 레이아웃

- [x] `ARCHITECTURE.md`에 명시된 디렉토리 구조 생성 (`components`, `pages` 등)
- [x] `react-router-dom` 설치 및 기본 라우팅 설정
- [x] 공통 `Layout` 컴포넌트 구현 (`Header`, `Footer` 포함)
- [x] 다크/라이트 모드 테마 전환 기능 구현

## 3. 게시물 기능 (클라이언트 측)

- [x] 게시물용 목(mock) 데이터 생성 (예: `src/data/posts.json`)
- [x] **게시물 목록 페이지**
    - [x] `HomePage.tsx` 페이지 생성
    - [x] `PostList.tsx` 및 `PostListItem.tsx` 컴포넌트 구현
    - [x] 목 데이터를 이용해 게시물 목록 렌더링
- [x] **게시물 상세 페이지**
    - [x] `PostDetailPage.tsx` 페이지 생성
    - [x] `PostView.tsx` 컴포넌트 구현
    - [x] URL 파라미터(`:id`)를 이용해 특정 게시물 렌더링

## 4. 에디터 기능 (클라이언트 측)

- [x] `EditorPage.tsx` 페이지 생성
- [x] `PostEditor.tsx` 컴포넌트 구현 (제목, 내용 입력 필드)
- [x] (Optional) 마크다운 에디터 라이브러리(예: `react-markdown`, `toast-ui/editor`) 연동
- [x] 새 게시물 생성 기능 구현 (목 데이터 배열에 추가)
- [x] 게시물 수정 기능 구현 (목 데이터 배열에서 수정)
- [x] 게시물 삭제 기능 구현 (목 데이터 배열에서 삭제)

## 5. 댓글 기능 (클라이언트 측)

- [x] 댓글용 목(mock) 데이터 생성
- [x] `CommentList.tsx` 컴포넌트 구현
- [x] `CommentForm.tsx` 컴포넌트 구현
- [x] 게시물 상세 페이지에 댓글 기능 연동
- [x] 대댓글 기능 구현

## 6. 스타일링 및 개선

- [x] Shadcn/UI 컴포넌트를 사용하여 전체적인 UI 디자인 적용
- [x] 반응형 디자인 개선
- [x] 코드 리팩토링 및 주석 추가

## 7. 백엔드 연동 (향후)

- [x] 백end API 서버 구축
- [x] 데이터베이스 스키마 설계
- [x] 기존 클라이언트 측 로직을 API 호출로 대체
- [x] 사용자 인증 기능 구현

## 8. 방문자 통계 기능

- [x] 방문자 통계 데이터 모델 정의
- [x] 로컬 스토리지를 이용한 방문자 수 저장 및 관리 로직 구현
- [x] 일일 방문자 수 초기화 로직 구현
- [x] 방문자 수 표시 UI 컴포넌트 구현
- [x] 구현된 컴포넌트를 레이아웃에 통합

## 9. 다국어 지원 기능

- [x] 다국어 지원 라이브러리 설치 및 설정
- [x] 번역 파일 구조 정의 및 샘플 번역 추가
- [x] 언어 선택 UI 컴포넌트 구현
- [x] 기존 컴포넌트에 다국어 적용
- [x] 기본 언어 설정 및 언어 변경 로직 구현

## 10. 프로필 관리 기능

- [x] **1단계: 정적 프로필 페이지**
    - [x] 프로필 데이터 모델 정의 (이름, 소개, 아바타 이미지 등)
    - [x] `ProfilePage.tsx` 페이지 생성
    - [x] 정적 데이터를 사용하여 프로필 정보 렌더링
    - [x] 헤더 또는 푸터에 프로필 페이지로 이동하는 링크 추가
- [ ] **2단계: 동적 프로필 및 사용자 인증**
    - [ ] 사용자 데이터 모델 확장 (로그인 정보 포함)
    - [ ] 회원가입/로그인 페이지 UI 구현
    - [ ] 사용자 인증 로직 구현 (예: JWT, OAuth)
    - [ ] 프로필 수정 기능 구현
    - [ ] 백엔드와 연동하여 사용자 정보 저장 및 관리

## 11. 관리자 페이지 기능

- [x] `spec/ADMIN_FEATURES.md` 기능 명세 문서화
- [x] **1단계: 기본 구조 및 콘텐츠 관리**
    - [x] 관리자 페이지 레이아웃 및 라우팅 설정 (`/admin`)
    - [x] 게시물 관리 UI 구현 (목록, 수정, 삭제)
    - [x] 댓글 관리 UI 구현 (목록, 승인, 삭제)
- [x] **2단계: 사용자 관리 및 통계**
    - [x] 사용자 관리 UI 구현 (목록, 역할 변경, 차단)
    - [x] 통계 대시보드 UI 구현
- [x] **3단계: 블로그 설정**
    - [x] 사이트 정보 및 메뉴 설정 UI 구현

## 12. SSR (서버 사이드 렌더링) 구현

- [ ] **기반 설정**
    - [ ] `react-helmet-async` 설치
    - [ ] `frontend/src/routes.tsx` 파일 생성 및 라우트 정의 분리
    - [ ] `frontend/src/main.tsx`를 `frontend/src/entry-client.tsx`로 변경 및 Hydration 로직 적용
    - [ ] `frontend/src/entry-server.tsx` 파일 생성 및 서버 렌더링 로직 구현
    - [ ] `frontend/vite.config.ts` SSR 빌드 설정 추가 (클라이언트/서버 번들 분리)
    - [ ] `frontend/index.html`에 SSR 아웃렛 및 초기 데이터 주입을 위한 플레이스홀더 추가
- [ ] **백엔드 연동**
    - [ ] `backend/src/app.ts`에 SSR 미들웨어 추가
    - [ ] 개발/프로덕션 환경별 SSR 처리 로직 구현
- [ ] **데이터 처리**
    - [ ] `react-router-dom`의 `loader` 함수를 사용하여 라우트별 데이터 페칭 로직 구현
    - [ ] 서버에서 페칭한 데이터를 클라이언트로 전달 및 Hydration 로직 구현 (`window.__INITIAL_DATA__` 활용)
- [ ] **SEO 및 성능 최적화**
    - [ ] `react-helmet-async`를 사용하여 동적 메타 태그 (title, description, OG, Canonical URL) 구현
    - [ ] 구조화된 데이터 (JSON-LD) 추가 (예: `BlogPosting` 스키마)
    - [ ] SSR 에러 발생 시 Fallback 처리 및 404 페이지 렌더링
    - [ ] 서버 렌더링 결과 캐싱 전략 고려
    - [ ] 클라이언트 코드 스플리팅 및 Lazy Loading 적용
- [ ] **보안**
    - [ ] 초기 데이터 직렬화 시 XSS 방지 처리

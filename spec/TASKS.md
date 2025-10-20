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

## 6. 스타일링 및 개선

- [ ] Shadcn/UI 컴포넌트를 사용하여 전체적인 UI 디자인 적용
- [ ] 반응형 디자인 개선
- [ ] 코드 리팩토링 및 주석 추가

## 7. 백엔드 연동 (향후)

- [ ] 백엔드 API 서버 구축
- [ ] 데이터베이스 스키마 설계
- [ ] 기존 클라이언트 측 로직을 API 호출로 대체
- [ ] 사용자 인증 기능 구현

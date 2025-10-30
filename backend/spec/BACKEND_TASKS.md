# 백엔드 개발 작업 목록 (Backend Tasks)

이 문서는 `BACKEND_DOCS.md` 설계에 따라 백엔드 애플리케이션을 구현하기 위한 작업 체크리스트입니다.

## 1. 프로젝트 초기 설정 (Phase 1: Initial Setup)

- [x] `backend` 디렉토리 생성
- [x] `npm init`으로 Node.js 프로젝트 초기화
- [x] `express`, `prisma`, `passport` 등 필요한 프로덕션 의존성 설치
- [x] `typescript`, `@types/*`, `nodemon` 등 개발 의존성 설치
- [x] `tsconfig.json` 생성 및 ESM 설정
- [x] `package.json`에 `type: "module"` 추가
- [x] `docker-compose.yml`을 이용한 PostgreSQL 데이터베이스 환경 구성
- [x] `prisma init`으로 Prisma 초기 설정
- [x] `prisma/schema.prisma`에 데이터 모델 정의
- [x] `prisma.config.ts`에 `dotenv` 설정 추가
- [x] `prisma migrate dev`로 초기 데이터베이스 마이그레이션 실행
- [x] 기본 폴더 구조 생성 (`src/api`, `src/middleware`, `src/config`)
- [x] `src/app.ts`에 기본 Express 서버 및 헬스 체크 API 구현
- [x] `package.json`에 `dev` 실행 스크립트 추가

## 2. 인증 및 인가 구현 (Phase 2: Auth & RBAC)

- [x] `src/api/auth` 라우트 및 컨트롤러 파일 생성
- [x] `bcryptjs`를 이용한 비밀번호 해싱 로직 구현
- [x] **회원가입 API** (`POST /api/auth/register`) 구현
- [x] **로그인 API** (`POST /api/auth/login`) 구현 (JWT Access/Refresh Token 발급)
- [x] **토큰 재발급 API** (`POST /api/auth/refresh`) 구현
- [x] **로그아웃 API** (`POST /api/auth/logout`) 구현 (Refresh Token 무효화)
- [x] `verifyToken` 미들웨어 구현 (Access Token 유효성 검증)
- [x] `checkRole` 미들웨어 구현 (사용자 역할 기반 접근 제어)

## 3. Zod 유효성 검사 (Phase 3: Validation)

- [x] 공유 가능한 `zod` 스키마 디렉토리/파일 구조 설정
- [x] 인증 관련 API(회원가입, 로그인)에 대한 `zod` 스키마 작성
- [x] `validateRequest` 미들웨어 구현
- [x] 모든 API 엔드포인트에 유효성 검사 미들웨어 적용

## 4. Google OAuth 구현 (Phase 4: Google OAuth)

- [x] `src/config/passport.ts` 파일 생성 및 Passport Google 전략 설정
- [x] **Google 로그인 시작 API** (`GET /api/auth/google`) 구현
- [x] **Google 콜백 API** (`GET /api/auth/google/callback`) 구현
- [x] 콜백에서 사용자 조회 또는 생성 후 JWT 발급 로직 연동

## 5. 핵심 기능 구현 (Phase 5: Core Features)

- [ ] **게시물(Post) API** (`/api/posts`) - `Admin` 전용 CRUD 구현
- [ ] **댓글(Comment) API** (`/api/posts/:postId/comments`, `/api/comments/:id`) 구현
    - [ ] `GET`, `POST` (로그인 사용자)
    - [ ] `PUT`, `DELETE` (자신의 댓글만)
- [ ] **좋아요(Like) API** (`POST /api/posts/:id/like`) 구현 (`Guest` 포함 모든 사용자)

## 6. 관리자 기능 구현 (Phase 6: Admin Features)

- [ ] **사용자 관리 API** (`/api/admin/users`) 구현
- [ ] **프로필/설정 관리 API** (`/api/admin/profile`, `/api/admin/settings`) 구현
- [ ] **통계 API** (`/api/admin/stats/*`) 구현
    - [ ] `summary` (주요 지표 요약)
    - [ ] `top-viewed`, `top-liked` (인기 게시물)
    - [ ] `visitors` (방문자 추이)

## 7. 마무리 (Phase 7: Finalization)

- [ ] 전역 에러 핸들링(Global Error Handling) 미들웨어 구현
- [ ] 단위/통합 테스트 작성
- [ ] 프로덕션 배포를 위한 `Dockerfile` 작성
- [ ] README 문서 업데이트

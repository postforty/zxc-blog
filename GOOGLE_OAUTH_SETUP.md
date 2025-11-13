# Google OAuth 설정 가이드

이 가이드는 Google OAuth 2.0을 사용한 로그인 기능을 설정하는 방법을 설명합니다.

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 1.2 OAuth 동의 화면 구성

1. 좌측 메뉴에서 **API 및 서비스** > **OAuth 동의 화면** 선택
2. 사용자 유형 선택:
   - **외부**: 모든 Google 계정 사용자가 로그인 가능
   - **내부**: Google Workspace 조직 내 사용자만 로그인 가능
3. 앱 정보 입력:
   - 앱 이름: `ZXCVB Blog`
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처 정보: 본인 이메일
4. 범위 추가:
   - `userinfo.email`
   - `userinfo.profile`
5. 저장 후 계속

### 1.3 OAuth 2.0 클라이언트 ID 생성

1. 좌측 메뉴에서 **API 및 서비스** > **사용자 인증 정보** 선택
2. **+ 사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 클릭
3. 애플리케이션 유형: **웹 애플리케이션** 선택
4. 이름: `ZXCVB Blog Web Client`
5. 승인된 자바스크립트 원본:
   ```
   http://localhost:3000
   http://localhost:3001
   ```
6. 승인된 리디렉션 URI:
   ```
   http://localhost:3001/api/auth/google/callback
   ```
7. **만들기** 클릭
8. 생성된 **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사

## 2. 환경 변수 설정

### 2.1 백엔드 설정 (`backend/.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/zxc-blog"
JWT_SECRET="your_jwt_secret_here"
REFRESH_TOKEN_SECRET="your_refresh_token_secret_here"
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
FRONTEND_URL="http://localhost:3000"
```

**중요**:

- `GOOGLE_CLIENT_ID`와 `GOOGLE_CLIENT_SECRET`를 Google Cloud Console에서 복사한 값으로 교체
- `JWT_SECRET`과 `REFRESH_TOKEN_SECRET`는 강력한 랜덤 문자열로 설정 (예: `openssl rand -base64 32`)

### 2.2 프론트엔드 설정 (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 3. 데이터베이스 마이그레이션

Prisma 스키마가 이미 `googleId` 필드를 포함하고 있으므로, 데이터베이스를 마이그레이션합니다:

```bash
cd backend
npx prisma migrate dev --name add_google_oauth
```

## 4. 서버 실행

### 4.1 백엔드 실행

```bash
cd backend
npm i
npm run dev
```

백엔드 서버가 `http://localhost:3001`에서 실행됩니다.

### 4.2 프론트엔드 실행

```bash
cd frontend
pnpm i
pnpm dev
```

프론트엔드 서버가 `http://localhost:3000`에서 실행됩니다.

## 5. 기능 테스트

### 5.1 로그인 페이지 접속

브라우저에서 `http://localhost:3000/login` 접속

### 5.2 Google 로그인 테스트

1. "Google로 로그인" 버튼 클릭
2. Google 계정 선택 및 권한 승인
3. 자동으로 홈페이지로 리디렉션
4. 로그인 상태 확인

### 5.3 일반 로그인/회원가입 테스트

1. 회원가입 페이지에서 이메일/비밀번호로 계정 생성
2. 로그인 페이지에서 생성한 계정으로 로그인

## 6. 인증 흐름

### Google OAuth 흐름:

1. 사용자가 "Google로 로그인" 버튼 클릭
2. `/api/auth/google` 엔드포인트로 리다이렉트
3. Google 로그인 페이지로 이동
4. 사용자가 Google 계정으로 로그인 및 권한 승인
5. Google이 `/api/auth/google/callback`으로 리다이렉트
6. 백엔드에서 사용자 정보 확인 및 JWT 토큰 생성
7. 프론트엔드 `/auth/callback`으로 토큰과 함께 리다이렉트
8. 프론트엔드에서 토큰 저장 및 사용자 정보 로드
9. 홈페이지로 리다이렉트

### 일반 로그인 흐름:

1. 사용자가 이메일/비밀번호 입력
2. `/api/auth/login` 엔드포인트로 POST 요청
3. 백엔드에서 비밀번호 검증 및 JWT 토큰 생성
4. 프론트엔드에서 토큰 저장 및 사용자 정보 로드
5. 홈페이지로 리다이렉트

## 7. 보안 고려사항

### 7.1 프로덕션 환경 설정

프로덕션 환경에서는 다음 사항을 반드시 변경하세요:

1. **환경 변수**:

   - 강력한 JWT_SECRET 및 REFRESH_TOKEN_SECRET 사용
   - 실제 도메인으로 FRONTEND_URL 변경

2. **Google Cloud Console**:

   - 승인된 자바스크립트 원본에 프로덕션 도메인 추가
   - 승인된 리디렉션 URI에 프로덕션 콜백 URL 추가
   - OAuth 동의 화면을 "프로덕션" 상태로 변경

3. **HTTPS 사용**:
   - 프로덕션에서는 반드시 HTTPS 사용
   - HTTP는 개발 환경에서만 사용

### 7.2 토큰 관리

- Access Token: 1일 유효 (필요시 15분으로 단축 가능)
- Refresh Token: 7일 유효
- 토큰은 localStorage에 저장 (더 높은 보안이 필요한 경우 httpOnly 쿠키 사용 고려)

## 8. 문제 해결

### 8.1 "redirect_uri_mismatch" 오류

- Google Cloud Console의 승인된 리디렉션 URI가 정확한지 확인
- URI는 정확히 일치해야 함 (끝의 슬래시도 중요)

### 8.2 "access_denied" 오류

- OAuth 동의 화면 설정 확인
- 테스트 사용자 추가 (외부 앱이 테스트 모드인 경우)

### 8.3 토큰이 저장되지 않음

- 브라우저 콘솔에서 에러 확인
- localStorage 접근 권한 확인
- CORS 설정 확인

### 8.4 데이터베이스 연결 오류

- PostgreSQL이 실행 중인지 확인
- DATABASE_URL이 올바른지 확인
- Prisma 마이그레이션 실행 확인

## 9. API 엔드포인트

### 인증 관련 엔드포인트:

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/google` - Google OAuth 시작
- `GET /api/auth/google/callback` - Google OAuth 콜백
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

자세한 API 문서는 `http://localhost:3001/docs`에서 확인할 수 있습니다.

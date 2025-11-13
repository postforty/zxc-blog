# 빠른 시작 가이드

## 1. Google OAuth 설정 (필수)

### Google Cloud Console에서:

1. https://console.cloud.google.com/ 접속
2. 프로젝트 생성
3. **API 및 서비스** > **OAuth 동의 화면** 설정
4. **API 및 서비스** > **사용자 인증 정보** > **OAuth 클라이언트 ID** 생성
   - 승인된 리디렉션 URI: `http://localhost:3001/api/auth/google/callback`

### 환경 변수 설정:

```bash
# backend/.env
GOOGLE_CLIENT_ID="여기에_클라이언트_ID_입력"
GOOGLE_CLIENT_SECRET="여기에_클라이언트_시크릿_입력"
```

자세한 설정은 [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) 참조

## 2. 데이터베이스 설정

```bash
cd backend
npx prisma migrate dev
```

## 3. 서버 실행

### 백엔드:

```bash
cd backend
npm install
npm run dev
```

### 프론트엔드:

```bash
cd frontend
npm install
npm run dev
```

## 4. 테스트

1. 브라우저에서 http://localhost:3000/login 접속
2. "Google로 로그인" 버튼 클릭
3. Google 계정으로 로그인
4. 자동으로 홈페이지로 리다이렉트

## 주요 페이지

- 로그인: http://localhost:3000/login
- 회원가입: http://localhost:3000/register
- API 문서: http://localhost:3001/docs

## 구현된 기능

✅ Google OAuth 2.0 로그인
✅ 이메일/비밀번호 회원가입
✅ 이메일/비밀번호 로그인
✅ JWT 토큰 기반 인증
✅ Refresh Token 자동 갱신
✅ 사용자 정보 조회
✅ 로그아웃

## 인증 흐름

### Google OAuth:

사용자 → Google 로그인 → 백엔드 콜백 → JWT 생성 → 프론트엔드 → 홈

### 일반 로그인:

사용자 → 이메일/비밀번호 → 백엔드 검증 → JWT 생성 → 프론트엔드 → 홈

## Google OAuth 회원가입/로그인 통합 기능

Google OAuth는 **회원가입과 로그인을 자동으로 처리**합니다:

### 자동 처리 시나리오:

1. **신규 Google 계정 사용자**

   - Google로 로그인 → 자동으로 회원가입 → 바로 로그인 완료

2. **기존 Google 계정 사용자**

   - Google로 로그인 → 바로 로그인 완료

3. **이메일이 이미 등록된 경우**
   - 일반 회원가입으로 가입한 이메일과 동일한 Google 계정으로 로그인
   - 자동으로 Google 계정 연결 → 바로 로그인 완료
   - 이후부터는 Google 로그인과 일반 로그인 모두 사용 가능

### 사용자 경험:

- **로그인 페이지**: "Google로 로그인" 버튼
- **회원가입 페이지**: "Google로 회원가입" 버튼
- 두 버튼 모두 동일한 기능 (자동 회원가입/로그인)
- 사용자는 별도의 회원가입 절차 없이 Google 계정으로 바로 시작 가능

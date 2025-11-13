# Google OAuth 성공 가이드

## ✅ 구현 완료

Google OAuth 회원가입 및 로그인 기능이 성공적으로 작동하고 있습니다!

### 작동하는 기능:

1. ✅ Google OAuth 회원가입 - 자동으로 계정 생성
2. ✅ Google OAuth 로그인 - 기존 계정으로 로그인
3. ✅ JWT 토큰 발급 및 저장
4. ✅ 사용자 인증 상태 유지
5. ✅ 홈페이지로 자동 리다이렉트
6. ✅ 무한 루프 문제 해결
7. ✅ 기존 계정 자동 연결 (이메일 중복 시)

---

## 1. 데이터베이스 확인

### 사용자 정보 확인

```sql
SELECT id, name, email, googleId, password, role, createdAt
FROM "User"
WHERE email = 'your-email@gmail.com';
```

### 예상 결과:

```
id | name      | email              | googleId    | password | role | createdAt
---|-----------|--------------------|-----------  |----------|------|----------
1  | 홍길동    | test@gmail.com     | 1234567890  | NULL     | User | 2024-...
```

**필드 설명:**

- `googleId`: Google 계정 고유 ID (있으면 Google 로그인 사용)
- `password`: NULL이면 Google 전용 계정, 값이 있으면 일반+Google 계정
- `role`: User 또는 Admin

---

## 2. Google Cloud Console 확인

### OAuth 동의 화면 확인:

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. **API 및 서비스** > **OAuth 동의 화면** 선택
3. 사용자 수 확인

### 표시 예시:

```
게시 상태: 테스트 중
사용자 1명 (테스트 1명, 기타 0명) / 사용자 한도 100명
```

**의미:**

- **사용자 1명**: Google OAuth로 로그인한 사용자 수
- **테스트 1명**: 테스트 사용자로 추가된 계정
- **사용자 한도 100명**: 테스트 모드에서 최대 100명까지 가능

---

## 3. 추가 테스트 시나리오

### 시나리오 A: 로그아웃 후 재로그인

**목적**: 기존 계정으로 정상 로그인되는지 확인

**단계:**

1. 헤더에서 로그아웃 클릭
2. 로그인 페이지로 이동
3. "Google로 로그인" 버튼 클릭
4. Google 계정 선택

**예상 결과:**

- ✅ 새 계정이 생성되지 않음
- ✅ 기존 계정으로 로그인
- ✅ 동일한 사용자 정보 표시

**데이터베이스 확인:**

```sql
-- 사용자 수가 증가하지 않아야 함
SELECT COUNT(*) FROM "User";
```

---

### 시나리오 B: 일반 회원가입 후 Google 계정 연결

**목적**: 이메일이 동일한 경우 계정 자동 연결 확인

**단계:**

1. 로그아웃
2. 회원가입 페이지에서 일반 회원가입
   - 이름: "테스트 사용자"
   - 이메일: "test@gmail.com" (Google 계정과 동일)
   - 비밀번호: "password123"
3. 로그아웃
4. "Google로 로그인" 클릭
5. 동일한 이메일의 Google 계정 선택

**예상 결과:**

- ✅ 기존 계정에 Google ID 자동 연결
- ✅ 새 계정이 생성되지 않음
- ✅ 일반 로그인과 Google 로그인 모두 사용 가능

**데이터베이스 확인:**

```sql
SELECT id, name, email, googleId,
       CASE WHEN password IS NULL THEN 'Google만'
            ELSE '일반+Google' END as auth_type
FROM "User"
WHERE email = 'test@gmail.com';
```

**예상 결과:**

```
id | name         | email          | googleId   | auth_type
---|--------------|----------------|------------|------------
2  | 테스트 사용자 | test@gmail.com | 1234567890 | 일반+Google
```

---

### 시나리오 C: 두 가지 로그인 방법 사용

**목적**: 일반 로그인과 Google 로그인이 동일한 계정으로 작동하는지 확인

**전제 조건**: 시나리오 B 완료 (계정 연결됨)

**단계:**

1. 일반 로그인으로 로그인
   - 이메일: "test@gmail.com"
   - 비밀번호: "password123"
2. 사용자 정보 확인 (프로필 페이지)
3. 로그아웃
4. Google 로그인으로 로그인
5. 사용자 정보 확인

**예상 결과:**

- ✅ 두 방법 모두 정상 작동
- ✅ 동일한 사용자 ID 및 정보 표시
- ✅ 동일한 권한 (User/Admin)

---

### 시나리오 D: 여러 Google 계정 테스트

**목적**: 각 Google 계정마다 별도의 사용자가 생성되는지 확인

**단계:**

1. Google 계정 A로 로그인 → 회원가입
2. 로그아웃
3. Google 계정 B로 로그인 → 회원가입
4. 로그아웃
5. Google 계정 A로 다시 로그인

**예상 결과:**

- ✅ 각 Google 계정마다 별도의 사용자 생성
- ✅ 계정 전환 시 올바른 사용자 정보 표시
- ✅ 데이터 혼선 없음

**데이터베이스 확인:**

```sql
SELECT id, name, email, googleId
FROM "User"
WHERE googleId IS NOT NULL
ORDER BY createdAt DESC;
```

---

## 4. 브라우저 개발자 도구 확인

### localStorage 확인

**콘솔에서 실행:**

```javascript
console.log("Access Token:", localStorage.getItem("token"));
console.log("Refresh Token:", localStorage.getItem("refreshToken"));
```

**예상 결과:**

```
Access Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Refresh Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 사용자 정보 API 호출

**콘솔에서 실행:**

```javascript
fetch("http://localhost:3001/api/auth/me", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((r) => r.json())
  .then(console.log);
```

**예상 결과:**

```json
{
  "id": 1,
  "name": "홍길동",
  "email": "test@gmail.com",
  "role": "User"
}
```

---

## 5. 인증 흐름 확인

### Google OAuth 로그인 흐름:

```
1. 사용자: "Google로 로그인" 버튼 클릭
   ↓
2. 프론트엔드: /api/auth/google 으로 리다이렉트
   ↓
3. 백엔드: Google 로그인 페이지로 리다이렉트
   ↓
4. Google: 사용자 인증 및 권한 승인
   ↓
5. Google: /api/auth/google/callback 으로 리다이렉트
   ↓
6. 백엔드:
   - Google ID로 사용자 찾기
   - 없으면 이메일로 사용자 찾기
   - 없으면 새 사용자 생성
   - JWT 토큰 생성
   ↓
7. 백엔드: /auth/callback?accessToken=...&refreshToken=... 으로 리다이렉트
   ↓
8. 프론트엔드:
   - 토큰 저장 (localStorage)
   - 사용자 정보 로드
   - 홈페이지로 리다이렉트
   ↓
9. 완료: 로그인 상태로 홈페이지 표시
```

---

## 6. 문제 해결

### 문제 1: "redirect_uri_mismatch" 오류

**원인**: Google Cloud Console의 리디렉션 URI 설정 오류

**해결:**

1. Google Cloud Console → OAuth 클라이언트 ID
2. 승인된 리디렉션 URI 확인
3. 정확히 입력: `http://localhost:3001/api/auth/google/callback`
4. 저장 후 재시도

---

### 문제 2: "access_denied" 오류

**원인**: 테스트 사용자로 추가되지 않음

**해결:**

1. Google Cloud Console → OAuth 동의 화면
2. "테스트 사용자" 섹션 → "+ ADD USERS"
3. Gmail 주소 입력 및 저장
4. 재시도

---

### 문제 3: 무한 리다이렉트

**원인**: useEffect 의존성 배열 문제

**해결**: 이미 수정됨

- `/auth/callback`: 빈 의존성 배열 사용
- `/login`, `/register`: authLoading 체크 추가

---

### 문제 4: 토큰이 저장되지 않음

**원인**: localStorage 접근 권한 또는 CORS 문제

**해결:**

1. 브라우저 콘솔에서 오류 확인
2. CORS 설정 확인 (backend/src/app.ts)
3. 시크릿 모드에서 테스트

---

## 7. 보안 체크리스트

### 환경 변수 확인:

- [ ] `JWT_SECRET`: 강력한 랜덤 문자열 사용
- [ ] `REFRESH_TOKEN_SECRET`: 강력한 랜덤 문자열 사용
- [ ] `GOOGLE_CLIENT_ID`: Google Cloud Console에서 복사
- [ ] `GOOGLE_CLIENT_SECRET`: Google Cloud Console에서 복사
- [ ] `.env` 파일이 `.gitignore`에 포함됨

### 프로덕션 배포 전:

- [ ] HTTPS 사용
- [ ] 프로덕션 도메인으로 리디렉션 URI 업데이트
- [ ] OAuth 앱을 "프로덕션"으로 게시
- [ ] 환경 변수를 프로덕션 서버에 설정
- [ ] CORS 설정을 프로덕션 도메인으로 업데이트

---

## 8. 다음 단계 (선택사항)

### 기능 개선:

1. **프로필 페이지 개선**

   - Google 프로필 사진 표시
   - 계정 연결 상태 표시
   - 계정 정보 수정

2. **계정 연결 관리**

   - Google 계정 연결 해제 기능
   - 비밀번호 설정/변경 (Google 전용 계정)
   - 연결된 계정 목록 표시

3. **추가 소셜 로그인**

   - GitHub OAuth
   - Facebook OAuth
   - Kakao OAuth
   - Naver OAuth

4. **보안 강화**

   - 2단계 인증 (2FA)
   - 로그인 기록 표시
   - 의심스러운 활동 감지

5. **사용자 경험 개선**
   - 로딩 상태 개선
   - 에러 메시지 다국어 지원
   - 애니메이션 추가

---

## 9. 유용한 명령어

### 데이터베이스 쿼리:

```sql
-- 모든 사용자 조회
SELECT id, name, email, googleId,
       CASE WHEN password IS NULL THEN 'Google만'
            WHEN googleId IS NULL THEN '일반만'
            ELSE '일반+Google' END as auth_type,
       role, "createdAt"
FROM "User"
ORDER BY "createdAt" DESC;

-- Google 계정만 사용하는 사용자
SELECT * FROM "User"
WHERE googleId IS NOT NULL AND password IS NULL;

-- 일반 + Google 계정 모두 사용하는 사용자
SELECT * FROM "User"
WHERE googleId IS NOT NULL AND password IS NOT NULL;

-- 일반 계정만 사용하는 사용자
SELECT * FROM "User"
WHERE googleId IS NULL AND password IS NOT NULL;

-- 최근 가입한 사용자 5명
SELECT id, name, email, "createdAt"
FROM "User"
ORDER BY "createdAt" DESC
LIMIT 5;
```

### 서버 명령어:

```bash
# 백엔드 실행
cd backend
npm run dev

# 프론트엔드 실행
cd frontend
pnpm dev

# 데이터베이스 마이그레이션
cd backend
npx prisma migrate dev

# Prisma Studio 실행 (GUI)
cd backend
npx prisma studio
```

---

## 10. 참고 문서

- [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - 상세한 설정 가이드
- [QUICK_START.md](./QUICK_START.md) - 빠른 시작 가이드
- [GOOGLE_OAUTH_TEST_SCENARIOS.md](./GOOGLE_OAUTH_TEST_SCENARIOS.md) - 테스트 시나리오

---

## 축하합니다! 🎉

Google OAuth 통합이 성공적으로 완료되었습니다. 이제 사용자들은:

- Google 계정으로 간편하게 가입/로그인 가능
- 일반 로그인과 Google 로그인을 모두 사용 가능
- 안전하고 편리한 인증 경험 제공

추가 질문이나 문제가 있으면 언제든지 문의하세요!

# Google OAuth 테스트 시나리오

## 시나리오 1: 신규 Google 계정으로 회원가입

### 테스트 단계:

1. http://localhost:3000/register 접속
2. "Google로 회원가입" 버튼 클릭
3. Google 계정 선택 (처음 사용하는 계정)
4. 권한 승인

### 예상 결과:

- ✅ 자동으로 회원가입 완료
- ✅ 바로 로그인 상태로 홈페이지 이동
- ✅ 데이터베이스에 새 사용자 생성 (googleId, email, name 포함)

### 확인 방법:

```sql
SELECT id, name, email, googleId FROM "User" WHERE email = 'your-google-email@gmail.com';
```

---

## 시나리오 2: 기존 Google 계정으로 로그인

### 테스트 단계:

1. http://localhost:3000/login 접속
2. "Google로 로그인" 버튼 클릭
3. Google 계정 선택 (이미 사용한 계정)

### 예상 결과:

- ✅ 바로 로그인 완료
- ✅ 홈페이지로 이동
- ✅ 사용자 정보 표시

---

## 시나리오 3: 일반 회원가입 후 Google 로그인 (계정 연결)

### 테스트 단계:

1. **먼저 일반 회원가입**:

   - http://localhost:3000/register 접속
   - 이름: "홍길동"
   - 이메일: "test@gmail.com"
   - 비밀번호: "password123"
   - 회원가입 완료

2. **로그아웃**

3. **Google 로그인 시도**:
   - http://localhost:3000/login 접속
   - "Google로 로그인" 버튼 클릭
   - 동일한 이메일의 Google 계정 선택 (test@gmail.com)

### 예상 결과:

- ✅ 기존 계정에 Google ID 자동 연결
- ✅ 바로 로그인 완료
- ✅ 이후부터는 일반 로그인과 Google 로그인 모두 사용 가능

### 확인 방법:

```sql
-- googleId가 추가되었는지 확인
SELECT id, name, email, googleId, password FROM "User" WHERE email = 'test@gmail.com';
-- password와 googleId가 모두 있어야 함
```

---

## 시나리오 4: 일반 로그인 후 Google 로그인 (동일 계정)

### 테스트 단계:

1. 일반 로그인으로 로그인
2. 로그아웃
3. Google 로그인으로 로그인 (동일 이메일)

### 예상 결과:

- ✅ 두 방법 모두 정상 작동
- ✅ 동일한 사용자 정보 표시

---

## 시나리오 5: 여러 Google 계정 테스트

### 테스트 단계:

1. Google 계정 A로 로그인 → 회원가입
2. 로그아웃
3. Google 계정 B로 로그인 → 회원가입
4. 로그아웃
5. Google 계정 A로 다시 로그인

### 예상 결과:

- ✅ 각 Google 계정마다 별도의 사용자 생성
- ✅ 계정 전환 시 올바른 사용자 정보 표시

---

## 오류 시나리오 테스트

### 시나리오 6: Google 계정에 이메일이 없는 경우

### 예상 결과:

- ✅ 로그인 페이지로 리다이렉트
- ✅ 오류 메시지 표시: "인증에 실패했습니다"

---

### 시나리오 7: Google 인증 취소

### 테스트 단계:

1. "Google로 로그인" 클릭
2. Google 로그인 페이지에서 취소 또는 뒤로가기

### 예상 결과:

- ✅ 로그인 페이지로 리다이렉트
- ✅ 오류 메시지 표시

---

## 데이터베이스 확인 쿼리

### 모든 사용자 조회:

```sql
SELECT id, name, email, googleId,
       CASE WHEN password IS NULL THEN 'Google만' ELSE '일반+Google' END as auth_type,
       "createdAt"
FROM "User"
ORDER BY "createdAt" DESC;
```

### Google 계정만 사용하는 사용자:

```sql
SELECT * FROM "User" WHERE googleId IS NOT NULL AND password IS NULL;
```

### 일반 + Google 계정 모두 사용하는 사용자:

```sql
SELECT * FROM "User" WHERE googleId IS NOT NULL AND password IS NOT NULL;
```

### 일반 계정만 사용하는 사용자:

```sql
SELECT * FROM "User" WHERE googleId IS NULL AND password IS NOT NULL;
```

---

## 브라우저 개발자 도구 확인

### localStorage 확인:

```javascript
// 콘솔에서 실행
console.log("Token:", localStorage.getItem("token"));
console.log("Refresh Token:", localStorage.getItem("refreshToken"));
```

### 사용자 정보 확인:

```javascript
// 콘솔에서 실행
fetch("http://localhost:3001/api/auth/me", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((r) => r.json())
  .then(console.log);
```

---

## 예상 문제 및 해결

### 문제 1: "redirect_uri_mismatch"

**원인**: Google Cloud Console의 리디렉션 URI 설정 오류
**해결**: `http://localhost:3001/api/auth/google/callback` 정확히 입력

### 문제 2: "User with this email already exists"

**원인**: 이메일 중복 처리 로직 오류
**해결**: 백엔드 코드가 올바르게 업데이트되었는지 확인

### 문제 3: 토큰이 저장되지 않음

**원인**: localStorage 접근 권한 또는 CORS 문제
**해결**: 브라우저 콘솔에서 오류 확인, CORS 설정 확인

### 문제 4: 무한 리다이렉트

**원인**: 콜백 처리 오류
**해결**: `/auth/callback` 페이지 로직 확인, 브라우저 콘솔 확인

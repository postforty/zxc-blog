# 보안 수정: 민감 정보 노출 방지

## 문제점

게시글 상세 페이지의 HTML 소스에서 다음과 같은 민감 정보가 노출되고 있었습니다:

### 1. 사용자 정보 (Author, Comment Author)

- `googleId`: 소셜 로그인 식별자
- `email`: 사용자 이메일 주소 (평문)
- **`refreshToken`**: JWT Refresh Token (가장 심각한 보안 취약점)
- `password`: null이지만 필드 자체가 노출

### 2. 내부 시스템 정보

- 서버 측 절대 파일 경로
- 개발 환경 구조

## 위험성

### 즉각적인 위험

- **Refresh Token 탈취**: 공격자가 해당 토큰으로 사용자 권한을 획득하여 API 호출 및 세션 갱신 가능
- **이메일 노출**: 스팸, 피싱 공격에 악용 가능
- **시스템 구조 노출**: 잠재적인 공격 벡터 제공

## 해결 방법

백엔드 API에서 데이터를 반환할 때 `author` 객체를 필터링하도록 수정했습니다.

### 수정된 파일

#### 1. `backend/src/api/posts/posts.service.ts`

**변경 전:**

```typescript
include: {
  author: true,  // 모든 필드 포함 (위험!)
  tags: true,
}
```

**변경 후:**

```typescript
include: {
  author: {
    select: {
      id: true,
      name: true,
      role: true,
      createdAt: true,
    },
  },
  tags: true,
}
```

**수정된 함수:**

- `createPost()` - 게시글 생성
- `updatePost()` - 게시글 수정
- `getAllPosts()` - 게시글 목록 조회
- `getPostById()` - 게시글 상세 조회 (댓글 작성자 포함)

#### 2. `backend/src/api/comments/comments.service.ts`

**수정된 함수:**

- `createComment()` - 댓글 생성
- `getAllComments()` - 모든 댓글 조회

## 노출되는 정보 (안전)

이제 클라이언트에 전달되는 사용자 정보:

- `id`: 사용자 ID
- `name`: 사용자 이름
- `role`: 사용자 역할 (User/Admin)
- `createdAt`: 계정 생성일

## 노출되지 않는 정보 (보안)

- ❌ `email`: 이메일 주소
- ❌ `password`: 비밀번호 (해시)
- ❌ `refreshToken`: Refresh Token
- ❌ `googleId`: Google 소셜 로그인 ID

## 추가 권장 사항

### 1. 즉시 조치

- [ ] 노출된 Refresh Token 무효화 (DB에서 해당 토큰 삭제)
- [ ] 영향받은 사용자에게 재로그인 요청

### 2. 장기 보안 강화

- [ ] API 응답 데이터 직렬화 레이어 추가
- [ ] 프로덕션 환경에서 디버그 정보 제거
- [ ] 정기적인 보안 감사 수행
- [ ] Rate Limiting 적용
- [ ] CORS 정책 강화

### 3. 모니터링

- [ ] 비정상적인 API 호출 패턴 감지
- [ ] 토큰 탈취 시도 로깅
- [ ] 민감 정보 노출 자동 검사 도구 도입

## 테스트 방법

1. 백엔드 재시작
2. 게시글 상세 페이지 접속
3. 브라우저에서 "페이지 소스 보기" (Ctrl+U)
4. `refreshToken`, `email`, `password` 검색
5. 해당 필드가 없는지 확인

## 파일 경로 노출에 대하여

### 개발 모드 (현재)

Next.js 개발 모드에서는 디버깅을 위해 실제 파일 경로가 포함됩니다:

```
C:\\Users\\dandycode\\Documents\\GitHub\\zxc-blog\\frontend\\.next\\dev\\...
```

**이것은 정상적인 동작입니다.** 개발 환경에서만 발생하며, 다음을 위해 필요합니다:

- 소스맵 (Source Maps)
- Hot Module Replacement (HMR)
- 상세한 에러 스택 트레이스

### 프로덕션 모드

프로덕션 빌드(`npm run build`)를 실행하면:

- ✅ 파일 경로가 난독화됨
- ✅ 소스맵이 제거되거나 별도 파일로 분리됨
- ✅ 번들 파일명이 해시로 변경됨

### 추가 보안 설정

`frontend/next.config.ts`에 `productionBrowserSourceMaps: false` 추가하여 프로덕션에서 소스맵을 완전히 제거했습니다.

## 참고

- 관리자 API (`backend/src/api/admin/users.service.ts`)는 이미 올바르게 필터링되어 있음
- 인증 API (`backend/src/api/auth/auth.controller.ts`)는 필요한 경우에만 민감 정보 사용
- 좋아요 API (`backend/src/api/posts/likes.service.ts`)는 사용자 정보를 반환하지 않음

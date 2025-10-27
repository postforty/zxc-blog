# zxc-blog 백엔드 API 문서 (PostgreSQL + JWT + RBAC + Google OAuth + Zod)

이 문서는 zxc-blog 프런트엔드에 필요한 백엔드 API를 설명합니다. PostgreSQL, JWT 인증, 역할 기반 접근 제어(RBAC), Google OAuth, 그리고 Zod 유효성 검사를 포함합니다.

## 1. 기술 스택

- **런타임**: Node.js
- **프레임워크**: Express.js
- **데이터베이스**: PostgreSQL
- **ORM**: Prisma 또는 Sequelize
- **인증**: JWT (Access/Refresh Token), **Passport.js** (`passport-google-oauth20`)
- **유효성 검사**: **Zod**

## 2. 데이터 모델 (Relational)

PostgreSQL을 사용하므로 데이터를 정규화된 테이블로 구성합니다.

### `User` 테이블

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | 사용자 고유 ID |
| `googleId` | `VARCHAR(255)` | `UNIQUE` | Google 계정 고유 ID |
| `name` | `VARCHAR(255)` | `NOT NULL` | 사용자 이름 |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | 이메일 |
| `password` | `VARCHAR(255)` | | 해시된 비밀번호 (일반 가입 시) |
| `role` | `VARCHAR(50)` | `DEFAULT 'User'` | 역할 (`Admin`, `User`) |
| `refreshToken` | `VARCHAR(255)` | | JWT Refresh Token |
| `createdAt` | `TIMESTAMP` | `DEFAULT NOW()` | 가입일 |

### `Post` 테이블

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | 게시물 고유 ID |
| `authorId` | `INTEGER` | `FOREIGN KEY (User.id)` | 작성자 ID |
| `title` | `JSONB` | `NOT NULL` | 게시물 제목 `{"en": "...", "ko": "..."}` |
| `summary` | `JSONB` | | 요약 `{"en": "...", "ko": "..."}` |
| `content` | `JSONB` | `NOT NULL` | 내용 `{"en": "...", "ko": "..."}` |
| `likes` | `INTEGER` | `DEFAULT 0` | 좋아요 수 |
| `viewCount` | `INTEGER` | `DEFAULT 0` | 조회수 |
| `createdAt` | `TIMESTAMP` | `DEFAULT NOW()` | 생성일 |

### `Comment` 테이블

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | 댓글 고유 ID |
| `postId` | `INTEGER` | `FOREIGN KEY (Post.id)` | 연결된 게시물 ID |
| `authorId` | `INTEGER` | `FOREIGN KEY (User.id)` | 작성자 ID |
| `content` | `TEXT` | `NOT NULL` | 댓글 내용 |
| `parentId` | `INTEGER` | `FOREIGN KEY (Comment.id)` | 부모 댓글 ID (대댓글용) |
| `createdAt` | `TIMESTAMP` | `DEFAULT NOW()` | 생성일 |

### `Tag` 테이블

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | 태그 고유 ID |
| `name` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | 태그 이름 |

### `Post_Tags` 테이블 (Join Table)

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
|---|---|---|---|
| `postId` | `INTEGER` | `PRIMARY KEY, FOREIGN KEY (Post.id)` | 게시물 ID |
| `tagId` | `INTEGER` | `PRIMARY KEY, FOREIGN KEY (Tag.id)` | 태그 ID |

## 3. 유효성 검사 (Validation with Zod)

`zod`를 사용하여 프런트엔드와 백엔드 양쪽에서 데이터 유효성을 검사합니다. 이를 통해 안정성을 높이고 코드의 일관성을 유지합니다.

### 스키마 공유

- **공통 스키마**: `zod` 스키마는 별도의 공유 패키지/디렉토리에서 관리하여 프런트엔드와 백엔드 프로젝트가 모두 가져와 사용할 수 있도록 하는 것을 권장합니다.

### 백엔드 적용

- Express 미들웨어를 생성하여 각 API 요청의 `body`, `params`, `query`를 해당 `zod` 스키마로 검증합니다.
- 유효성 검사를 통과하지 못하면, 400 Bad Request 에러와 함께 상세한 오류 메시지를 클라이언트에 반환합니다.

### 프런트엔드 적용

- `react-hook-form`과 같은 폼 라이브러리와 `@hookform/resolvers/zod` 어댑터를 함께 사용하여 동일한 `zod` 스키마로 사용자 입력을 실시간으로 검증합니다.

## 4. 인증 및 인가 (Authentication & Authorization)

### 인증 방식

두 가지 인증 방식을 지원합니다:
1.  **이메일/비밀번호 기반 인증**
2.  **Google OAuth 2.0 기반 인증**

로그인 성공 후의 흐름(Access/Refresh Token 발급 및 사용)은 두 방식 모두 동일합니다.

### 공통 인증 흐름 (JWT)

- **Access Token**: 수명이 짧은(예: 15분) JWT. API 요청 시 `Authorization` 헤더에 담아 전송하여 리소스에 접근합니다.
- **Refresh Token**: 수명이 긴(예: 7일) JWT. Access Token이 만료되었을 때 새로운 Access Token을 발급받기 위해 사용됩니다.

### Google OAuth 인증 흐름

1.  **로그인 시작 (`GET /api/auth/google`)**: 클라이언트에서 이 엔드포인트로 접근하면, 백엔드는 사용자를 Google 로그인 페이지로 리디렉션합니다.
2.  **Google 콜백 (`GET /api/auth/google/callback`)**: 사용자가 Google 로그인을 완료하면, Google은 지정된 콜백 URL로 사용자를 리디렉션하며 인증 코드를 함께 전달합니다.
3.  **사용자 처리 및 JWT 발급**: 백엔드는 콜백 요청을 받아 사용자를 찾거나 생성한 후, 자체 Access/Refresh Token을 발급하여 클라이언트에 전달합니다.

### 인가 (Authorization)

- **역할 기반 접근 제어 (RBAC)**: 사용자 역할(`Admin`, `User`)에 따라 특정 API에 대한 접근을 제어합니다.
- **미들웨어**: Express 미들웨어를 사용하여 각 API 요청 전에 Access Token을 검증하고, 토큰에 포함된 `role`이 해당 엔드포인트에 필요한 권한을 가지고 있는지 확인합니다.

## 5. API 엔드포인트 및 필요 권한

| HTTP Method | 엔드포인트 | 설명 | 필요 권한 |
|---|---|---|---|
| **인증** | | | |
| `POST` | `/api/auth/login` | 이메일/비밀번호 로그인 | `Guest` |
| `POST` | `/api/auth/register` | 이메일/비밀번호 회원가입 | `Guest` |
| `GET` | `/api/auth/google` | Google 로그인 시작 | `Guest` |
| `GET` | `/api/auth/google/callback` | Google 로그인 콜백 | `Guest` |
| `POST` | `/api/auth/refresh` | 토큰 재발급 | `User`, `Admin` |
| `POST` | `/api/auth/logout` | 로그아웃 | `User`, `Admin` |
| **게시물** | | | |
| `GET` | `/api/posts` | 모든 게시물 조회 | `Guest` |
| `GET` | `/api/posts/:id` | 특정 게시물 조회 | `Guest` |
| `POST` | `/api/posts` | 새 게시물 작성 | `Admin` |
| `PUT` | `/api/posts/:id` | 게시물 수정 | `Admin`|
| `DELETE` | `/api/posts/:id` | 게시물 삭제 | `Admin` |
| `POST` | `/api/posts/:id/like` | 게시물 좋아요 | `Guest` |
| **댓글** | | | |
| `GET` | `/api/posts/:postId/comments` | 특정 게시물의 댓글 조회 | `Guest` |
| `POST` | `/api/posts/:postId/comments` | 댓글 작성 | `User`, `Admin` |
| `PUT` | `/api/comments/:id` | **자신의** 댓글 수정 | `User`, `Admin` |
| `DELETE` | `/api/comments/:id` | **자신의** 댓글 삭제 | `User`, `Admin` |
| **관리자 페이지** | | | |
| `GET` | `/api/admin/stats/summary` | 주요 지표 요약 | `Admin` |
| `GET` | `/api/admin/stats/posts/top-viewed` | 조회수 상위 게시물 | `Admin` |
| `GET` | `/api/admin/stats/posts/top-liked` | 좋아요 상위 게시물 | `Admin` |
| `GET` | `/api/admin/stats/visitors` | 방문자 통계 | `Admin` |
| `GET` | `/api/admin/users` | 모든 사용자 조회 | `Admin` |
| `PUT` | `/api/admin/users/:id/role` | 사용자 역할 변경 | `Admin` |
| `GET` | `/api/admin/profile` | 프로필 정보 조회 | `Admin` |
| `PUT` | `/api/admin/profile` | 프로필 정보 수정 | `Admin` |
| `GET` | `/api/admin/settings` | 블로그 설정 조회 | `Admin` |
| `PUT` | `/api/admin/settings` | 블로그 설정 수정 | `Admin` |
| **기타** | | | |
| `GET` | `/api/health` | 서버 상태 헬스 체크 | `Guest` |

## 6. 프로젝트 구조

```
/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── passport.js      // Passport.js (Google 전략) 설정
│   ├── api/
│   │   └── ...
│   ├── middleware/
│   │   ├── validateRequest.js // Zod 유효성 검사 미들웨어
│   │   ├── verifyToken.js     // Access Token 검증
│   │   └── checkRole.js       // 역할(role) 검증
│   ├── app.js
│   └── server.js
├── .env
└── package.json
```

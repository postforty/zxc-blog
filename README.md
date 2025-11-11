# ZXC Blog 프로젝트

이 프로젝트는 프런트엔드와 백엔드로 구성된 블로그 애플리케이션입니다. 프런트엔드는 React와 Vite를 사용하여 SSR(서버 측 렌더링)을 지원하며, 백엔드는 Express와 TypeScript를 사용하여 API를 제공합니다.

## 프로젝트 설정

### 1. 종속성 설치

프런트엔드와 백엔드 각각의 디렉토리에서 종속성을 설치해야 합니다.

```bash
# 프로젝트 루트 디렉토리에서 (예: C:\Users\dandycode\Documents\GitHub\zxc-blog\)

# 프런트엔드 종속성 설치
cd frontend
npm install

# 백엔드 종속성 설치
cd ../backend
npm install

# 프로젝트 루트로 돌아가기
cd ..
```

## 개발 환경에서 프로젝트 실행

개발 환경에서는 백엔드 서버를 실행하면 프런트엔드의 Vite 개발 서버와 통합되어 SSR 및 HMR(Hot Module Replacement)을 지원합니다.

```bash
# 백엔드 디렉토리로 이동
cd backend

# 개발 서버 시작 (SSR 활성화)
npm run dev
```

서버가 시작되면 `http://localhost:3001`에서 애플리케이션에 접속할 수 있습니다.

## 프로덕션 환경에서 SSR로 프로젝트 빌드 및 실행

프로덕션 환경에서 SSR을 활성화하여 프로젝트를 실행하려면 다음 빌드 및 실행 단계를 순서대로 수행해야 합니다.

### 1. 프런트엔드 클라이언트 측 자산 빌드

브라우저에서 사용될 정적 파일(HTML, CSS, JavaScript)을 생성합니다.

```bash
# 프런트엔드 디렉토리로 이동
cd frontend

# 클라이언트 빌드 실행
npm run build:client
```

이 명령은 `frontend/dist/client` 디렉토리에 결과물을 생성합니다.

### 2. 프런트엔드 서버 측 번들 빌드 (SSR용)

백엔드 서버가 SSR을 수행하는 데 사용할 JavaScript 번들을 생성합니다.

```bash
# 프런트엔드 디렉토리에서
npm run build:ssr
```

이 명령은 `frontend/dist/server` 디렉토리에 결과물을 생성합니다.

### 3. 백엔드 빌드

백엔드의 TypeScript 코드를 JavaScript로 컴파일합니다.

```bash
# 백엔드 디렉토리로 이동
cd ../backend

# 백엔드 빌드 실행
npm run build
```

이 명령은 `backend/dist` 디렉토리에 컴파일된 JavaScript 파일을 생성합니다.

### 4. 프로덕션 서버 시작 (SSR 활성화)

모든 빌드가 완료되면, 백엔드 서버를 프로덕션 모드로 시작합니다. 이 서버는 정적 프런트엔드 자산을 제공하고 들어오는 요청에 대해 SSR을 수행합니다.

```bash
# 백엔드 디렉토리에서
NODE_ENV=production node dist/app.js
```

**참고:**
-   `NODE_ENV=production` 환경 변수는 백엔드 서버가 프런트엔드의 프로덕션 빌드를 사용하고 프로덕션 SSR 로직을 활성화하도록 지시하는 데 중요합니다.
-   `dist/app.js`는 `backend/tsconfig.json` 설정에 따라 `backend/src/app.ts`가 `backend/dist/app.js`로 컴파일된다고 가정합니다. 다른 출력 경로를 사용하는 경우 명령을 조정해야 합니다.

### 5. 애플리케이션 접속

서버가 시작되면 터미널에 "Server is running on http://localhost:3001"과 같은 메시지가 표시됩니다. 웹 브라우저를 열고 해당 URL로 이동하면 SSR이 활성화된 애플리케이션을 확인할 수 있습니다.

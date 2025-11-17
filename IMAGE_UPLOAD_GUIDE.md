# 이미지 업로드 기능 가이드

## 구현 완료 사항

### 백엔드

- ✅ multer를 사용한 이미지 업로드 API (`/api/uploads/images`)
- ✅ 임시 폴더(`uploads/temp`)와 영구 폴더(`uploads/images`) 분리
- ✅ 파일 타입 검증 (JPEG, PNG, GIF, WebP)
- ✅ 파일 크기 제한 (5MB)
- ✅ UUID를 사용한 파일명 중복 방지
- ✅ 24시간 이상 된 임시 이미지 자동 삭제 API

### 프론트엔드

- ✅ 이미지 버튼 클릭으로 파일 선택
- ✅ 드래그 앤 드롭으로 이미지 업로드
- ✅ 클립보드에서 이미지 붙여넣기 (Ctrl+V)
- ✅ 업로드 중 로딩 표시
- ✅ 커서 위치에 마크다운 이미지 삽입
- ✅ 한국어/영어 각각 독립적으로 이미지 업로드

## 사용 방법

### 1. 이미지 버튼 클릭

- 에디터 상단의 이미지 아이콘 버튼 클릭
- 파일 선택 대화상자에서 이미지 선택

### 2. 드래그 앤 드롭

- 이미지 파일을 텍스트 영역으로 드래그
- 드롭하면 자동으로 업로드 및 마크다운 삽입

### 3. 붙여넣기

- 클립보드에 이미지 복사 (스크린샷 등)
- 텍스트 영역에서 Ctrl+V (또는 Cmd+V)
- 자동으로 업로드 및 마크다운 삽입

## API 엔드포인트

### 이미지 업로드

```
POST /api/uploads/images
Content-Type: multipart/form-data
Authorization: Required (JWT)

Body:
- image: File (이미지 파일)

Response:
{
  "url": "/api/uploads/temp/uuid-filename.jpg"
}
```

### 임시 이미지 정리

```
DELETE /api/uploads/cleanup
Authorization: Required (JWT)

Response:
{
  "message": "Deleted N unused images"
}
```

## 파일 구조

```
backend/
├── src/
│   └── api/
│       └── uploads/
│           ├── index.ts              # 라우터
│           ├── multer.config.ts      # Multer 설정
│           ├── uploads.controller.ts # 컨트롤러
│           └── uploads.service.ts    # 비즈니스 로직
└── uploads/                          # 업로드 폴더 (gitignore)
    ├── temp/                         # 임시 이미지
    └── images/                       # 영구 이미지

frontend/
└── src/
    ├── lib/
    │   └── api/
    │       └── uploads.ts            # 업로드 API 클라이언트
    └── components/
        └── posts/
            └── PostEditor.tsx        # 이미지 업로드 UI
```

## 향후 개선 사항

### 1. 게시글 저장 시 이미지 영구화

현재는 모든 이미지가 임시 폴더에 저장됩니다. 게시글 저장 시:

- 마크다운에서 사용된 이미지 URL 파싱
- 임시 폴더 → 영구 폴더로 이동
- DB에 게시글-이미지 관계 저장

### 2. 이미지 최적화

- 이미지 리사이징 (sharp 라이브러리)
- WebP 자동 변환
- 썸네일 생성

### 3. 클라우드 스토리지 연동

- AWS S3 또는 Cloudinary 연동
- CDN을 통한 빠른 이미지 제공

### 4. 진행률 표시

- 대용량 이미지 업로드 시 진행률 표시

## 테스트 방법

1. 백엔드 서버 실행

```bash
cd backend
npm run dev
```

2. 프론트엔드 서버 실행

```bash
cd frontend
npm run dev
```

3. 로그인 후 게시글 작성 페이지로 이동

4. 다음 방법으로 이미지 업로드 테스트:

   - 이미지 버튼 클릭
   - 이미지 파일 드래그 앤 드롭
   - 스크린샷 복사 후 Ctrl+V

5. 미리보기에서 이미지가 정상적으로 표시되는지 확인

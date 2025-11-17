# SEO 최적화 구현 태스크 리스트

## 🎯 Phase 1: 필수 SEO 기능 (우선순위: 높음)

### Task 1.1: Sitemap 생성

**예상 시간**: 1-2시간  
**우선순위**: 🔴 높음

#### 구현 내용

- [ ] `frontend/src/app/sitemap.ts` 파일 생성
- [ ] 백엔드 API에서 모든 게시글 목록 가져오는 함수 구현
- [ ] 정적 페이지 URL 추가 (홈, 소개 등)
- [ ] 게시글 URL 동적 생성
- [ ] lastModified, changeFrequency, priority 설정
- [ ] 빌드 시 자동 생성 확인

#### 구현 파일

```
frontend/src/app/sitemap.ts (신규)
frontend/src/lib/api/posts.ts (수정 - getAllPosts 함수 추가)
```

#### 테스트

- [ ] 로컬에서 `/sitemap.xml` 접근 확인
- [ ] 모든 게시글이 포함되는지 확인
- [ ] XML 형식이 올바른지 검증

---

### Task 1.2: robots.txt 생성

**예상 시간**: 30분  
**우선순위**: 🔴 높음

#### 구현 내용

- [ ] `frontend/src/app/robots.ts` 파일 생성
- [ ] 크롤링 허용/차단 규칙 설정
- [ ] sitemap.xml 경로 명시
- [ ] admin, api 경로 차단

#### 구현 파일

```
frontend/src/app/robots.ts (신규)
```

#### 테스트

- [ ] 로컬에서 `/robots.txt` 접근 확인
- [ ] 규칙이 올바르게 표시되는지 확인

---

### Task 1.3: 구조화된 데이터 (JSON-LD) 추가

**예상 시간**: 2-3시간  
**우선순위**: 🔴 높음

#### 구현 내용

- [ ] BlogPosting 스키마 타입 정의
- [ ] 게시글 페이지에 JSON-LD 스크립트 추가
- [ ] Organization 스키마 추가 (사이트 정보)
- [ ] BreadcrumbList 스키마 추가 (네비게이션)
- [ ] Person 스키마 추가 (작성자 정보)

#### 구현 파일

```
frontend/src/app/(blog)/posts/[id]/page.tsx (수정)
frontend/src/lib/structured-data.ts (신규 - 스키마 생성 유틸)
frontend/src/app/layout.tsx (수정 - Organization 스키마)
```

#### 테스트

- [ ] Google Rich Results Test로 검증
- [ ] Schema.org Validator로 확인
- [ ] 개발자 도구에서 JSON-LD 확인

---

### Task 1.4: Open Graph 이미지 추가

**예상 시간**: 2-3시간  
**우선순위**: 🔴 높음

#### 구현 내용

- [ ] 기본 OG 이미지 생성 (1200x630)
- [ ] 게시글별 썸네일 이미지 필드 추가 (백엔드)
- [ ] 메타데이터에 OG 이미지 URL 추가
- [ ] Twitter Card 이미지 추가
- [ ] 이미지 없을 경우 기본 이미지 사용

#### 구현 파일

```
frontend/public/og-image.png (신규)
frontend/src/app/(blog)/posts/[id]/page.tsx (수정)
backend/prisma/schema.prisma (수정 - thumbnailUrl 필드 추가)
backend/src/api/posts/posts.service.ts (수정)
```

#### 테스트

- [ ] Facebook Sharing Debugger로 확인
- [ ] Twitter Card Validator로 확인
- [ ] 실제 소셜 미디어 공유 테스트

---

### Task 1.5: Canonical URL 설정

**예상 시간**: 1시간  
**우선순위**: 🔴 높음

#### 구현 내용

- [ ] 모든 페이지에 canonical URL 추가
- [ ] 다국어 alternate 링크 추가
- [ ] 환경 변수로 도메인 관리

#### 구현 파일

```
frontend/src/app/(blog)/posts/[id]/page.tsx (수정)
frontend/src/app/(blog)/page.tsx (수정)
frontend/.env.local (수정 - NEXT_PUBLIC_SITE_URL 추가)
```

#### 테스트

- [ ] HTML 소스에서 canonical 태그 확인
- [ ] alternate 태그 확인

---

## 🚀 Phase 2: 성능 및 사용자 경험 개선 (우선순위: 중간)

### Task 2.1: 이미지 최적화 전면 적용

**예상 시간**: 3-4시간  
**우선순위**: 🟡 중간

#### 구현 내용

- [ ] ReactMarkdown에 커스텀 Image 컴포넌트 추가
- [ ] 모든 정적 이미지를 Next.js Image로 변경
- [ ] 이미지 로딩 전략 설정 (lazy, eager)
- [ ] placeholder 이미지 추가 (blur)
- [ ] 이미지 크기 최적화 설정

#### 구현 파일

```
frontend/src/components/posts/PostViewServer.tsx (수정)
frontend/src/components/common/Header.tsx (수정)
frontend/src/components/common/Footer.tsx (수정)
frontend/next.config.ts (수정 - images 설정)
```

#### 테스트

- [ ] Lighthouse 성능 점수 확인
- [ ] 이미지 로딩 속도 측정
- [ ] 다양한 화면 크기에서 테스트

---

### Task 2.2: 캐싱 전략 개선 (ISR 적용)

**예상 시간**: 2-3시간  
**우선순위**: 🟡 중간

#### 구현 내용

- [ ] 게시글 목록에 ISR 적용 (revalidate: 3600)
- [ ] 게시글 상세에 ISR 적용
- [ ] generateStaticParams 구현
- [ ] 정적 페이지 사전 생성
- [ ] 캐시 무효화 전략 수립

#### 구현 파일

```
frontend/src/app/(blog)/posts/[id]/page.tsx (수정)
frontend/src/app/(blog)/page.tsx (수정)
frontend/src/lib/api/posts.ts (수정)
```

#### 테스트

- [ ] 빌드 시 정적 페이지 생성 확인
- [ ] revalidate 동작 확인
- [ ] 캐시 히트율 모니터링

---

### Task 2.3: HTML lang 속성 동적 설정

**예상 시간**: 1-2시간  
**우선순위**: 🟡 중간

#### 구현 내용

- [ ] 사용자 언어 설정에 따라 lang 속성 변경
- [ ] 쿠키 또는 로컬 스토리지에서 언어 설정 읽기
- [ ] 서버 컴포넌트에서 언어 감지
- [ ] 메타데이터에 언어별 alternate 추가

#### 구현 파일

```
frontend/src/app/layout.tsx (수정)
frontend/src/middleware.ts (신규 - 언어 감지)
```

#### 테스트

- [ ] 언어 변경 시 lang 속성 확인
- [ ] SEO 도구로 다국어 설정 검증

---

### Task 2.4: Analytics 통합

**예상 시간**: 2-3시간  
**우선순위**: 🟡 중간

#### 구현 내용

- [ ] Google Analytics 4 설정
- [ ] Google Search Console 연동
- [ ] Vercel Analytics 추가 (선택)
- [ ] 커스텀 이벤트 추적 설정
- [ ] 페이지뷰 추적
- [ ] 사용자 행동 추적

#### 구현 파일

```
frontend/src/app/layout.tsx (수정)
frontend/src/components/analytics/GoogleAnalytics.tsx (신규)
frontend/.env.local (수정 - GA_MEASUREMENT_ID 추가)
```

#### 테스트

- [ ] Google Analytics 실시간 보고서 확인
- [ ] 이벤트 추적 동작 확인
- [ ] Search Console 데이터 수집 확인

---

### Task 2.5: Web Vitals 모니터링

**예상 시간**: 1-2시간  
**우선순위**: 🟡 중간

#### 구현 내용

- [ ] next/web-vitals 통합
- [ ] Core Web Vitals 추적 (LCP, FID, CLS)
- [ ] 성능 데이터 수집
- [ ] Vercel Speed Insights 추가 (선택)
- [ ] 성능 저하 알림 설정

#### 구현 파일

```
frontend/src/app/layout.tsx (수정)
frontend/src/components/analytics/WebVitals.tsx (신규)
```

#### 테스트

- [ ] Lighthouse 점수 확인
- [ ] PageSpeed Insights 테스트
- [ ] 실제 사용자 데이터 수집 확인

---

## 🎨 Phase 3: 접근성 및 고급 기능 (우선순위: 낮음)

### Task 3.1: 접근성 개선 (ARIA)

**예상 시간**: 3-4시간  
**우선순위**: 🟢 낮음

#### 구현 내용

- [ ] 모든 버튼에 aria-label 추가
- [ ] 네비게이션에 aria-current 추가
- [ ] 폼 요소에 aria-describedby 추가
- [ ] 모달에 aria-modal, role="dialog" 추가
- [ ] 스크린 리더 전용 텍스트 추가
- [ ] 키보드 네비게이션 개선

#### 구현 파일

```
frontend/src/components/common/Header.tsx (수정)
frontend/src/components/posts/PostInteractions.tsx (수정)
frontend/src/components/comments/CommentForm.tsx (수정)
frontend/src/components/ui/* (수정 - 모든 UI 컴포넌트)
```

#### 테스트

- [ ] axe DevTools로 접근성 검사
- [ ] WAVE 도구로 검증
- [ ] 키보드만으로 전체 사이트 탐색
- [ ] 스크린 리더 테스트 (NVDA, JAWS)

---

### Task 3.2: PWA 지원 (manifest.json)

**예상 시간**: 2-3시간  
**우선순위**: 🟢 낮음

#### 구현 내용

- [ ] manifest.json 생성
- [ ] 다양한 크기의 아이콘 생성
- [ ] Service Worker 설정
- [ ] 오프라인 지원
- [ ] 설치 프롬프트 추가

#### 구현 파일

```
frontend/src/app/manifest.ts (신규)
frontend/public/icons/* (신규 - 다양한 크기 아이콘)
frontend/src/app/layout.tsx (수정 - manifest 링크)
```

#### 테스트

- [ ] Lighthouse PWA 점수 확인
- [ ] 모바일에서 설치 테스트
- [ ] 오프라인 동작 확인

---

### Task 3.3: 동적 OG 이미지 생성

**예상 시간**: 4-5시간  
**우선순위**: 🟢 낮음

#### 구현 내용

- [ ] @vercel/og 라이브러리 설치
- [ ] 동적 이미지 생성 API 라우트 구현
- [ ] 게시글 제목, 작성자 정보 포함
- [ ] 브랜드 로고 및 디자인 적용
- [ ] 캐싱 전략 적용

#### 구현 파일

```
frontend/src/app/api/og/route.tsx (신규)
frontend/src/app/(blog)/posts/[id]/page.tsx (수정)
```

#### 테스트

- [ ] 다양한 제목 길이로 테스트
- [ ] 소셜 미디어 공유 확인
- [ ] 이미지 생성 속도 측정

---

### Task 3.4: 색상 대비 및 다크모드 접근성

**예상 시간**: 2-3시간  
**우선순위**: 🟢 낮음

#### 구현 내용

- [ ] WCAG AA 기준 색상 대비 확인
- [ ] 다크모드에서 색상 대비 검증
- [ ] 색맹 사용자를 위한 색상 조정
- [ ] 포커스 인디케이터 개선

#### 구현 파일

```
frontend/src/app/globals.css (수정)
frontend/tailwind.config.ts (수정)
```

#### 테스트

- [ ] Contrast Checker로 검증
- [ ] 다양한 색맹 시뮬레이터 테스트
- [ ] 실제 사용자 피드백 수집

---

### Task 3.5: Favicon 다양화

**예상 시간**: 1시간  
**우선순위**: 🟢 낮음

#### 구현 내용

- [ ] 다양한 크기의 favicon 생성 (16x16, 32x32, 180x180)
- [ ] apple-touch-icon 추가
- [ ] favicon.svg 추가 (다크모드 지원)
- [ ] 메타데이터에 아이콘 링크 추가

#### 구현 파일

```
frontend/src/app/icon.tsx (신규 - 동적 favicon)
frontend/src/app/apple-icon.tsx (신규)
frontend/public/favicon.ico (수정)
```

#### 테스트

- [ ] 다양한 브라우저에서 favicon 확인
- [ ] 모바일 홈 화면 아이콘 확인

---

## 📋 추가 개선 사항

### Task 4.1: 404 페이지 최적화

**예상 시간**: 1시간  
**우선순위**: 🟡 중간

#### 구현 내용

- [ ] 커스텀 404 페이지 디자인
- [ ] 추천 게시글 링크 추가
- [ ] 검색 기능 추가
- [ ] 홈으로 돌아가기 버튼

#### 구현 파일

```
frontend/src/app/not-found.tsx (수정)
```

---

### Task 4.2: 로딩 상태 개선

**예상 시간**: 2시간  
**우선순위**: 🟡 중간

#### 구현 내용

- [ ] Suspense 경계 추가
- [ ] 스켈레톤 UI 개선
- [ ] 로딩 인디케이터 추가
- [ ] Streaming SSR 활용

#### 구현 파일

```
frontend/src/app/(blog)/posts/[id]/loading.tsx (신규)
frontend/src/app/(blog)/loading.tsx (신규)
```

---

### Task 4.3: 에러 처리 개선

**예상 시간**: 2시간  
**우선순위**: 🟡 중간

#### 구현 내용

- [ ] 에러 바운더리 추가
- [ ] 사용자 친화적 에러 메시지
- [ ] 에러 로깅 시스템
- [ ] 재시도 버튼 추가

#### 구현 파일

```
frontend/src/app/(blog)/posts/[id]/error.tsx (신규)
frontend/src/app/error.tsx (신규)
```

---

## 📊 진행 상황 추적

### Phase 1 (필수) - 0/5 완료

- [ ] Task 1.1: Sitemap 생성
- [ ] Task 1.2: robots.txt 생성
- [ ] Task 1.3: 구조화된 데이터 추가
- [ ] Task 1.4: Open Graph 이미지 추가
- [ ] Task 1.5: Canonical URL 설정

### Phase 2 (중간) - 0/5 완료

- [ ] Task 2.1: 이미지 최적화
- [ ] Task 2.2: 캐싱 전략 개선
- [ ] Task 2.3: HTML lang 동적 설정
- [ ] Task 2.4: Analytics 통합
- [ ] Task 2.5: Web Vitals 모니터링

### Phase 3 (낮음) - 0/5 완료

- [ ] Task 3.1: 접근성 개선
- [ ] Task 3.2: PWA 지원
- [ ] Task 3.3: 동적 OG 이미지 생성
- [ ] Task 3.4: 색상 대비 개선
- [ ] Task 3.5: Favicon 다양화

### 추가 개선 - 0/3 완료

- [ ] Task 4.1: 404 페이지 최적화
- [ ] Task 4.2: 로딩 상태 개선
- [ ] Task 4.3: 에러 처리 개선

---

## 🎯 예상 총 소요 시간

- **Phase 1 (필수)**: 7-10시간
- **Phase 2 (중간)**: 9-13시간
- **Phase 3 (낮음)**: 12-18시간
- **추가 개선**: 5시간

**총 예상 시간**: 33-46시간

---

## 📝 구현 순서 권장

1. **Week 1**: Phase 1 전체 (필수 SEO 기능)
2. **Week 2**: Phase 2의 Task 2.1, 2.2 (성능 개선)
3. **Week 3**: Phase 2의 Task 2.3, 2.4, 2.5 (모니터링)
4. **Week 4**: Phase 3 및 추가 개선 (선택적)

---

## 🔗 참고 자료

- [Next.js SEO 공식 문서](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Web.dev - SEO](https://web.dev/lighthouse-seo/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

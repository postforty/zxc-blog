# 블로그 아키텍처 설계

이 문서는 블로그 프로젝트의 프론트엔드 아키텍처를 정의합니다. 컴포넌트 구조, 데이터 모델, 페이지 라우팅에 대한 설계를 포함합니다.

## 1. 데이터 모델

초기에는 클라이언트 측에서 사용할 데이터의 구조를 다음과 같이 정의합니다.

### Post (게시물)

```typescript
interface Post {
  id: string; // 고유 식별자 (예: a-simple-post)
  title: string; // 제목
  content: string; // 내용 (Markdown 형식)
  author: string; // 작성자
  createdAt: string; // 생성일 (ISO 8601 형식)
  summary?: string; // 목록에 표시될 짧은 요약
}
```

### Comment (댓글)

```typescript
interface Comment {
  id: string; // 고유 식별자
  postId: string; // 연결된 게시물의 id
  author: string; // 작성자
  content: string; // 내용
  createdAt: string; // 생성일 (ISO 8601 형식)
}
```

## 2. 페이지 및 라우팅

React Router를 사용하여 다음 페이지들을 관리합니다.

*   `/` : **게시물 목록 페이지 (Home)**
    *   모든 게시물의 목록을 보여줍니다.
*   `/posts/:id` : **게시물 상세 페이지 (Post Detail)**
    *   특정 게시물의 전체 내용과 댓글을 보여줍니다.
*   `/editor` : **새 게시물 작성 페이지 (New Post)**
    *   새로운 게시물을 작성하는 에디터 페이지입니다.
*   `/editor/:id` : **게시물 수정 페이지 (Edit Post)**
    *   기존 게시물을 수정하는 에디터 페이지입니다.

## 3. 컴포넌트 구조

컴포넌트는 재사용성과 관심사 분리를 고려하여 다음과 같이 구조화합니다.

```
src
├── components/
│   ├── ui/  (Shadcn/UI 컴포넌트가 위치할 디렉토리)
│   │   ├── button.tsx
│   │   └── ...
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx (Header, Footer 등을 포함하는 공통 레이아웃)
│   └── posts/
│       ├── PostList.tsx
│       ├── PostListItem.tsx
│       ├── PostView.tsx
│       └── PostEditor.tsx
│   └── comments/
│       ├── CommentList.tsx
│       └── CommentForm.tsx
└── pages/
    ├── HomePage.tsx (게시물 목록)
    ├── PostDetailPage.tsx (게시물 상세)
    └── EditorPage.tsx (게시물 작성/수정)
```

### 컴포넌트 설명

*   **Layout:** 모든 페이지에 공통적으로 적용될 레이아웃 (헤더, 푸터 포함).
*   **Header:** 사이트 제목과 네비게이션 링크를 포함.
*   **PostList:** 게시물 목록을 렌더링.
*   **PostListItem:** `PostList` 내의 개별 게시물 아이템.
*   **PostView:** 단일 게시물의 제목과 본문을 보여주는 컴포넌트.
*   **PostEditor:** 새 게시물 작성 및 수정을 위한 마크다운 에디터.
*   **CommentList:** 특정 게시물에 달린 댓글 목록.
*   **CommentForm:** 새로운 댓글을 작성하는 폼.
*   **HomePage:** `PostList`를 포함하는 메인 페이지.
*   **PostDetailPage:** `PostView`와 `CommentList`, `CommentForm`을 포함하는 상세 페이지.
*   **EditorPage:** `PostEditor`를 포함하는 작성/수정 페이지.

# 백엔드 수정 사항 - 댓글 "수정됨" 표시 기능

## 1. 데이터베이스 스키마 수정

### Prisma 스키마 (schema.prisma)

Comment 모델에 `updatedAt` 필드 추가:

```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt  // ← 이 줄 추가
  postId    Int
  authorId  Int
  parentId  Int?
  // ... 기타 필드
}
```

스키마 수정 후 마이그레이션 실행:

```bash
npx prisma migrate dev --name add_comment_updated_at
```

---

## 2. 댓글 업데이트 API 수정

### PUT /api/comments/:id

**요청 예시:**

```http
PUT /api/comments/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "수정된 댓글 내용"
}
```

**응답 예시:**

```json
{
  "id": "1",
  "postId": "1",
  "content": "수정된 댓글 내용",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T10:30:00.000Z",
  "authorId": 1,
  "author": {
    "id": 1,
    "name": "사용자 이름"
  },
  "parentId": null,
  "replies": []
}
```

**컨트롤러 코드 예시:**

```javascript
// PUT /api/comments/:id
async updateComment(req, res) {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id; // 인증된 사용자 ID

  try {
    // 권한 확인
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // 댓글 업데이트 (updatedAt은 자동으로 갱신됨)
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
      include: {
        author: {
          select: { id: true, name: true }
        },
        replies: {
          include: {
            author: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
}
```

---

## 3. 댓글 조회 API 수정

### GET /api/posts/:postId/comments

**응답에 `updatedAt` 필드 포함:**

```json
[
  {
    "id": "1",
    "postId": "1",
    "content": "댓글 내용",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "id": 1,
      "name": "사용자 이름"
    },
    "authorId": 1,
    "parentId": null,
    "replies": [
      {
        "id": "2",
        "postId": "1",
        "content": "답글 내용",
        "createdAt": "2024-01-01T01:00:00.000Z",
        "updatedAt": "2024-01-02T10:00:00.000Z",
        "author": {
          "id": 2,
          "name": "다른 사용자"
        },
        "authorId": 2,
        "parentId": "1"
      }
    ]
  }
]
```

**컨트롤러 코드 예시:**

```javascript
// GET /api/posts/:postId/comments
async getComments(req, res) {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: parseInt(postId),
        parentId: null // 최상위 댓글만
      },
      include: {
        author: {
          select: { id: true, name: true }
        },
        replies: {
          include: {
            author: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
}
```

---

## 4. 핵심 포인트

✅ **`updatedAt` 필드는 Prisma의 `@updatedAt` 데코레이터로 자동 관리됩니다**

- 댓글이 생성될 때: `createdAt === updatedAt`
- 댓글이 수정될 때: `updatedAt`만 자동으로 현재 시간으로 업데이트

✅ **프론트엔드 동작**

- `updatedAt !== createdAt`이면 "(수정됨)" 표시
- 답글이 있어도 수정 가능

✅ **모든 댓글 응답에 다음 필드 포함 필수:**

- `id`
- `postId`
- `content`
- `createdAt`
- `updatedAt` ← 중요!
- `authorId`
- `author.id` ← 중요!
- `author.name`
- `parentId`
- `replies` (있는 경우)

---

## 5. 테스트 방법

1. 댓글 작성 후 조회 → `createdAt === updatedAt` 확인
2. 댓글 수정 후 조회 → `updatedAt > createdAt` 확인
3. 프론트엔드에서 "(수정됨)" 표시 확인

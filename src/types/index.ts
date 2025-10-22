export interface Post {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  summary?: string;
  content: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
  parentId?: string; // 대댓글 기능을 위한 부모 댓글 ID
  replies?: Comment[]; // 대댓글 목록
}

export interface VisitorStats {
  dailyVisitors: number;
  totalVisitors: number;
  lastVisitDate: string; // ISO 8601 format (YYYY-MM-DD)
}

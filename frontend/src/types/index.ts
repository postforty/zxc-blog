export interface Post {
  id: string;
  title: {
    en: string;
    ko: string;
  };
  author: any;
  createdAt: string;
  summary?: {
    en: string;
    ko: string;
  };
  content: {
    en: string;
    ko: string;
  };
  likes: number;
  tags: { id: number; name: string }[];
  viewCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: { name: string; id: number };
  authorId: number;
  content: string;
  createdAt: string;
  updatedAt?: string; // 수정 시간
  parentId?: string; // 대댓글 기능을 위한 부모 댓글 ID
  replies?: Comment[]; // 대댓글 목록
}

export interface VisitorStats {
  dailyVisitors: number;
  totalVisitors: number;
  yesterdayVisitors: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

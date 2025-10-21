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
}

export interface VisitorStats {
  dailyVisitors: number;
  totalVisitors: number;
  lastVisitDate: string; // ISO 8601 format (YYYY-MM-DD)
}

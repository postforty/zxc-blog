console.log("--- Loading app.ts ---");
import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRouter from "./api/auth/index.js";
import postsRouter from "./api/posts/index.js";
import commentsRouter from "./api/comments/index.js";
import allCommentsRouter from "./api/comments/comments.router.js";
import adminRouter from "./api/admin/index.js";
import statsRouter from "./api/stats/index.js";
import uploadsRouter from "./api/uploads/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

app.use("/docs", express.static(path.join(__dirname, "../dist")));
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/redoc.html"));
});

// 업로드된 이미지 정적 파일 서빙
app.use(
  "/api/uploads/temp",
  express.static(path.join(__dirname, "../uploads/temp"))
);
app.use(
  "/api/uploads/images",
  express.static(path.join(__dirname, "../uploads/images"))
);

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/posts/:postId/comments", commentsRouter);
app.use("/api/comments", allCommentsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/stats", statsRouter);
app.use("/api/uploads", uploadsRouter);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

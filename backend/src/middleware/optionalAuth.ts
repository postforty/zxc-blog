import type { Request, Response, NextFunction } from "express";
import passport from "passport";

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Authorization 헤더 확인
  const authHeader = req.headers.authorization;

  // 토큰이 없거나 Bearer 형식이 아니면 인증 없이 진행
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  // Bearer 토큰 추출
  const token = authHeader.substring(7);

  // 토큰이 비어있으면 인증 없이 진행
  if (!token || token.trim() === "") {
    return next();
  }

  // 유효한 토큰이 있을 때만 passport 인증 시도
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    // 인증 실패는 무시하고 계속 진행 (optional이므로)
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};

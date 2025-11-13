import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Prisma에서 생성된 User 타입 사용
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type User = Prisma.UserGetPayload<{}>;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "your_jwt_secret",
};

// JWT Strategy
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// Google OAuth 2.0 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "your_google_client_id",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "your_google_client_secret",
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 이메일이 없는 경우 처리
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(
            new Error("Google 프로필에서 이메일을 가져올 수 없습니다"),
            false
          );
        }

        // 1. googleId로 기존 사용자 찾기
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (user) {
          return done(null, user);
        }

        // 2. 이메일로 기존 사용자 찾기 (일반 회원가입으로 가입한 경우)
        user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (user) {
          // 기존 계정에 Google ID 연결
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: profile.id },
          });
          return done(null, user);
        }

        // 3. 새 사용자 생성
        user = await prisma.user.create({
          data: {
            googleId: profile.id,
            name: profile.displayName || "Unknown User",
            email: email,
          },
        });

        return done(null, user);
      } catch (error) {
        console.error("Google OAuth 오류:", error);
        return done(error as Error, false);
      }
    }
  )
);

// 세션 직렬화
passport.serializeUser<number>((user, done) => {
  const prismaUser = user as User;
  done(null, prismaUser.id);
});

// 세션 역직렬화
passport.deserializeUser<number>(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return done(new Error("사용자를 찾을 수 없습니다"), null);
    }

    done(null, user);
  } catch (error) {
    console.error("사용자 역직렬화 오류:", error);
    done(error as Error, null);
  }
});

export default passport;
export { prisma };

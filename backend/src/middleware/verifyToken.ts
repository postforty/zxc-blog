
import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import type { Prisma } from '@prisma/client';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: Prisma.User | false, info: any) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

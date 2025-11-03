import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    console.log('optionalAuth middleware:', { err, user, info });
    if (err) {
      return next(err);
    }
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};

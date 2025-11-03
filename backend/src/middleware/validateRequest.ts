import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

interface RequestValidation<T, U, V> {
  body?: z.ZodSchema<T>;
  query?: z.ZodSchema<U>;
  params?: z.ZodSchema<V>;
}

export const validateRequest = <T, U, V>(
  schemas: RequestValidation<T, U, V>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation error",
          issues: error.issues,
        });
      }
      console.error(error); // Add logging here!
      return res.status(500).json({ error: "Internal server error" });
    }
  };
};

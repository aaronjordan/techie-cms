import { Request, Response, NextFunction } from 'express';

export const authorizationCookieParser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if ('authorization' in req.cookies) {
    const token = req.cookies.authorization;
    if (!('Authorization' in req.headers)) {
      req.headers.authorization = `Bearer ${token}`;
    }
  }

  next();
};

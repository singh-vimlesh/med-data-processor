import { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Internal server error' });
};

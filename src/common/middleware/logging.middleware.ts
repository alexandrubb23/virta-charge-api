import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const label = `Request-response time for ${req.baseUrl} - ${req.method} method`;
    console.time(label);

    res.on('finish', () => console.timeEnd(label));

    next();
  }
}

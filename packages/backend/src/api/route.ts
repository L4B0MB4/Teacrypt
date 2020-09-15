import express, { NextFunction, Request, Response } from 'express';

import { responses } from '../utils/responses';
import { keyExchangeRouter } from './keyexchange/route';

export const ApiRouter = express.Router();

ApiRouter.use((req: Request, res: Response, next: NextFunction) => {
  if (req.sessionID) {
    next();
  } else {
    return responses.missingSessionId(res);
  }
});

ApiRouter.use("/keyexchange", keyExchangeRouter);

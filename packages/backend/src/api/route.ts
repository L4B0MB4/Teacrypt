import express, { NextFunction, Request, Response } from 'express';

import { responses } from '../utils/responses';
import { authenticationRouter } from './authentication/route';
import { keyExchangeRouter } from './keyexchange/route';

export const ApiRouter = express.Router();

ApiRouter.use((req: Request, res: Response, next: NextFunction) => {
  if (req.sessionID) {
    next();
  } else {
    return responses.missingSessionId(res);
  }
});

const hasSessionUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    next();
  } else {
    return responses.missingSessionUser(res);
  }
};

ApiRouter.use("/authentication", authenticationRouter);

ApiRouter.use(hasSessionUser);

ApiRouter.use("/keyexchange", keyExchangeRouter);

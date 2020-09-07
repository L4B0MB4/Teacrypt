import * as express from 'express';

import { keyExchangeRouter } from './keyexchange/route';

export const ApiRouter = express.Router();

ApiRouter.use("/keyexchange", keyExchangeRouter);

import * as express from 'express';

import * as controller from './controller';

export const keyExchangeRouter = express.Router();

keyExchangeRouter.get("/public-key", controller.getPublicKey);

keyExchangeRouter.post("/encrypt", controller.encryptValidation, controller.encrypt);

keyExchangeRouter.post("/decrypt", controller.decryptValidation, controller.decrypt);

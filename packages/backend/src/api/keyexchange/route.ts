import express from 'express';

import * as controller from './controller';

export const keyExchangeRouter = express.Router();

keyExchangeRouter.get("/public-key", controller.getPublicKey);

keyExchangeRouter.post("/authenticate", controller.authenticateValidation, controller.authenticate);

keyExchangeRouter.post("/validate", controller.validateAuthenticationValidation, controller.validateAuthentication);

keyExchangeRouter.post("/decrypt", controller.decryptValidation, controller.decrypt);

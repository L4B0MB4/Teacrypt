import express from 'express';

import * as controller from './controller';

export const authenticationRouter = express.Router();

authenticationRouter.get("/public-key", controller.getPublicKey);

authenticationRouter.post("/authenticate", controller.authenticateValidation, controller.authenticate);

authenticationRouter.post("/validate", controller.validateAuthenticationValidation, controller.validateAuthentication);

authenticationRouter.post("/decrypt", controller.decryptValidation, controller.decrypt);

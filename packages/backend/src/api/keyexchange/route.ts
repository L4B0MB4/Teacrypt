import express from 'express';

import * as controller from './controller';

export const keyExchangeRouter = express.Router();

keyExchangeRouter.post("/sharekey", controller.shareAESKeyValidation, controller.shareAESKey);

keyExchangeRouter.get("/:userId/publicKey", controller.getPublicKeyValidation, controller.getPublicKey);

keyExchangeRouter.get("/participantkeys", controller.getParticipantKeys);

import { Request, Response } from 'express';

import { responses } from '../../utils/responses';
import * as ValidationUtils from '../../utils/validation';
import * as service from './service';

const { body } = require("express-validator");

export const getPublicKey = (_: Request, res: Response) => {
  try {
    const publicKey = service.getPublicKey();
    return res.json({ publicKey });
  } catch (ex) {
    return res.status(400).json({ status: 400, message: ex.message });
  }
};

export const authenticateValidation = ValidationUtils.validate([body("publicKey").notEmpty().isString()]);
export const authenticate = async (req: Request, res: Response) => {
  try {
    const plainSessionId = await service.authenticate(req.body.publicKey);
    const sessionId = service.encrypt(plainSessionId, req.body.publicKey);
    return res.json({ sessionId });
  } catch (ex) {
    return responses.error(res, ex);
  }
};

export const decryptValidation = ValidationUtils.validate([body("toDecrypt").notEmpty().isString()]);
export const decrypt = (req: Request, res: Response) => {
  try {
    const decrypted = service.decrypt(req.body.toDecrypt);
    return res.json({ decrypted });
  } catch (ex) {
    return responses.error(res, ex);
  }
};

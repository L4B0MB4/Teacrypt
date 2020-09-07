import { Request, Response } from 'express';

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

export const encryptValidation = ValidationUtils.validate([body("publicKey").notEmpty().isString()]);
export const encrypt = (req: Request, res: Response) => {
  try {
    const encrypted = service.encrypt(Date.now().toString(), req.body.publicKey);
    return res.json({ encrypted });
  } catch (ex) {
    return res.status(400).json({ status: 400, message: ex.message });
  }
};

export const decryptValidation = ValidationUtils.validate([body("toDecrypt").notEmpty().isString()]);
export const decrypt = (req: Request, res: Response) => {
  try {
    const decrypted = service.decrypt(req.body.toDecrypt);
    return res.json({ decrypted });
  } catch (ex) {
    return res.status(400).json({ status: 400, message: ex.message });
  }
};

import { Request, Response } from 'express';

import { responses } from '../../utils/responses';
import * as ValidationUtils from '../../utils/validation';
import * as service from './service';

const { body } = require("express-validator");

export const getPublicKey = (req: Request, res: Response) => {
  try {
    const publicKey = service.getPublicKey();
    return res.json({ publicKey });
  } catch (ex) {
    return responses.error(res, ex);
  }
};

export const authenticateValidation = ValidationUtils.validate([body("publicKey").notEmpty().isString()]);
export const authenticate = async (req: Request, res: Response) => {
  try {
    const plainAuthenticator = await service.initiateAuthentication(req.sessionID!, req.body.publicKey);
    const authenticator = service.encrypt(plainAuthenticator, req.body.publicKey);
    return res.json({ authenticator });
  } catch (ex) {
    return responses.error(res, ex);
  }
};

export const validateAuthenticationValidation = ValidationUtils.validate([body("authenticator").notEmpty().isString()]);
export const validateAuthentication = async (req: Request, res: Response) => {
  try {
    const plainAuthenticator = service.decrypt(req.body.authenticator);
    const isValid = service.validateAuthentication(req.sessionID!, plainAuthenticator);
    if (isValid) {
      req.session.user = await service.getUser(req.sessionID);
      return res.send({ userId: req.session.user.id, aesKey: req.session.user.aesKey });
    } else {
      return responses.error(res, new Error("Authenticator not valid!"));
    }
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

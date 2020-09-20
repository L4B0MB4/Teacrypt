import { Request, Response } from 'express';

import { responses } from '../../utils/responses';
import * as ValidationUtils from '../../utils/validation';
import * as authService from '../authentication/service';
import * as service from './service';

const { body, check } = require("express-validator");

export const shareAESKeyValidation = ValidationUtils.validate([
  body("sharerKey").notEmpty().isString(),
  body("participantKey").notEmpty().isString(),
  body("participantID").notEmpty().isString(),
]);
export const shareAESKey = (req: Request, res: Response) => {
  try {
    const success = service.shareAESKey(
      req.body.sharerKey,
      req.body.participantKey,
      req.body.participantID,
      req.session.sessionUser!
    );
    return res.json({ success });
  } catch (ex) {
    return res.status(400).json({ status: 400, message: ex.message });
  }
};

export const getPublicKeyValidation = ValidationUtils.validate([check("userId").notEmpty().isString()]);

export const getPublicKey = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId.toString();
    const user = await authService.getUser(userId);
    if (user) {
      return res.send({ publicKey: user.publicKey });
    } else {
      return responses.notFound(res, new Error("Could not find a user with id:" + userId));
    }
  } catch (ex) {
    return res.status(400).json({ status: 400, message: ex.message });
  }
};

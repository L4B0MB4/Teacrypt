import { Request, Response } from 'express';

import * as ValidationUtils from '../../utils/validation';
import * as service from './service';

const { body } = require("express-validator");

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
      req.sessionUser!
    );
    return res.json({ success });
  } catch (ex) {
    return res.status(400).json({ status: 400, message: ex.message });
  }
};

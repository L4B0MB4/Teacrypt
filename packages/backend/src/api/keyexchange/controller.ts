import { Request, Response } from 'express';

import { responses } from '../../utils/responses';
import * as ValidationUtils from '../../utils/validation';
import * as authService from '../authentication/service';
import * as service from './service';

const { body, check } = require("express-validator");

export const shareAESKeyValidation = ValidationUtils.validate([
  body("participantKey").notEmpty().isString(),
  body("participantID").notEmpty().isString(),
]);
export const shareAESKey = async (req: Request, res: Response) => {
  try {
    const success = await service.shareAESKey(req.body.participantKey, req.body.participantID, req.session.user!);
    return res.json({ success });
  } catch (ex) {
    return responses.error(res, ex);
  }
};

export const getPublicKeyValidation = ValidationUtils.validate([check("userId").notEmpty().isString()]);

export const getPublicKey = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId.toString();
    const user = await authService.getUserById(userId);
    if (user) {
      return res.send({ publicKey: user.publicKey });
    } else {
      return responses.notFound(res, new Error("Could not find a user with id:" + userId));
    }
  } catch (ex) {
    return responses.error(res, ex);
  }
};

export const getParticipantKeys = async (req: Request, res: Response) => {
  try {
    const participantKeys = await service.getParticipantKeys(req.session.user._id);
    return res.send(participantKeys);
  } catch (ex) {
    return responses.error(res, ex);
  }
};

import { Request, Response } from 'express';

import * as service from './service';

export const index = (_: Request, res: Response) => {
  try {
    const publicKey = service.getPublicKey();
    return res.json({ publicKey });
  } catch (ex) {
    return res.status(400).json({ status: 400, message: ex.message });
  }
};

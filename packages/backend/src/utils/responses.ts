import { Response } from 'express';

export const responses = {
  success: { success: true },
  error: (res: Response, ex: Error) => {
    return res.status(400).json({ status: 400, message: ex.message });
  },
  missingSessionId: (res: Response) => {
    return res.status(400).json({ status: 400, message: "Missing sessionID" });
  },
};

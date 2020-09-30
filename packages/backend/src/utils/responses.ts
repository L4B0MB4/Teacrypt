import { Response } from 'express';

export const responses = {
  success: { success: true },
  error: (res: Response, ex: Error) => {
    return res.status(400).json({ status: 400, message: ex.message });
  },
  missingSessionId: (res: Response) => {
    return res.status(400).json({ status: 400, message: "Missing sessionID" });
  },
  missingSessionUser: (res: Response) => {
    return res.status(400).json({ status: 400, message: "Missing sessionUser" });
  },
  notFound: (res: Response, ex: Error) => {
    return res.status(404).json({ status: 404, message: ex.message });
  },
};

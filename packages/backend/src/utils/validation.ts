import { NextFunction, Request, Response } from 'express';

// the types are wrong for the express-validator
const { validationResult } = require("express-validator");
export const validate = (validations: Array<{ run: (req: Request) => void }>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

import { NextFunction, Request, Response } from 'express';

const { validationResult } = require("express-validator");
export const validate = (validations: Array<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

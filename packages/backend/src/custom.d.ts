import { IUser } from './api/authentication/model';

export {};
declare global {
  namespace Express {
    export interface Request {
      sessionIsValid?: boolean;
      sessionUser?: IUser;
    }
  }
}

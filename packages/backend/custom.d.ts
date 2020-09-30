import { IUser } from './src/api/authentication/model';

declare global {
  namespace Express {
    interface Session {
      user: IUser;
    }
  }
}

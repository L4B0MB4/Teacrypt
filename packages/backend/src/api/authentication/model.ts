import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  publicKey: string;
  id: string;
}

const userSchema = new mongoose.Schema({
  publicKey: String,
  id: String,
});
export const UserModel = mongoose.model<IUser>("User", userSchema);

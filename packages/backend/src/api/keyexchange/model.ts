import * as mongoose from 'mongoose';

import { IUser } from '../authentication/model';

interface IKey extends mongoose.Document {
  sharerKey: string;
  participantKey: string;
  sharer: mongoose.Schema.Types.ObjectId | IUser;
  participant: mongoose.Schema.Types.ObjectId | IUser;
}

const keySchema = new mongoose.Schema({
  sharerKey: String,
  participantKey: String,
  sharer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
export const KeyModel = mongoose.model<IKey>("Key", keySchema);

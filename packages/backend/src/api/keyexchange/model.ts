import * as mongoose from 'mongoose';

interface IKey extends mongoose.Document {
  publicKey: string;
}

const keySchema = new mongoose.Schema({
  publicKey: String,
});
export const KeyModel = mongoose.model<IKey>("Key", keySchema);

import { Schema } from 'mongoose';

import { IUser, UserModel } from '../authentication/model';
import { KeyModel } from './model';

export const shareAESKey = async (participantKey: string, participantID: string, sharer: IUser) => {
  const participant = await UserModel.findOne({ id: participantID });
  if (!participant) {
    return false;
  }

  if (!(await KeyModel.findOne({ participant: participant._id, sharer: sharer._id }))) {
    const keyMSharer = new KeyModel();
    keyMSharer.participant = participant._id;
    keyMSharer.sharer = sharer._id;
    keyMSharer.participantKey = participantKey;
    keyMSharer.save();
  }

  return true;
};

export const getParticipantKeys = async (_id: Schema.Types.ObjectId) => {
  const keys = await KeyModel.find({ participant: _id }).populate("sharer");
  if (keys) {
    return keys.map((item) => ({ sharerId: (item.sharer as IUser).id, aesKey: item.participantKey }));
  } else {
    return [];
  }
};

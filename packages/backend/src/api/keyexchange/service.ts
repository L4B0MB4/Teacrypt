import { IUser, UserModel } from '../authentication/model';
import { KeyModel } from './model';

export const shareAESKey = async (sharerKey: string, participantKey: string, participantID: string, sharer: IUser) => {
  const participant = await UserModel.findOne({ id: participantID });
  if (!participant) {
    return false;
  }
  const keyM = new KeyModel();
  keyM.participant = participant._id;
  keyM.sharer = sharer._id;
  keyM.sharerKey = sharerKey;
  keyM.participantKey = participantKey;
  keyM.save();
};

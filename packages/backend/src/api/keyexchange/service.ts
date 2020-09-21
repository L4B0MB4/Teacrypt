import { IUser, UserModel } from '../authentication/model';
import { KeyModel } from './model';

export const shareAESKey = async (sharerKey: string, participantKey: string, participantID: string, sharer: IUser) => {
  const participant = await UserModel.findOne({ id: participantID });
  if (!participant) {
    return false;
  }

  if (!(await KeyModel.findOne({ participant: participant._id, sharer: sharer._id }))) {
    const keyMSharer = new KeyModel();
    keyMSharer.participant = participant._id;
    keyMSharer.sharer = sharer._id;
    keyMSharer.sharerKey = sharerKey;
    keyMSharer.participantKey = participantKey;
    keyMSharer.save();
  }

  if (!(await KeyModel.findOne({ participant: sharer._id, sharer: participant._id }))) {
    const keyMParticipant = new KeyModel();
    keyMParticipant.participant = sharer._id;
    keyMParticipant.sharer = participant._id;
    keyMParticipant.sharerKey = participantKey;
    keyMParticipant.participantKey = sharerKey;
    keyMParticipant.save();
  }
  return true;
};

import mockingoose from 'mockingoose';
import { mongo } from 'mongoose';

import { IUser, UserModel } from '../authentication/model';
import { KeyModel } from './model';
import * as Service from './service';

beforeAll(() => {
  mockingoose(KeyModel);
  mockingoose(UserModel);
});
beforeEach(() => {
  mockingoose(KeyModel).reset();
  mockingoose(UserModel).reset();
});

describe("KeyExchange Service", () => {
  it("sharing a aes key", async () => {
    mockingoose(UserModel).toReturn({ _id: "p_Id" }, "findOne");
    const result = await Service.shareAESKey("pKey", "pId", { _id: new mongo.ObjectID() } as IUser);
    expect(result).toBe(true);
  });
});

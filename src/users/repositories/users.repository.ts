import { userCollection } from '../../db/collections';
import { User } from '../domain/user';
import { DeleteResult, ObjectId, WithId } from 'mongodb';
import { UserViewModel } from '../routes/output/user.view-model';

export const usersRepository = {
  async findById(id: string): Promise<WithId<User> | null> {
    return await userCollection.findOne({ _id: new ObjectId(id) });
  },

  async findByCode(code: string): Promise<WithId<User> | null> {
    return await userCollection.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  },

  async updateConfirmationCode(
    _id: ObjectId,
    code: string,
    expDate: Date,
  ): Promise<boolean> {
    const result = await userCollection.updateOne(
      { _id },
      {
        $set: {
          'emailConfirmation.confirmationCode': code,
          'emailConfirmation.expirationDate': expDate,
        },
      },
    );
    return result.modifiedCount === 1;
  },

  async updateConfirmationCodeStatus(_id: ObjectId): Promise<boolean> {
    let result = await userCollection.updateOne(
      { _id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  },

  async create(newUser: User): Promise<string> {
    const insertResult = await userCollection.insertOne(newUser);
    return insertResult.insertedId.toString();
  },

  async delete(id: string): Promise<DeleteResult> {
    return await userCollection.deleteOne({
      _id: new ObjectId(id),
    });
  },

  async findByLoginOrEmail(loginOrEmail: {
    login?: string;
    email?: string;
  }): Promise<WithId<User> | null> {
    return await userCollection.findOne({
      $or: [{ email: loginOrEmail.email }, { login: loginOrEmail.login }],
    });
  },

  async doesExistByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<boolean> {
    const user = await userCollection.findOne({
      $or: [{ email }, { login }],
    });
    return !!user;
  },

  mapToUserViewModel(user: WithId<User>): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  },
};

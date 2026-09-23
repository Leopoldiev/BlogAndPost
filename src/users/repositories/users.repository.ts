import { userCollection } from '../../db/collections';
import { User } from '../domain/user';
import { ObjectId, WithId } from 'mongodb';
import { NotFoundException } from '../../core/exceptions/not-found.exception';

export const usersRepository = {
  async create(newUser: User): Promise<string> {
    const insertResult = await userCollection.insertOne(newUser);
    return insertResult.insertedId.toString();
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new NotFoundException('User not exist');
    }
    return;
  },

  async findByLoginOrEmail(loginOrEmail: {
    login?: string;
    email?: string;
  }): Promise<WithId<User> | null> {
    return await userCollection.findOne({
      $or: [{ email: loginOrEmail.email }, { login: loginOrEmail.login }],
    });
  },
};

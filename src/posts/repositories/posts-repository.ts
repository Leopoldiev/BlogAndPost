import { PostDBModel } from '../types/postViewModel';
import { PostInputDto } from '../dto/post-input-dto';
import { ObjectId, WithId } from 'mongodb';
import { postCollection } from '../../db/collections';

export const postsRepository = {
  async findAll(): Promise<WithId<PostDBModel>[]> {
    return postCollection.find({}).toArray();
  },

  async findById(id: string): Promise<WithId<PostDBModel> | null> {
    return await postCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(post: PostDBModel) {
    const insertResult = await postCollection.insertOne(post);
    return await postCollection.findOne({ _id: insertResult.insertedId });
  },

  async update(id: string, post: PostInputDto): Promise<boolean> {
    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: post },
    );
    return updateResult.matchedCount > 0;
  },

  async delete(id: string) {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return deleteResult.deletedCount > 0;
  },
};

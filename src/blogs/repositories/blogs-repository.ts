import { BlogDBModel } from '../types/blogViewModel';
import { blogCollection } from '../../db/collections';
import { ObjectId, WithId } from 'mongodb';
import { BlogInputDto } from '../dto/blog-input-dto';

export const blogsRepository = {
  async findAll(): Promise<WithId<BlogDBModel>[]> {
    return await blogCollection.find({}).toArray();
  },

  async findById(id: string): Promise<WithId<BlogDBModel> | null> {
    return await blogCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(blog: BlogDBModel) {
    const insertResult = await blogCollection.insertOne(blog);
    return await blogCollection.findOne({ _id: insertResult.insertedId });
  },

  async update(id: string, blog: BlogInputDto): Promise<boolean> {
    const updateResult = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: blog },
    );
    return updateResult.matchedCount > 0;
  },

  async delete(id: string): Promise<boolean> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return deleteResult.deletedCount > 0;
  },
};

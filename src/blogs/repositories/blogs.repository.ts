import { blogCollection } from '../../db/collections';
import { ObjectId, WithId } from 'mongodb';
import { BlogCreateUpdateDto } from '../application/dtos/blog-create-update.dto';
import { Blog } from '../domain/blog';
import { NotFoundException } from '../../core/exceptions/not-found.exception';

export const blogsRepository = {
  async create(newBlog: Blog): Promise<string> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: BlogCreateUpdateDto): Promise<void> {
    const updateResult = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new NotFoundException('Blog not exist');
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new NotFoundException('Blog not exist');
    }
    return;
  },

  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    return blog;
  },
};

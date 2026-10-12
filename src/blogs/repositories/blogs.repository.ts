import { blogCollection } from '../../db/collections';
import { DeleteResult, ObjectId, UpdateResult, WithId } from 'mongodb';
import { BlogCreateUpdateDto } from '../application/dtos/blog-create-update.dto';
import { Blog } from '../domain/blog';
import { BlogViewModel } from '../routes/output/blog.view-model';

export const blogsRepository = {
  async findById(id: string): Promise<WithId<Blog> | null> {
    return await blogCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newBlog: Blog): Promise<string> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return insertResult.insertedId.toString();
  },

  async update(
    id: string,
    dto: BlogCreateUpdateDto,
  ): Promise<UpdateResult<Blog>> {
    return await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );
  },

  async delete(id: string): Promise<DeleteResult> {
    return await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });
  },

  mapToBlogViewModel(blog: WithId<Blog>): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  },
};

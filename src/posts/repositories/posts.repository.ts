import { DeleteResult, ObjectId, UpdateResult, WithId } from 'mongodb';
import { postCollection } from '../../db/collections';
import { Post } from '../domain/post';
import { PostCreateUpdateDto } from '../application/dtos/post-create-update.dto';
import { PostViewModel } from '../types/postViewModel';

export const postsRepository = {
  async create(post: Post): Promise<string> {
    const insertResult = await postCollection.insertOne(post);
    return insertResult.insertedId.toString();
  },

  async update(
    id: string,
    dto: PostCreateUpdateDto,
  ): Promise<UpdateResult<Post>> {
    return await postCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      },
    );
  },

  async delete(id: string): Promise<DeleteResult> {
    return postCollection.deleteOne({
      _id: new ObjectId(id),
    });
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return await postCollection.findOne({ _id: new ObjectId(id) });
  },

  mapToPostViewModel(post: WithId<Post>): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },
};

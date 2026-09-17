import { ObjectId, WithId } from 'mongodb';
import { postCollection } from '../../db/collections';
import { Post } from '../domain/post';
import { PostCreateUpdateDto } from '../application/dtos/post-create-update.dto';
import { NotFoundException } from '../../core/exceptions/not-found.exception';
import { PostViewModel } from '../types/postViewModel';

export const postsRepository = {
  async create(post: Post): Promise<string> {
    const insertResult = await postCollection.insertOne(post);
    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: PostCreateUpdateDto): Promise<void> {
    const updateResult = await postCollection.updateOne(
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

    if (updateResult.matchedCount < 1) {
      throw new NotFoundException('Post not exist');
    }

    return;
  },

  async delete(id: string) {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new NotFoundException('Post not exist');
    }
    return;
  },

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
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

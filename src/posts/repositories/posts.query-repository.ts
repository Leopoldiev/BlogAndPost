import { ObjectId, WithId } from 'mongodb';
import { postCollection } from '../../db/collections';
import { NotFoundException } from '../../core/exceptions/not-found.exception';
import { Post } from '../domain/post';
import { PostQueryInput } from '../input/post-query.input';
import { PostViewModel } from '../types/postViewModel';
import { PaginatedViewModelOutput } from '../../core/types/paginated-view-model.output';

export const postsQueryRepository = {
  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  },

  async findMany(
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const items = await postCollection
      .find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments();

    return { items, totalCount };
  },

  async findManyByBlogId(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const items = await postCollection
      .find({ blogId: blogId })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments({
      blogId: blogId,
    });

    return { items, totalCount };
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

  mapToPostPaginatedOutput(
    data: WithId<Post>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
  ): PaginatedViewModelOutput<PostViewModel> {
    return {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
      items: data.map(this.mapToPostViewModel),
    };
  },
};

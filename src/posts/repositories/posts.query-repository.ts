import { ObjectId, WithId } from 'mongodb';
import { postCollection } from '../../db/collections';
import { Post } from '../domain/post';
import { PostQueryInput } from '../input/post-query.input';
import { PostViewModel } from '../types/postViewModel';
import { PaginatedViewModelOutput } from '../../core/types/paginated-view-model.output';
import { ResultStatus } from '../../core/result/resultCode';
import { Result } from '../../core/result/result.type';

export const postsQueryRepository = {
  async findById(id: string): Promise<Result<Post | null>> {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Wrong comment id' }],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: this.mapToPostViewModel(post),
      extensions: [],
    };
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
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      totalCount: meta.totalCount,
      items: data.map(this.mapToPostViewModel),
    };
  },
};

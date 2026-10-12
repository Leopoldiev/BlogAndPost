import { ObjectId, WithId } from 'mongodb';
import { commentCollection } from '../../db/collections';
import { PaginatedViewModelOutput } from '../../core/types/paginated-view-model.output';
import { CommentViewModel } from '../routes/output/comment.view-model';
import { ResultStatus } from '../../core/result/resultCode';
import { Result } from '../../core/result/result.type';
import { CommentQueryInput } from '../input/comment-query.input';
import { CommentDBModel } from '../types/commentDBModel';

export const commentsQueryRepository = {
  async findById(id: string): Promise<Result<CommentViewModel | null>> {
    const comment = await commentCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!comment) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Wrong comment id' }],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: this.mapToCommentViewModel(comment),
      extensions: [],
    };
  },

  async findManyByPostId(
    postId: string,
    queryDto: CommentQueryInput,
  ): Promise<{ items: WithId<CommentDBModel>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const items = await commentCollection
      .find({ postId: postId })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await commentCollection.countDocuments({
      postId: postId,
    });

    return { items, totalCount };
  },

  mapToCommentViewModel(comment: WithId<CommentDBModel>): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: { ...comment.commentatorInfo },
      createdAt: comment.createdAt,
    };
  },

  mapToCommentPaginatedOutput(
    data: WithId<CommentDBModel>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
  ): PaginatedViewModelOutput<CommentViewModel> {
    return {
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      totalCount: meta.totalCount,
      items: data.map(this.mapToCommentViewModel),
    };
  },
};

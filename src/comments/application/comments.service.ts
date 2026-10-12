import { Result } from '../../core/result/result.type';
import { ResultStatus } from '../../core/result/resultCode';
import { postsRepository } from '../../posts/repositories/posts.repository';
import { CommentCreateUpdateDto } from './dtos/comment-create-update.dto';
import { usersRepository } from '../../users/repositories/users.repository';
import { CommentDBModel } from '../types/commentDBModel';
import { commentsRepository } from '../repositories/comments.repository';
import { CommentViewModel } from '../types/commentViewModel';

export const commentsService = {

  async createCommentByPostId(
    postId: string,
    dto: CommentCreateUpdateDto,
    userId: string,
  ): Promise<Result<CommentViewModel | null>> {
    const post = await postsRepository.findById(postId);

    if (!post) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [
          {
            field: 'postId',
            message: 'Creating comment failed: post not found',
          },
        ],
        data: null,
      };
    }

    const user = await usersRepository.findById(userId);

    if (!user) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [
          {
            field: 'userId',
            message: 'Creating comment failed: user not found',
          },
        ],
        data: null,
      };
    }

    const createdDate = new Date();

    const newComment: CommentDBModel = {
      postId: postId,
      content: dto.content,
      commentatorInfo: {
        userId: user._id.toString(),
        userLogin: user.login,
      },
      createdAt: createdDate.toISOString(),
    };

    const createdCommentId = await commentsRepository.create(newComment);

    const comment = await commentsRepository.findById(createdCommentId);

    if (!comment) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [
          {
            field: 'id',
            message: 'Creating comment failed: comment not found',
          },
        ],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: commentsRepository.mapToCommentViewModel(comment),
      extensions: [],
    };
  },

  async update(
    id: string,
    dto: CommentCreateUpdateDto,
    userId: string,
  ): Promise<Result> {
    const comment = await commentsRepository.findById(id);

    if (!comment) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [
          {
            field: 'id',
            message: 'Updating comment failed: comment not found',
          },
        ],
        data: null,
      };
    }

    if (userId !== comment.commentatorInfo.userId) {
      return {
        status: ResultStatus.Forbidden_403,
        errorMessage: 'Forbidden',
        extensions: [
          {
            field: 'userId',
            message: 'Trying edit the comment that is not your own',
          },
        ],
        data: null,
      };
    }

    await commentsRepository.update(id, dto);

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },

  async delete(id: string, userId: string): Promise<Result> {
    const comment = await commentsRepository.findById(id);

    if (!comment) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [
          {
            field: 'id',
            message: 'Deleting comment failed: comment not found',
          },
        ],
        data: null,
      };
    }

    if (userId !== comment.commentatorInfo.userId) {
      return {
        status: ResultStatus.Forbidden_403,
        errorMessage: 'Forbidden',
        extensions: [
          {
            field: 'userId',
            message: 'Trying to delete the comment that is not your own',
          },
        ],
        data: null,
      };
    }

    const result = await commentsRepository.delete(id);

    if (result.deletedCount < 1) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [
          {
            field: 'id',
            message: 'Comment not found',
          },
        ],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },
};

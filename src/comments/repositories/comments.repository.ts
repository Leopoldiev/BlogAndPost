import { commentCollection, postCollection } from '../../db/collections';
import { CommentDBModel } from '../types/commentDBModel';
import { DeleteResult, ObjectId, UpdateResult, WithId } from 'mongodb';
import { CommentViewModel } from '../types/commentViewModel';
import { CommentCreateUpdateDto } from '../application/dtos/comment-create-update.dto';

export const commentsRepository = {
  async create(comment: CommentDBModel): Promise<string> {
    const insertResult = await commentCollection.insertOne(comment);
    return insertResult.insertedId.toString();
  },

  async findById(id: string): Promise<WithId<CommentDBModel> | null> {
    return await commentCollection.findOne({ _id: new ObjectId(id) });
  },

  async update(
    id: string,
    dto: CommentCreateUpdateDto,
  ): Promise<UpdateResult<CommentDBModel>> {
    return await commentCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: dto.content,
        },
      },
    );
  },

  async delete(id: string): Promise<DeleteResult> {
    return commentCollection.deleteOne({
      _id: new ObjectId(id),
    });
  },

  mapToCommentViewModel(comment: WithId<CommentDBModel>): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: { ...comment.commentatorInfo },
      createdAt: comment.createdAt,
    };
  },
};

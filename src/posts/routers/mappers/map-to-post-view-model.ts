import { WithId } from 'mongodb';
import { PostDBModel, PostViewModel } from '../../types/postViewModel';

export const mapToPostViewModel = (
  post: WithId<PostDBModel>,
): PostViewModel => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};

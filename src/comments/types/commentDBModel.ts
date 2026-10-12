export type CommentDBModel = {
  postId: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

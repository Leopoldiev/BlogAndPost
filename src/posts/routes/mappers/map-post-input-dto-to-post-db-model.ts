import { PostCreateUpdateDto } from '../../application/dtos/post-create-update.dto';

export const mapPostInputDtoToPostDbModel = (dto: PostCreateUpdateDto) => {
  return {
    title: dto.title,
    shortDescription: dto.shortDescription,
    content: dto.content,
    blogId: dto.blogId,
  };
};

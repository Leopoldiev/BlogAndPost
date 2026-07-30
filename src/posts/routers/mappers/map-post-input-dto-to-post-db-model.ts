import { PostInputDto } from '../../dto/post-input-dto';

export const mapPostInputDtoToPostDbModel = (dto: PostInputDto) => {
  return {
    title: dto.title,
    shortDescription: dto.shortDescription,
    content: dto.content,
    blogId: dto.blogId,
  };
};

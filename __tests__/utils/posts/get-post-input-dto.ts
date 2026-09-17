import { PostCreateUpdateDto } from '../../../src/posts/application/dtos/post-create-update.dto';

export function getPostInputDto(blogId: string): PostCreateUpdateDto {
  return {
    title: 'NodeJS',
    shortDescription: 'Express, MongoDB',
    content: 'Most popular...',
    blogId: blogId,
  };
}

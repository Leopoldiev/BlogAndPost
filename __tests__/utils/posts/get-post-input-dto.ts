import { PostInputDto } from '../../../src/posts/dto/post-input-dto';

export function getPostInputDto(blogId: string): PostInputDto {
  return {
    title: 'NodeJS',
    shortDescription: 'Express, MongoDB',
    content: 'Most popular...',
    blogId: blogId,
  };
}

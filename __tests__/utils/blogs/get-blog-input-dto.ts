import { BlogInputDto } from '../../../src/blogs/dto/blog-input-dto';

export function getBlogInputDto(): BlogInputDto {
  return {
    name: 'JS NodeJs',
    description: 'Learn coding',
    websiteUrl: 'https://reactjs.org/',
  };
}

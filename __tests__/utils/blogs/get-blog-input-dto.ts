import { BlogCreateUpdateDto } from '../../../src/blogs/application/dtos/blog-create-update.dto';

export function getBlogInputDto(): BlogCreateUpdateDto {
  return {
    name: 'JS NodeJs',
    description: 'Learn coding',
    websiteUrl: 'https://reactjs.org/',
  };
}

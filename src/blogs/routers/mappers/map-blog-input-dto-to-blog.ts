import { BlogInputDto } from '../../dto/blog-input-dto';
import { BlogViewModel } from '../../types/blogViewModel';

export const mapBlogInputDtoToBlog = (
  dto: BlogInputDto,
): Omit<BlogViewModel, 'id' | 'createdAt'> => {
  return {
    name: dto.name,
    description: dto.description,
    websiteUrl: dto.websiteUrl,
    isMembership: true,
  };
};

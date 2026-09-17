import { BlogViewModel } from '../output/blog.view-model';
import { BlogCreateUpdateDto } from '../../application/dtos/blog-create-update.dto';

export const mapBlogInputDtoToBlog = (
  dto: BlogCreateUpdateDto,
): Omit<BlogViewModel, 'id' | 'createdAt'> => {
  return {
    name: dto.name,
    description: dto.description,
    websiteUrl: dto.websiteUrl,
    isMembership: false,
  };
};

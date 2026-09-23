import { BlogCreateUpdateDto } from './dtos/blog-create-update.dto';
import { mapBlogInputDtoToBlog } from '../routes/mappers/map-blog-input-dto-to-blog';
import { blogsRepository } from '../repositories/blogs.repository';
import { Blog } from '../domain/blog';

export const blogsService = {
  async create(dto: BlogCreateUpdateDto): Promise<string> {
    const createdDate = new Date();

    const newBlog: Blog = {
      ...mapBlogInputDtoToBlog(dto),
      createdAt: createdDate.toISOString(),
    };
    return await blogsRepository.create(newBlog);
  },

  async update(id: string, dto: BlogCreateUpdateDto): Promise<void> {
    await blogsRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    await blogsRepository.delete(id);
    return;
  },
};

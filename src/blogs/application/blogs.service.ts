import { BlogCreateUpdateDto } from './dtos/blog-create-update.dto';
import { mapBlogInputDtoToBlog } from '../routes/mappers/map-blog-input-dto-to-blog';
import { blogsRepository } from '../repositories/blogs.repository';
import { Blog } from '../domain/blog';
import { ResultStatus } from '../../core/result/resultCode';
import { Result } from '../../core/result/result.type';

export const blogsService = {
  async create(dto: BlogCreateUpdateDto): Promise<Result<Blog | null>> {
    const createdDate = new Date();

    const newBlog: Blog = {
      ...mapBlogInputDtoToBlog(dto),
      createdAt: createdDate.toISOString(),
    };

    const blogId = await blogsRepository.create(newBlog);

    const blog = await blogsRepository.findById(blogId);

    if (!blog) {
      return {
        status: ResultStatus.BadRequest_400,
        errorMessage: 'Not Found',
        extensions: [
          { field: 'id', message: 'Creating blog failed: incorrect values' },
        ],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: blogsRepository.mapToBlogViewModel(blog),
      extensions: [],
    };
  },

  async update(id: string, dto: BlogCreateUpdateDto): Promise<Result> {
    const result = await blogsRepository.update(id, dto);

    if (result.matchedCount < 1) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [
          {
            field: 'id',
            message: 'Post not found',
          },
        ],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },

  async delete(id: string): Promise<Result> {
    const result = await blogsRepository.delete(id);

    if (result.deletedCount < 1) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [
          {
            field: 'id',
            message: 'Post not found',
          },
        ],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },
};

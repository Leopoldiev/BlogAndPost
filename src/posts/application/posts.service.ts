import { PostCreateUpdateDto } from './dtos/post-create-update.dto';
import { Post } from '../domain/post';
import { mapPostInputDtoToPostDbModel } from '../routes/mappers/map-post-input-dto-to-post-db-model';
import { postsRepository } from '../repositories/posts.repository';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { ResultStatus } from '../../core/result/resultCode';
import { Result } from '../../core/result/result.type';

export const postsService = {
  async create(dto: PostCreateUpdateDto): Promise<Result<Post | null>> {
    const blog = await blogsRepository.findById(dto.blogId);

    if (!blog) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Wrong blog id' }],
        data: null,
      };
    }

    const createdDate = new Date();

    const newPost: Post = {
      ...mapPostInputDtoToPostDbModel(dto),
      blogName: blog.name,
      createdAt: createdDate.toISOString(),
    };
    const postId = await postsRepository.create(newPost);

    const post = await postsRepository.findById(postId);

    if (!post) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Wrong post id' }],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: postsRepository.mapToPostViewModel(post),
      extensions: [],
    };
  },

  async update(id: string, dto: PostCreateUpdateDto): Promise<Result> {
    const result = await postsRepository.update(id, dto);

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
    const result = await postsRepository.delete(id);

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

  async createPostByBlogId(
    blogId: string,
    dto: Omit<PostCreateUpdateDto, 'blogId'>,
  ): Promise<Result<Post | null>> {
    const blog = await blogsRepository.findById(blogId);

    if (!blog) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [
          {
            field: 'blogId',
            message: 'Creating post failed: blog not found',
          },
        ],
        data: null,
      };
    }

    const createdDate = new Date();

    const newPost: Post = {
      ...mapPostInputDtoToPostDbModel({ ...dto, blogId }),
      blogName: blog.name,
      createdAt: createdDate.toISOString(),
    };

    const createdPostId = await postsRepository.create(newPost);
    const post = await postsRepository.findById(createdPostId);

    if (!post) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [
          {
            field: 'id',
            message: 'Creating post failed: post not found',
          },
        ],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: postsRepository.mapToPostViewModel(post),
      extensions: [],
    };
  },
};

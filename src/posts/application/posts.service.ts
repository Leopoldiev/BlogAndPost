import { PostCreateUpdateDto } from './dtos/post-create-update.dto';
import { Post } from '../domain/post';
import { mapPostInputDtoToPostDbModel } from '../routes/mappers/map-post-input-dto-to-post-db-model';
import { postsRepository } from '../repositories/posts-repository';
import { blogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';
import { WithId } from 'mongodb';
import { Blog } from '../../blogs/domain/blog';
import { PostViewModel } from '../types/postViewModel';
import { blogsRepository } from '../../blogs/repositories/blogs-repository';

export const postsService = {
  async create(dto: PostCreateUpdateDto): Promise<string> {
    const blog: WithId<Blog> = await blogsQueryRepository.findByIdOrFail(
      dto.blogId,
    );

    const createdDate = new Date();

    const newPost: Post = {
      ...mapPostInputDtoToPostDbModel(dto),
      blogName: blog.name,
      createdAt: createdDate.toISOString(),
    };
    return await postsRepository.create(newPost);
  },

  async update(id: string, dto: PostCreateUpdateDto): Promise<void> {
    await blogsQueryRepository.findByIdOrFail(dto.blogId);

    await postsRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    await postsRepository.delete(id);
    return;
  },

  async createPostByBlogId(
    blogId: string,
    dto: Omit<PostCreateUpdateDto, 'blogId'>,
  ): Promise<PostViewModel> {
    const blog: WithId<Blog> = await blogsRepository.findByIdOrFail(blogId);

    const createdDate = new Date();

    const newPost: Post = {
      ...mapPostInputDtoToPostDbModel({ ...dto, blogId }),
      blogName: blog.name,
      createdAt: createdDate.toISOString(),
    };
    const createdPostId = await postsRepository.create(newPost);
    const createdPost = await postsRepository.findByIdOrFail(createdPostId);

    return postsRepository.mapToPostViewModel(createdPost);
  },
};

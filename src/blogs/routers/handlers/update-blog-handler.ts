import { Request, Response } from 'express';
import { BlogInputDto } from '../../dto/blog-input-dto';
import { blogsRepository } from '../../repositories/blogs-repository';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CreateErrorMessage } from '../../../core/utils/error-utils';
import { Blog } from '../../types/blog';

export const updateBlogHandler = (
  req: Request<{ id: string }, {}, BlogInputDto>,
  res: Response,
) => {
  const blog = blogsRepository.findById(req.params.id);

  if (blog) {
    const updatedBlog: Blog = {
      id: blog.id,
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    };

    blogsRepository.update(updatedBlog);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  }

  res
    .status(HTTP_STATUSES.NOT_FOUND_404)
    .send(CreateErrorMessage([{ field: 'id', message: 'Blog not found' }]));
};

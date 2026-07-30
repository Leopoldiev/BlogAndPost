import { WithId } from 'mongodb';
import { BlogViewModel, BlogDBModel } from '../../types/blogViewModel';

export const mapToBlogViewModel = (
  blog: WithId<BlogDBModel>,
): BlogViewModel => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};

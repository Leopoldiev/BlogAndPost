import { db } from '../../db/in-memory-db';
import { Blog } from '../types/blog';
import { BlogInputDto } from '../dto/blog-input-dto';

export const blogsRepository = {
  findAll(): Blog[] {
    return db.blogs;
  },

  findById(id: string): Blog | null {
    return db.blogs.find((blog) => blog.id === id) ?? null;
  },

  create(blog: BlogInputDto) {
    const lastBlog = db.blogs[db.blogs.length - 1];

    const newBlog: Blog = {
      ...blog,
      id: lastBlog ? String(Number(lastBlog.id) + 1) : '1',
    };

    db.blogs.push(newBlog);
    return newBlog;
  },

  update(updatedBlog: Blog) {
    const blogIndex = db.blogs.findIndex((blog) => blog.id === updatedBlog.id);
    db.blogs[blogIndex] = updatedBlog;
    return;
  },

  delete(id: string) {
    const blogIndex = db.blogs.findIndex((blog) => blog.id === id);
    if (blogIndex !== -1) {
      db.blogs.splice(blogIndex, 1);
      return true;
    }
    return false;
  },
};

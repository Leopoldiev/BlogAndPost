import { db } from '../../db/in-memory-db';
import { Post } from '../types/post';
import { PostInputDto } from '../dto/post-input-dto';

export const postsRepository = {
  findAll() {
    return db.posts;
  },

  findById(id: string): Post | null {
    return db.posts.find((post) => post.id === id) ?? null;
  },

  create(post: PostInputDto) {
    const lastPost = db.posts[db.posts.length - 1];
    const blogIndex = db.blogs.findIndex((blog) => blog.id === post.blogId);

    const newPost: Post = {
      id: lastPost ? String(Number(lastPost.id) + 1) : '1',
      ...post,
      blogName: db.blogs[blogIndex].name,
    };

    db.posts.push(newPost);
    return newPost;
  },

  update(id: string, post: PostInputDto) {
    const postIndex = db.posts.findIndex((post) => post.id === id);
    const blog = db.blogs.find((blog) => blog.id === post.blogId);

    if (blog) {
      const updatedPost: Post = {
        id,
        ...post,
        blogName: blog.name,
      };

      db.posts[postIndex] = updatedPost;
    }
    return;
  },

  delete(id: string) {
    const postIndex = db.posts.findIndex((post) => post.id === id);
    if (postIndex !== -1) {
      db.posts.splice(postIndex, 1);
      return true;
    }
    return false;
  },
};

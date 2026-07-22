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
    console.log(blogIndex);
    const newPost: Post = {
      id: lastPost ? String(Number(lastPost.id) + 1) : '1',
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: db.blogs[blogIndex].name,
    };

    db.posts.push(newPost);
    console.log(db.posts);
    return newPost;
  },

  update(id: string, post: PostInputDto) {
    const postIndex = db.posts.findIndex((post) => post.id === id);
    if (postIndex !== -1) {
      const updatedPost: Post = {
        id: db.posts[postIndex].id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: db.posts[postIndex].blogName,
      };
      db.posts.splice(postIndex, 1, updatedPost);
      return true;
    }
    return false;
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

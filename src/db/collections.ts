import { Collection, Db } from 'mongodb';
import { Blog } from '../blogs/domain/blog';
import { Post } from '../posts/domain/post';
import { User } from '../users/domain/user';

export const BLOG_COLLECTION_NAME = 'blogs';
export const POST_COLLECTION_NAME = 'posts';
export const USERS_COLLECTION_NAME = 'users';

// Коллекции инициализируются один раз в initCollections() после подключения к БД.
// До этого момента они undefined, поэтому обращаться к ним можно только после runDB().
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;

// Создаём объекты коллекций из подключённой базы.
export function initCollections(db: Db): void {
  blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<Post>(POST_COLLECTION_NAME);
  userCollection = db.collection<User>(USERS_COLLECTION_NAME);
}

// Список всех коллекций считаем в МОМЕНТ вызова (уже после initCollections),
// а не на этапе загрузки модуля — иначе сюда попали бы ещё не инициализированные (undefined) коллекции.
export function getAllCollections(): Collection<any>[] {
  return [blogCollection, postCollection, userCollection];
}

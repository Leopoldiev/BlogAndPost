import { Collection, Db } from 'mongodb';
import { BlogDBModel } from '../blogs/types/blogViewModel';
import { PostDBModel } from '../posts/types/postViewModel';

export const BLOG_COLLECTION_NAME = 'blogs';
export const POST_COLLECTION_NAME = 'posts';

// Коллекции инициализируются один раз в initCollections() после подключения к БД.
// До этого момента они undefined, поэтому обращаться к ним можно только после runDB().
export let blogCollection: Collection<BlogDBModel>;
export let postCollection: Collection<PostDBModel>;

// Создаём объекты коллекций из подключённой базы.
export function initCollections(db: Db): void {
  blogCollection = db.collection<BlogDBModel>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<PostDBModel>(POST_COLLECTION_NAME);
}

// Список всех коллекций считаем в МОМЕНТ вызова (уже после initCollections),
// а не на этапе загрузки модуля — иначе сюда попали бы ещё не инициализированные (undefined) коллекции.
export function getAllCollections(): Collection<any>[] {
  return [blogCollection, postCollection];
}

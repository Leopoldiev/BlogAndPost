import { ObjectId, WithId } from 'mongodb';
import { Blog } from '../domain/blog';
import { blogCollection } from '../../db/collections';
import { NotFoundException } from '../../core/exceptions/not-found.exception';
import { BlogQueryInput } from '../routes/input/blog-query.input';
import { BlogViewModel } from '../routes/output/blog.view-model';
import { PaginatedViewModelOutput } from '../../core/types/paginated-view-model.output';

export const blogsQueryRepository = {
  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    return blog;
  },

  async findMany(
    queryDto: BlogQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const items = await blogCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);

    return { items, totalCount };
  },

  mapToBlogViewModel(blog: WithId<Blog>): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  },

  mapToBlogPaginatedOutput(
    data: WithId<Blog>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
  ): PaginatedViewModelOutput<BlogViewModel> {
    return {
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      totalCount: meta.totalCount,
      items: data.map(this.mapToBlogViewModel),
    };
  },
};

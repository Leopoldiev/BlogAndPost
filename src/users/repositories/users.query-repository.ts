import { ObjectId, WithId } from 'mongodb';
import { userCollection } from '../../db/collections';
import { UserQueryInput } from '../routes/input/user-query.input';
import { User } from '../domain/user';
import { PaginatedViewModelOutput } from '../../core/types/paginated-view-model.output';
import { UserViewModel } from '../routes/output/user.view-model';
import { NotFoundException } from '../../core/exceptions/not-found.exception';

export const usersQueryRepository = {
  async findByIdOrFail(id: string): Promise<WithId<User>> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  },

  async findMany(
    queryDto: UserQueryInput,
  ): Promise<{ items: WithId<User>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    const searchConditions = [];

    if (searchLoginTerm) {
      searchConditions.push({
        login: { $regex: searchLoginTerm, $options: 'i' },
      });
    }

    if (searchEmailTerm) {
      searchConditions.push({
        email: { $regex: searchEmailTerm, $options: 'i' },
      });
    }

    if (searchConditions.length > 0) {
      filter.$or = searchConditions;
    }

    const items = await userCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await userCollection.countDocuments(filter);

    return { items, totalCount };
  },
  mapToUserViewModel(user: WithId<User>): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  },

  mapToUserPaginatedOutput(
    data: WithId<User>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
  ): PaginatedViewModelOutput<UserViewModel> {
    return {
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      totalCount: meta.totalCount,
      items: data.map(this.mapToUserViewModel),
    };
  },
};

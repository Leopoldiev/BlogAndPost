import { Response } from 'express';
import { PaginatedViewModelOutput } from '../../../core/types/paginated-view-model.output';
import { UserViewModel } from '../output/user.view-model';
import { UserQueryInput } from '../input/user-query.input';
import { usersQueryRepository } from '../../repositories/users.query-repository';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { RequestWithQuery } from '../../../core/types/requests';

export const getUserListHandler = async (
  req: RequestWithQuery<UserQueryInput>,
  res: Response<PaginatedViewModelOutput<UserViewModel>>,
) => {
  try {
    const queryInput = req.query;

    const { items, totalCount } =
      await usersQueryRepository.findMany(queryInput);

    const userList = usersQueryRepository.mapToUserPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.status(HTTP_STATUSES.OK_200).send(userList);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};

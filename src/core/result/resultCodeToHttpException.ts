import { ResultStatus } from './resultCode';
import { HTTP_STATUSES } from '../types/http-statuses';

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
  switch (resultCode) {
    case ResultStatus.BadRequest_400:
      return HTTP_STATUSES.BAD_REQUEST_400;
    case ResultStatus.Unauthorized_401:
      return HTTP_STATUSES.UNAUTHORIZED_401;
    case ResultStatus.Forbidden_403:
      return HTTP_STATUSES.FORBIDDEN_403;
    case ResultStatus.NotFound_404:
      return HTTP_STATUSES.NOT_FOUND_404;
    case ResultStatus.Conflict_409:
      return HTTP_STATUSES.CONFLICT_409;
    default:
      return HTTP_STATUSES.INTERNAL_SERVER_ERROR_500;
  }
};

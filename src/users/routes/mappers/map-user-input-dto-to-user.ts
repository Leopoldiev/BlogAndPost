import { UserCreateDto } from '../../application/dtos/user-create.dto';
import { User } from '../../domain/user';

export const mapUserInputDtoToUser = (
  dto: UserCreateDto,
): Omit<User, 'createdAt'> => {
  return {
    login: dto.login,
    password: dto.password,
    email: dto.email,
  };
};

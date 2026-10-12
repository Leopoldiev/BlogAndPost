import { UserCreateDto } from '../../application/dtos/user-create.dto';

export const mapUserInputDtoToUser = (dto: UserCreateDto): UserCreateDto => {
  return {
    login: dto.login,
    password: dto.password,
    email: dto.email,
  };
};

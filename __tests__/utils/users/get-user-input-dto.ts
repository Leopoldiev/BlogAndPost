import { UserCreateDto } from '../../../src/users/application/dtos/user-create.dto';

export function getUserInputDto(): UserCreateDto {
  return {
    login: 'Leopold',
    password: '1234567',
    email: 'leoflame777@hotmail.com',
  };
}

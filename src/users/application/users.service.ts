import { UserCreateDto } from './dtos/user-create.dto';
import { User } from '../domain/user';
import { usersRepository } from '../repositories/users.repository';
import { bcryptService } from '../../auth/application/bcrypt.service';
import { ResultStatus } from '../../core/result/resultCode';
import { Result } from '../../core/result/result.type';
import { UserViewModel } from '../routes/output/user.view-model';

export const usersService = {
  async create(dto: UserCreateDto): Promise<Result<UserViewModel | null>> {
    const { login, password, email } = dto;
    const userExists = await usersRepository.findByLoginOrEmail({
      login: login,
      email: email,
    });

    if (userExists) {
      return {
        status: ResultStatus.Conflict_409,
        errorMessage: 'Login or email already in use',
        extensions: [
          { field: 'login or email', message: 'Login or email already in use' },
        ],
        data: null,
      };
    }

    const createdDate = new Date();
    const passwordHash = await bcryptService.generateHash(password);

    const newUser: User = {
      login,
      email,
      passwordHash: passwordHash,
      createdAt: createdDate,
      emailConfirmation: {
        confirmationCode: '',
        isConfirmed: true,
        expirationDate: new Date(),
      },
    };

    const userId = await usersRepository.create(newUser);
    const user = await usersRepository.findById(userId);

    if (!user) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Wrong user id' }],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: usersRepository.mapToUserViewModel(user),
      extensions: [],
    };
  },

  async delete(id: string): Promise<Result> {
    const result = await usersRepository.delete(id);
    if (result.deletedCount < 1) {
      return {
        status: ResultStatus.NotFound_404,
        errorMessage: 'Not Found',
        extensions: [
          {
            field: 'id',
            message: 'User not found',
          },
        ],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },
};

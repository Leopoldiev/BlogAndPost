import { UserCreateDto } from './dtos/user-create.dto';
import { User } from '../domain/user';
import { mapUserInputDtoToUser } from '../routes/mappers/map-user-input-dto-to-user';
import { usersRepository } from '../repositories/users.repository';
import { bcryptService } from '../../auth/application/bcrypt.service';
import { LoginOrEmailAlreadyExistException } from '../../core/exceptions/login-or-email-already-exist.exception';

export const usersService = {
  async create(dto: UserCreateDto): Promise<string> {
    const userExisist = await usersRepository.findByLoginOrEmail({
      login: dto.login,
      email: dto.email,
    });
    if (userExisist) {
      throw new LoginOrEmailAlreadyExistException(
        'Login or email should be unique',
      );
    }

    const createdDate = new Date();
    const passwordHash = await bcryptService.generateHash(dto.password);

    const newUser: User = {
      ...mapUserInputDtoToUser(dto),
      password: passwordHash,
      createdAt: createdDate.toISOString(),
    };

    return await usersRepository.create(newUser);
  },

  async delete(id: string): Promise<void> {
    await usersRepository.delete(id);
    return;
  },
};

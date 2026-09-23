import { usersRepository } from '../../users/repositories/users.repository';
import { UserLoginDto } from './dtos/user-login.dto';
import { UserCredentialsIsWrong } from '../../core/exceptions/user-credentials-is-wrong';
import { bcryptService } from './bcrypt.service';

export const authUserService = {
  async login(dto: UserLoginDto): Promise<void> {
    const isCorrectCredentials = await this.checkUserCredentials(
      dto.loginOrEmail,
      dto.password,
    );

    if (!isCorrectCredentials) {
      throw new UserCredentialsIsWrong();
    }

    return;
  },

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<boolean> {
    const user = await usersRepository.findByLoginOrEmail({
      login: loginOrEmail,
      email: loginOrEmail,
    });
    if (!user) return false;

    return bcryptService.checkPassword(password, user.password);
  },
};

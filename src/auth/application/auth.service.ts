import { usersRepository } from '../../users/repositories/users.repository';
import { UserLoginDto } from './dtos/user-login.dto';
import { bcryptService } from './bcrypt.service';
import { Result } from '../../core/result/result.type';
import { WithId } from 'mongodb';
import { User } from '../../users/domain/user';
import { ResultStatus } from '../../core/result/resultCode';
import { jwtService } from './jwt.service';

export const authUserService = {
  async login(
    dto: UserLoginDto,
  ): Promise<Result<{ accessToken: string } | null>> {
    const result = await this.checkUserCredentials(
      dto.loginOrEmail,
      dto.password,
    );

    if (result.status !== ResultStatus.Success)
      return {
        status: ResultStatus.Unauthorized_401,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
        data: null,
      };

    const accessToken = await jwtService.createToken(
      result.data!._id.toString(),
    );

    return {
      status: ResultStatus.Success,
      data: { accessToken },
      extensions: [],
    };
  },

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<WithId<User> | null>> {
    const user = await usersRepository.findByLoginOrEmail({
      login: loginOrEmail,
      email: loginOrEmail,
    });

    if (!user)
      return {
        status: ResultStatus.NotFound_404,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
      };

    const isPassCorrect = await bcryptService.checkPassword(
      password,
      user.passwordHash,
    );
    if (!isPassCorrect)
      return {
        status: ResultStatus.BadRequest_400,
        data: null,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'password', message: 'Wrong password' }],
      };

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  },
};

import { usersRepository } from '../../users/repositories/users.repository';
import { UserLoginDto } from './dtos/user-login.dto';
import { bcryptService } from './bcrypt.service';
import { Result } from '../../core/result/result.type';
import { WithId } from 'mongodb';
import { User } from '../../users/domain/user';
import { ResultStatus } from '../../core/result/resultCode';
import { jwtService } from './jwt.service';
import { nodemailerService } from './nodemailer.service';
import { emailExamples } from './emailExamples';
import { UserRegistrationDto } from './dtos/user-registration.dto';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

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
  async registration(dto: UserRegistrationDto): Promise<Result> {
    const { login, email, password } = dto;
    const user = await usersRepository.doesExistByLoginOrEmail(login, email);
    if (user)
      return {
        status: ResultStatus.BadRequest_400,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [{ field: 'loginOrEmail', message: 'Already Registered' }],
      };

    const passwordHash = await bcryptService.generateHash(password);

    const newUser = new User(login, email, passwordHash);

    await usersRepository.create(newUser);

    nodemailerService
      .sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailExamples.registrationEmail,
      )
      .catch((err) => console.error('error in send email:', err));
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },

  async registrationConfirmation(code: string): Promise<Result> {
    const user = await usersRepository.findByCode(code);

    if (
      !user ||
      user.emailConfirmation.confirmationCode !== code ||
      user.emailConfirmation.expirationDate < new Date() ||
      user.emailConfirmation.isConfirmed
    ) {
      return {
        status: ResultStatus.BadRequest_400,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          {
            field: 'confirmationCode',
            message: 'confirmationCode is incorrect',
          },
        ],
      };
    }

    await usersRepository.updateConfirmationCodeStatus(user._id);

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },

  async registrationEmailResending(email: string): Promise<Result> {
    const user = await usersRepository.findByLoginOrEmail({ email: email });

    if (!user || user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest_400,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          {
            field: 'emailConfirmation',
            message: 'emailConfirmation failed',
          },
        ],
      };
    }

    const newCode = randomUUID();
    const newExpDate = add(new Date(), { hours: 1, minutes: 30 });

    const isUpdated = await usersRepository.updateConfirmationCode(
      user._id,
      newCode,
      newExpDate,
    );

    if (!isUpdated) {
      console.error('error in resend email:');
    }

    nodemailerService
      .sendEmail(email, newCode, emailExamples.registrationEmail)
      .catch((err) => console.error('error in send email:', err));

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },
};

import { appConfig } from '../../core/config/config';
import nodemailer from 'nodemailer';

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<boolean> {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: appConfig.EMAIL,
        pass: appConfig.EMAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: '"Leo 👻" <leoflamefire777@gmail.com>',
      to: email,
      subject: 'Your code is here',
      html: template(code),
    });

    return !!info;
  },
};

import jwt from 'jsonwebtoken';
import { appConfig } from '../../core/config/config';

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, appConfig.ACCESS_TOKEN_SECRET, {
      expiresIn: appConfig.ACCESS_TOKEN_EXP_TIME,
    });
  },

  async decodeToken(token: string): Promise<any> {
    try {
      return jwt.decode(token);
    } catch (e: unknown) {
      console.error("Can't decode token", e);
      return null;
    }
  },

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, appConfig.ACCESS_TOKEN_SECRET) as {
        userId: string;
      };
    } catch (error) {
      console.error('Token verify some error');
      return null;
    }
  },
};

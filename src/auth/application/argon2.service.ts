import argon2 from 'argon2';

export const argon2Service = {
  async generateHash(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
    });
  },

  async checkPassword(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  },
};

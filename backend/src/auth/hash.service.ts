import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/* The HashService class in TypeScript provides methods for hashing passwords and comparing hashed
passwords using bcrypt. */
@Injectable()
export class HashService {
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

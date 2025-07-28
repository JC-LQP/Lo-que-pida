import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

/**
 * The `findAll` function returns a promise that resolves to an array of User objects fetched from the
 * user repository.
 * @returns A Promise that resolves to an array of User objects.
 */
  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

/**
 * The function findByEmail asynchronously retrieves a user based on their email address.
 * @param {string} email - The `findByEmail` function is an asynchronous function that takes an `email`
 * parameter of type string. It returns a Promise that resolves to either a `User` object or `null`.
 * The function queries the `userRepo` to find a user with the specified email address.
 * @returns The `findByEmail` method is returning a Promise that resolves to either a `User` object if
 * a user with the specified email is found in the database, or `null` if no user is found.
 */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

/**
 * The function creates a new user after checking for existing users with the same email and hashing
 * the password.
 * @param {CreateUserInput} input - The `create` function you provided is an asynchronous function that
 * creates a new user in your system. It first checks if a user with the same email already exists in
 * the database. If a user with the same email is found, it throws a `ConflictException`. If no user
 * with the same email
 * @returns The `create` method is returning a Promise that resolves to a `User` object after creating
 * a new user in the database.
 */
  async create(input: CreateUserInput): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email: input.email } });

    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = this.userRepo.create({
      ...input,
      passwordHash,
      isVerified: false,
    });

    return this.userRepo.save(user);
  }

/**
 * This TypeScript function asynchronously deletes a user by their ID and returns a boolean indicating
 * if the deletion was successful.
 * @param {string} id - The `id` parameter in the `deleteUser` function is a string representing the
 * unique identifier of the user that needs to be deleted from the database.
 * @returns The `deleteUser` function returns a Promise that resolves to a boolean value. The boolean
 * value indicates whether the deletion operation was successful or not.
 */
  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

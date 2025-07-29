import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserInput } from '../users/dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  /**
   * Crea un usuario si no existe, usando información desde Firebase.
   */
  async validateOrCreateUser(firebaseUser: any): Promise<User> {
    const firebaseUid = firebaseUser.uid;
    const email = firebaseUser.email;

    let user = await this.usersService.findByFirebaseUid(firebaseUid);

    if (!user) {
      const createUserInput: CreateUserInput = {
        firebaseUid,
        email,
        fullName: '',
      };
      user = await this.usersService.create(createUserInput);
    }

    return user;
  }
}

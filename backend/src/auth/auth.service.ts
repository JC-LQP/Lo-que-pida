import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { LoginResponse } from './dto/login-response';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserInput } from '../users/dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async firebaseLogin(email: string, password: string): Promise<LoginResponse> {
    const apiKey = this.configService.get<string>('FIREBASE_API_KEY');
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    try {
      const response = await firstValueFrom(
        this.httpService.post<{
          idToken: string;
          refreshToken: string;
          expiresIn: string;
        }>(url, {
          email,
          password,
          returnSecureToken: true,
        }),
      );

      const { idToken, refreshToken, expiresIn } = response.data;

      return {
        accessToken: idToken,
        refreshToken,
        expiresIn: parseInt(expiresIn),
      };
    } catch (error) {
      throw new UnauthorizedException('Correo o contraseña inválidos');
    }
  }

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

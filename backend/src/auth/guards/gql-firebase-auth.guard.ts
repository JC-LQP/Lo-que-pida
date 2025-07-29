import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as admin from 'firebase-admin';

@Injectable()
export class GqlFirebaseAuthGuard implements CanActivate {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseApp: admin.app.App,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const authHeader = ctx.req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autorización no proporcionado');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decodedToken = await this.firebaseApp.auth().verifyIdToken(token);
      ctx.user = decodedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token Firebase inválido o expirado');
    }
  }
}

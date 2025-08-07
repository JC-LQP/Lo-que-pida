import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FirebaseUser } from '../firebase-auth.service';

export const CurrentUser = createParamDecorator(
  (data: keyof FirebaseUser | undefined, ctx: ExecutionContext): FirebaseUser | any => {
    const request = ctx.switchToHttp().getRequest();
    const user: FirebaseUser = request.user;

    return data ? user?.[data] : user;
  },
);

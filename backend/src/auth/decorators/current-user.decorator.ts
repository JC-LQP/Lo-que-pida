import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): DecodedIdToken => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.user;
  },
);

import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  email: string;
}

export const UserId = createParamDecorator((_data: unknown, ctx: ExecutionContext): number => {
  const request = ctx.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
  if (!request.user) throw new UnauthorizedException();
  return request.user.sub;
});

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from 'src/decorators/user-role.decorator';
import { UserRoles } from 'src/enums/user-roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission for this action',
      );
    }
    return requiredRoles.some((role) => user?.role.include(role));
  }
}

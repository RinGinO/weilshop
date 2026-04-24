import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// TODO: Decorator @Roles()
// - проверка роли администратора
export const Roles = (..._roles: string[]) => SetMetadata(ROLES_KEY, _roles);

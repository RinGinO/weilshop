import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  // TODO: реализация проверки JWT
  canActivate(context: ExecutionContext): boolean {
    return true; // Заглушка
  }
}

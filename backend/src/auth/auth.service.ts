import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto/auth.dto';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Регистрация нового пользователя
   */
  async register(dto: RegisterDto) {
    // Проверка: email или телефон должны быть указаны
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Требуется email или номер телефона');
    }

    // Проверка существующего пользователя
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          dto.email ? { email: dto.email } : undefined,
          dto.phone ? { phone: dto.phone } : undefined,
        ].filter(Boolean),
      },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email или телефоном уже существует');
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Создание пользователя
    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        isEmailVerified: false,
        isPhoneVerified: !dto.phone, // Если телефон не указан, считаем верифицированным
        status: 'PENDING',
      },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: true,
      },
    });

    // Генерация токенов
    const tokens = await this.generateTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  /**
   * Вход пользователя
   */
  async login(dto: LoginDto) {
    // Поиск пользователя по email или телефону
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.login }, { phone: dto.login }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    // Проверка статуса пользователя
    if (user.status === 'BLOCKED') {
      throw new UnauthorizedException('Аккаунт заблокирован');
    }

    // Генерация токенов
    const tokens = await this.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      },
      ...tokens,
    };
  }

  /**
   * Обновление токенов
   */
  async refreshToken(userId: string) {
    const tokens = await this.generateTokens(userId);
    return tokens;
  }

  /**
   * Запрос восстановления пароля
   */
  async forgotPassword(_email: string) {
    // TODO: Генерация токена сброса и отправка email
    // const user = await this.prisma.user.findUnique({ where: { email: _email }});
    // const resetToken = await this.generateResetToken(user.id);
    // await this.sendResetEmail(email, resetToken);

    return { success: true };
  }

  /**
   * Сброс пароля по токену
   */
  async resetPassword(_dto: ResetPasswordDto) {
    // TODO: Валидация токена и сброс пароля
    // const userId = await this.validateResetToken(_dto.token);
    // const passwordHash = await bcrypt.hash(_dto.password, 12);
    // await this.prisma.user.update({
    //   where: { id: userId },
    //   data: { passwordHash },
    // });

    return { success: true };
  }

  /**
   * Подтверждение email
   */
  async confirmEmail(_token: string) {
    // TODO: Валидация токена и подтверждение email
    // const userId = await this.validateEmailToken(_token);
    // await this.prisma.user.update({
    //   where: { id: userId },
    //   data: { isEmailVerified: true },
    // });

    return { success: true };
  }

  /**
   * Генерация пары токенов (access + refresh)
   */
  private async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/profile.dto';
import { AddViewDto, ViewsQueryDto } from './dto/views.dto';
import {
  UpdateNotificationPreferencesDto,
  NotificationQueryDto,
  MarkAsReadDto,
} from './dto/notifications.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  // ==================== PROFILE ====================

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.email) {
      const existing = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
          NOT: { id: userId },
        },
      });

      if (existing) {
        throw new ConflictException('Email уже занят');
      }
    }

    if (dto.phone) {
      const existing = await this.prisma.user.findFirst({
        where: {
          phone: dto.phone,
          NOT: { id: userId },
        },
      });

      if (existing) {
        throw new ConflictException('Телефон уже занят');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        isEmailVerified: dto.email ? false : undefined,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isEmailVerified: true,
        isPhoneVerified: true,
      },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new BadRequestException('Неверный текущий пароль');
    }

    const newPasswordHash = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return { success: true };
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { success: true };
  }

  // ==================== VIEWS ====================

  async addView(userId: string, dto: AddViewDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingView = await this.prisma.productView.findFirst({
      where: {
        userId,
        productId: dto.productId,
        viewedAt: { gte: today },
      },
    });

    if (existingView) {
      return this.prisma.productView.updateMany({
        where: { userId, productId: dto.productId },
        data: { viewedAt: new Date() },
      });
    }

    return this.prisma.productView.create({
      data: {
        userId,
        productId: dto.productId,
      },
      include: {
        product: { include: { brand: true, category: true } },
      },
    });
  }

  async getViews(userId: string, query: ViewsQueryDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [views, total] = await Promise.all([
      this.prisma.productView.findMany({
        where: { userId },
        include: {
          product: { include: { brand: true, category: true } },
        },
        orderBy: { viewedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.productView.count({ where: { userId } }),
    ]);

    return { page, limit, total, items: views.map((v) => v.product) };
  }

  async clearViews(userId: string) {
    await this.prisma.productView.deleteMany({ where: { userId } });
    return { success: true };
  }

  // ==================== NOTIFICATIONS ====================

  async getNotifications(userId: string, query: NotificationQueryDto) {
    const { filter = 'all', page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId };

    if (filter === 'unread') where.readAt = null;
    else if (filter === 'read') where.readAt = { not: null };

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        include: {
          requestOrder: { select: { id: true, status: true } },
          consultationRequest: { select: { id: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    const unreadCount = await this.prisma.notification.count({
      where: { userId, readAt: null },
    });

    return { page, limit, total, unreadCount, items: notifications };
  }

  async markNotificationAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Уведомление не найдено');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этому уведомлению');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });

    return { success: true };
  }

  async getNotificationPreferences(userId: string) {
    const preferences = await this.prisma.notificationPreference.findMany({
      where: { userId },
      orderBy: [{ type: 'asc' }, { channel: 'asc' }],
    });

    return preferences;
  }

  async updateNotificationPreferences(userId: string, dto: UpdateNotificationPreferencesDto) {
    return this.prisma.notificationPreference.upsert({
      where: {
        userId_type_channel: {
          userId,
          type: dto.type,
          channel: dto.channel,
        },
      },
      update: { isEnabled: dto.isEnabled },
      create: {
        userId,
        type: dto.type,
        channel: dto.channel,
        isEnabled: dto.isEnabled,
      },
    });
  }
}

// TODO: AccountController
// GET /api/account/profile
// PATCH /api/account/profile
// PATCH /api/account/password
export class AccountController {}

// TODO: ViewsController
// GET /api/account/views
// POST /api/account/views
export class ViewsController {}

// TODO: NotificationsController
// GET /api/account/notifications
// PATCH /api/account/notifications/:id/read
// GET /api/account/notification-preferences
// PATCH /api/account/notification-preferences
export class NotificationsController {}

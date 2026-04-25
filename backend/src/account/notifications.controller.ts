import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AccountService } from './account.service';
import {
  UpdateNotificationPreferencesDto,
  NotificationQueryDto,
  MarkAsReadDto,
} from './dto/notifications.dto';

@Controller('account/notifications')
export class NotificationsController {
  constructor(private accountService: AccountService) {}

  @Get()
  async getNotifications(@Request() req: any, @Query() query: NotificationQueryDto) {
    const userId = req.user?.userId;
    if (!userId) {
      return { page: 1, limit: 20, total: 0, unreadCount: 0, items: [] };
    }
    return this.accountService.getNotifications(userId, query);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }
    return this.accountService.markNotificationAsRead(userId, id);
  }

  @Post('mark-all-read')
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@Request() req: any) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }
    return this.accountService.markAllAsRead(userId);
  }

  @Get('preferences')
  async getPreferences(@Request() req: any) {
    const userId = req.user?.userId;
    if (!userId) {
      return [];
    }
    return this.accountService.getNotificationPreferences(userId);
  }

  @Patch('preferences')
  @HttpCode(HttpStatus.OK)
  async updatePreferences(@Request() req: any, @Body() dto: UpdateNotificationPreferencesDto) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }
    return this.accountService.updateNotificationPreferences(userId, dto);
  }
}

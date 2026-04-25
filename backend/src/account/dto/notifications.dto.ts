import { IsEnum, IsBoolean, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType, NotificationChannel } from '@prisma/client';

export class UpdateNotificationPreferencesDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsBoolean()
  isEnabled: boolean;
}

export class NotificationQueryDto {
  @IsEnum(['all', 'unread', 'read'])
  @IsOptional()
  filter?: string = 'all';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}

export class MarkAsReadDto {
  @IsBoolean()
  @IsOptional()
  all?: boolean = false;
}

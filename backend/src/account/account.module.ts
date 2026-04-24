import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { ViewsService } from './views.service';
import { ViewsController } from './views.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
  controllers: [AccountController, ViewsController, NotificationsController],
  providers: [AccountService, ViewsService, NotificationsService],
  exports: [AccountService, ViewsService, NotificationsService],
})
export class AccountModule {}

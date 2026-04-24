import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { AdminRequestsService } from './admin-requests.service';
import { AdminRequestsController } from './admin-requests.controller';
import { AdminConsultationsService } from './admin-consultations.service';
import { AdminConsultationsController } from './admin-consultations.controller';
import { AdminCatalogService } from './admin-catalog.service';
import { AdminCatalogController } from './admin-catalog.controller';
import { AdminContentService } from './admin-content.service';
import { AdminContentController } from './admin-content.controller';

@Module({
  controllers: [
    AdminAuthController,
    AdminsController,
    AdminRequestsController,
    AdminConsultationsController,
    AdminCatalogController,
    AdminContentController,
  ],
  providers: [
    AdminAuthService,
    AdminsService,
    AdminRequestsService,
    AdminConsultationsService,
    AdminCatalogService,
    AdminContentService,
  ],
  exports: [
    AdminAuthService,
    AdminsService,
    AdminRequestsService,
    AdminConsultationsService,
    AdminCatalogService,
    AdminContentService,
  ],
})
export class AdminModule {}

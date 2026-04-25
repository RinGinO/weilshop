import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminsService } from './admins.service';
import { AdminsController, RolesController } from './admins.controller';
import { AdminRequestsService } from './admin-requests.service';
import { AdminRequestsController } from './admin-requests.controller';
import { AdminConsultationsService } from './admin-consultations.service';
import { AdminConsultationsController } from './admin-consultations.controller';
import { AdminCatalogService } from './admin-catalog.service';
import { AdminCatalogController } from './admin-catalog.controller';
import { AdminContentService } from './admin-content.service';
import { AdminContentController } from './admin-content.controller';
import { AdminProductsService } from './admin-products.service';
import { AdminProductsController } from './admin-products.controller';
import { AdminCategoriesService } from './admin-categories.service';
import { AdminCategoriesController } from './admin-categories.controller';
import { AdminBrandsService } from './admin-brands.service';
import { AdminBrandsController } from './admin-brands.controller';

@Module({
  controllers: [
    AdminAuthController,
    AdminsController,
    RolesController,
    AdminRequestsController,
    AdminConsultationsController,
    AdminCatalogController,
    AdminContentController,
    AdminProductsController,
    AdminCategoriesController,
    AdminBrandsController,
  ],
  providers: [
    AdminAuthService,
    AdminsService,
    AdminRequestsService,
    AdminConsultationsService,
    AdminCatalogService,
    AdminContentService,
    AdminProductsService,
    AdminCategoriesService,
    AdminBrandsService,
  ],
  exports: [
    AdminAuthService,
    AdminsService,
    AdminRequestsService,
    AdminConsultationsService,
    AdminCatalogService,
    AdminContentService,
    AdminProductsService,
    AdminCategoriesService,
    AdminBrandsService,
  ],
})
export class AdminModule {}

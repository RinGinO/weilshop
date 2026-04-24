import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { TasksModule } from './tasks/tasks.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CartModule } from './cart/cart.module';
import { RequestsModule } from './requests/requests.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60'),
        limit: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      },
    ]),
    AuthModule,
    CatalogModule,
    TasksModule,
    KnowledgeModule,
    FavoritesModule,
    CartModule,
    RequestsModule,
    ConsultationsModule,
    AccountModule,
    AdminModule,
    PrismaModule,
    RedisModule,
  ],
})
export class AppModule {}

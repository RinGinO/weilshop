import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { CareKitsService } from './care-kits.service';
import { CareKitsController } from './care-kits.controller';

@Module({
  controllers: [TasksController, CareKitsController],
  providers: [TasksService, CareKitsService],
  exports: [TasksService, CareKitsService],
})
export class TasksModule {}

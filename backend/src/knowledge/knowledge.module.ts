import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { InstructionsService } from './instructions.service';
import { InstructionsController } from './instructions.controller';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';

@Module({
  controllers: [ArticlesController, InstructionsController, FaqController],
  providers: [ArticlesService, InstructionsService, FaqService],
  exports: [ArticlesService, InstructionsService, FaqService],
})
export class KnowledgeModule {}

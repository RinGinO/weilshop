import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqItemDto, UpdateFaqItemDto, FaqQueryDto } from './dto/faq.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('knowledge/faq')
export class FaqController {
  constructor(private faqService: FaqService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFaqItemDto) {
    return this.faqService.create(dto);
  }

  @Get()
  @Public()
  async findAll(@Query() query: FaqQueryDto) {
    return this.faqService.findAll(query);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.faqService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFaqItemDto) {
    return this.faqService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.faqService.remove(id);
  }
}

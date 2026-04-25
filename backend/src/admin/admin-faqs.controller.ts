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
import { AdminFaqService } from './admin-faq.service';
import { CreateFaqDto, UpdateFaqDto, FaqQueryDto } from './dto/content.dto';

@Controller('admin/faqs')
export class AdminFaqsController {
  constructor(private faqService: AdminFaqService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFaqDto) {
    return this.faqService.createFaq(dto);
  }

  @Get()
  async findAll(@Query() query: FaqQueryDto) {
    return this.faqService.findAllFaqs(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.faqService.findFaqById(id);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFaqDto) {
    return this.faqService.updateFaq(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.faqService.deleteFaq(id);
  }
}

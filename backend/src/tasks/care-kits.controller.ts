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
import { CareKitsService } from './care-kits.service';
import { CreateCareKitDto, UpdateCareKitDto, CareKitQueryDto } from './dto/care-kit.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('tasks/care-kits')
export class CareKitsController {
  constructor(private careKitsService: CareKitsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCareKitDto) {
    return this.careKitsService.create(dto);
  }

  @Get()
  @Public()
  async findAll(@Query() query: CareKitQueryDto) {
    return this.careKitsService.findAll(query);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.careKitsService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  async findBySlug(@Param('slug') slug: string) {
    return this.careKitsService.findBySlug(slug);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCareKitDto) {
    return this.careKitsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.careKitsService.remove(id);
  }
}

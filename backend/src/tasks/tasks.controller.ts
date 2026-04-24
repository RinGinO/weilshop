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
import { TasksService } from './tasks.service';
import {
  CreateCareTaskDto,
  UpdateCareTaskDto,
  CareTaskQueryDto,
  AddProductToTaskDto,
  RemoveProductFromTaskDto,
} from './dto/care-task.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCareTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  @Public()
  async findAll(@Query() query: CareTaskQueryDto) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  async findBySlug(@Param('slug') slug: string) {
    return this.tasksService.findBySlug(slug);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCareTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }

  @Post('products/add')
  async addProduct(@Body() dto: AddProductToTaskDto) {
    return this.tasksService.addProduct(dto);
  }

  @Delete('products/remove')
  @HttpCode(HttpStatus.OK)
  async removeProduct(@Body() dto: RemoveProductFromTaskDto) {
    return this.tasksService.removeProduct(dto);
  }
}

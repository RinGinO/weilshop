import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdminCategoriesService } from './admin-categories.service';

@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private categoriesService: AdminCategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: { name: string; slug: string; description?: string; parentId?: string }) {
    return this.categoriesService.createCategory(dto);
  }

  @Get()
  async findAll() {
    return this.categoriesService.findAllCategories();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findCategoryById(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: { name?: string; slug?: string; description?: string; parentId?: string; isActive?: boolean },
  ) {
    return this.categoriesService.updateCategory(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}

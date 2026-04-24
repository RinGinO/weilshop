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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryDto } from './dto/category.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('catalog/categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  /**
   * POST /api/catalog/categories
   * Создание категории
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  /**
   * GET /api/catalog/categories
   * Получение всех категорий с фильтрами
   */
  @Get()
  @Public()
  async findAll(@Query() query: CategoryQueryDto) {
    return this.categoriesService.findAll(query);
  }

  /**
   * GET /api/catalog/categories/:id
   * Получение категории по ID
   */
  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  /**
   * GET /api/catalog/categories/slug/:slug
   * Получение категории по slug
   */
  @Get('slug/:slug')
  @Public()
  async findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  /**
   * PUT /api/catalog/categories/:id
   * Обновление категории
   */
  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  /**
   * DELETE /api/catalog/categories/:id
   * Удаление категории
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}

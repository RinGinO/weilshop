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
import { AdminArticlesService } from './admin-articles.service';
import { CreateArticleDto, UpdateArticleDto, ArticleQueryDto } from './dto/article.dto';

@Controller('admin/articles')
export class AdminArticlesController {
  constructor(private articlesService: AdminArticlesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateArticleDto) {
    return this.articlesService.createArticle(dto);
  }

  @Get()
  async findAll(@Query() query: ArticleQueryDto) {
    return this.articlesService.findAllArticles(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.articlesService.findArticleById(id);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.updateArticle(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.articlesService.deleteArticle(id);
  }
}

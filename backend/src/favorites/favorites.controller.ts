import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AddToFavoritesDto } from './dto/favorites.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  @Public()
  async findAll(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      return { page: 1, limit: 20, total: 0, items: [] };
    }

    return this.favoritesService.findAll(userId, parseInt(page, 10), parseInt(limit, 10));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
    @Body() dto: AddToFavoritesDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }

    return this.favoritesService.addToFavorites(userId, dto.productId);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  async remove(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }

    return this.favoritesService.removeFromFavorites(userId, productId);
  }

  @Get('check/:productId')
  @Public()
  async isFavorite(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      return { isFavorite: false };
    }

    const isFav = await this.favoritesService.isFavorite(userId, productId);
    return { isFavorite: isFav };
  }
}

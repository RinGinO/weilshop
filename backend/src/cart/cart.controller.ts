import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto, CartQueryDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async findAll(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
    @Query() query: CartQueryDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      return { page: 1, limit: 50, total: 0, items: [], totalQuantity: 0 };
    }

    return this.cartService.findAll(userId, query.page, query.limit);
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  async addItem(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
    @Body() dto: AddToCartDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }

    return this.cartService.addToCart(userId, dto.productId, dto.quantity);
  }

  @Patch('items/:productId')
  async updateItem(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: UpdateCartDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }

    if (!dto.quantity) {
      throw new Error('Требуется количество');
    }

    return this.cartService.updateQuantity(userId, productId, dto.quantity);
  }

  @Delete('items/:productId')
  @HttpCode(HttpStatus.OK)
  async removeItem(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }

    return this.cartService.removeFromCart(userId, productId);
  }

  @Delete('clear')
  @HttpCode(HttpStatus.OK)
  async clear(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }

    return this.cartService.clearCart(userId);
  }

  @Get('count')
  async getCount(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      return { count: 0 };
    }

    return this.cartService.getCount(userId);
  }
}

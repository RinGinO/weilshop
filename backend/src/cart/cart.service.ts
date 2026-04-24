import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  /**
   * Добавить товар в корзину
   */
  async addToCart(userId: string, productId: string, quantity: number = 1) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    if (!product.isActive) {
      throw new BadRequestException('Товар не активен');
    }

    const existing = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        data: {
          quantity: existing.quantity + quantity,
        },
        include: {
          product: {
            include: {
              brand: true,
              category: true,
            },
          },
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
          },
        },
      },
    });
  }

  /**
   * Получить всю корзину пользователя
   */
  async findAll(userId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [cartItems, total] = await Promise.all([
      this.prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              brand: true,
              category: true,
              taskLinks: {
                include: {
                  careTask: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.cartItem.count({
        where: { userId },
      }),
    ]);

    const totalQuantity = cartItems.reduce(
      (sum: number, item: any) => sum + item.quantity, // eslint-disable-line @typescript-eslint/no-explicit-any
      0,
    );

    return {
      page,
      limit,
      total,
      items: cartItems,
      totalQuantity,
    };
  }

  /**
   * Обновить количество товара в корзине
   */
  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Товар не найден в корзине');
    }

    return this.prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        quantity,
      },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
          },
        },
      },
    });
  }

  /**
   * Удалить товар из корзины
   */
  async removeFromCart(userId: string, productId: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Товар не найден в корзине');
    }

    await this.prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return { success: true };
  }

  /**
   * Очистить всю корзину
   */
  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return { success: true };
  }

  /**
   * Получить количество товаров в корзине
   */
  async getCount(userId: string) {
    const count = await this.prisma.cartItem.count({
      where: { userId },
    });

    return { count };
  }
}

// TODO: CartController
// GET /api/cart
// POST /api/cart/items
// PATCH /api/cart/items/:itemId
// DELETE /api/cart/items/:itemId
export class CartController {}

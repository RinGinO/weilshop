import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Добавить товар в избранное
   */
  async addToFavorites(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Товар уже в избранном');
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        productId,
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
   * Получить все избранные товары пользователя
   */
  async findAll(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      this.prisma.favorite.findMany({
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
      this.prisma.favorite.count({
        where: { userId },
      }),
    ]);

    return {
      page,
      limit,
      total,
      items: favorites.map((fav: any) => fav.product), // eslint-disable-line @typescript-eslint/no-explicit-any
    };
  }

  /**
   * Удалить товар из избранного
   */
  async removeFromFavorites(userId: string, productId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Товар не найден в избранном');
    }

    await this.prisma.favorite.delete({
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
   * Проверить, есть ли товар в избранном
   */
  async isFavorite(userId: string, productId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!favorite;
  }
}

// TODO: FavoritesController
// GET /api/favorites
// POST /api/favorites
// DELETE /api/favorites/:productId
export class FavoritesController {}

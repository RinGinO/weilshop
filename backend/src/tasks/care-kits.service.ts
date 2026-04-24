import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCareKitDto, UpdateCareKitDto, CareKitQueryDto } from './dto/care-kit.dto';

@Injectable()
export class CareKitsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создание комплекта ухода
   */
  async create(dto: CreateCareKitDto) {
    await this.checkSlugUnique(dto.slug);

    // Проверка задачи ухода если указана
    if (dto.careTaskId) {
      const task = await this.prisma.careTask.findUnique({
        where: { id: dto.careTaskId },
      });

      if (!task) {
        throw new NotFoundException('Задача ухода не найдена');
      }
    }

    // Проверка товаров если указаны
    if (dto.items && dto.items.length > 0) {
      await this.validateProducts(dto.items.map((item) => item.productId));
    }

    return this.prisma.careKit.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        isActive: dto.isActive ?? true,
        sortOrder: dto.sortOrder ?? 0,
        careTask: dto.careTaskId ? { connect: { id: dto.careTaskId } } : undefined,
        items: dto.items
          ? {
              create: dto.items.map((item) => ({
                productId: item.productId,
                stepNumber: item.stepNumber,
                title: item.title,
                description: item.description,
              })),
            }
          : undefined,
      },
      include: {
        careTask: true,
        items: {
          include: {
            product: true,
          },
          orderBy: {
            stepNumber: 'asc',
          },
        },
      },
    });
  }

  /**
   * Получение всех комплектов ухода
   */
  async findAll(query: CareKitQueryDto) {
    const {
      careTaskId,
      isActive,
      search,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (careTaskId) {
      where.careTaskId = careTaskId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [kits, total] = await Promise.all([
      this.prisma.careKit.findMany({
        where,
        include: {
          careTask: true,
          items: {
            include: {
              product: {
                include: {
                  brand: true,
                  category: true,
                },
              },
            },
            orderBy: {
              stepNumber: 'asc',
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.careKit.count({ where }),
    ]);

    return {
      page,
      limit,
      total,
      items: kits,
    };
  }

  /**
   * Получение комплекта ухода по ID
   */
  async findOne(id: string) {
    const kit = await this.prisma.careKit.findUnique({
      where: { id },
      include: {
        careTask: true,
        items: {
          include: {
            product: {
              include: {
                brand: true,
                category: true,
              },
            },
          },
          orderBy: {
            stepNumber: 'asc',
          },
        },
      },
    });

    if (!kit) {
      throw new NotFoundException('Комплект ухода не найден');
    }

    return kit;
  }

  /**
   * Получение комплекта ухода по slug
   */
  async findBySlug(slug: string) {
    const kit = await this.prisma.careKit.findUnique({
      where: { slug },
      include: {
        careTask: true,
        items: {
          include: {
            product: {
              include: {
                brand: true,
                category: true,
              },
            },
          },
          orderBy: {
            stepNumber: 'asc',
          },
        },
      },
    });

    if (!kit) {
      throw new NotFoundException('Комплект ухода не найден');
    }

    return kit;
  }

  /**
   * Обновление комплекта ухода
   */
  async update(id: string, dto: UpdateCareKitDto) {
    const existing = await this.prisma.careKit.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Комплект ухода не найден');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      await this.checkSlugUnique(dto.slug);
    }

    // Проверка задачи ухода если указана
    if (dto.careTaskId) {
      const task = await this.prisma.careTask.findUnique({
        where: { id: dto.careTaskId },
      });

      if (!task) {
        throw new NotFoundException('Задача ухода не найдена');
      }
    }

    // Проверка товаров если указаны
    if (dto.items && dto.items.length > 0) {
      const productIds = dto.items.map((item) => item.productId).filter((id): id is string => !!id);
      if (productIds.length > 0) {
        await this.validateProducts(productIds);
      }
    }

    // Обновление элементов комплекта
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
      careTask: dto.careTaskId
        ? { connect: { id: dto.careTaskId } }
        : dto.careTaskId === null
          ? { disconnect: true }
          : undefined,
    };

    // Если есть элементы, пересоздаём их
    if (dto.items) {
      await this.prisma.careKitItem.deleteMany({
        where: { careKitId: id },
      });

      if (dto.items.length > 0) {
        updateData.items = {
          create: dto.items.map((item) => ({
            productId: item.productId,
            stepNumber: item.stepNumber,
            title: item.title,
            description: item.description,
          })),
        };
      }
    }

    return this.prisma.careKit.update({
      where: { id },
      data: updateData,
      include: {
        careTask: true,
        items: {
          include: {
            product: true,
          },
          orderBy: {
            stepNumber: 'asc',
          },
        },
      },
    });
  }

  /**
   * Удаление комплекта ухода
   */
  async remove(id: string) {
    const existing = await this.prisma.careKit.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Комплект ухода не найден');
    }

    await this.prisma.careKit.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Проверка уникальности slug
   */
  private async checkSlugUnique(slug: string) {
    const existing = await this.prisma.careKit.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException('Комплект ухода с таким slug уже существует');
    }
  }

  /**
   * Проверка существования товаров
   */
  private async validateProducts(productIds: string[]) {
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Один или несколько товаров не найдены');
    }
  }
}

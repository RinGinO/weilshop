import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создание категории
   */
  async create(dto: CreateCategoryDto) {
    // Проверка уникальности slug
    await this.checkSlugUnique(dto.slug);

    // Проверка родительской категории
    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new NotFoundException('Родительская категория не найдена');
      }
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        isActive: dto.isActive ?? true,
        parent: dto.parentId ? { connect: { id: dto.parentId } } : undefined,
      },
      include: {
        parent: true,
        _count: {
          select: { children: true, products: true },
        },
      },
    });
  }

  /**
   * Получение всех категорий с пагинацией и фильтрами
   */
  async findAll(query: CategoryQueryDto) {
    const {
      parentId,
      isActive,
      search,
      sortBy = 'name',
      sortOrder = 'asc',
      page = '1',
      limit = '20',
    } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = String(isActive) === 'true';
    }

    if (parentId) {
      where.parentId = parentId === 'null' ? null : parentId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        include: {
          parent: true,
          _count: {
            select: { children: true, products: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limitNum,
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      page: pageNum,
      limit: limitNum,
      total,
      items: categories,
    };
  }

  /**
   * Получение категории по ID
   */
  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          include: {
            _count: {
              select: { children: true, products: true },
            },
          },
        },
        products: {
          take: 10,
          include: {
            brand: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  /**
   * Получение категории по slug
   */
  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          include: {
            _count: {
              select: { children: true, products: true },
            },
          },
        },
        products: {
          take: 10,
          include: {
            brand: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  /**
   * Обновление категории
   */
  async update(id: string, dto: UpdateCategoryDto) {
    // Проверка существования
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Категория не найдена');
    }

    // Проверка уникальности slug если меняется
    if (dto.slug && dto.slug !== existing.slug) {
      await this.checkSlugUnique(dto.slug);
    }

    // Проверка родительской категории
    if (dto.parentId && dto.parentId !== existing.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new NotFoundException('Родительская категория не найдена');
      }

      // Нельзя сделать категорию дочерней самой себя
      if (dto.parentId === id) {
        throw new BadRequestException('Категория не может быть родителем самой себя');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        isActive: dto.isActive,
        parent: dto.parentId
          ? { connect: { id: dto.parentId } }
          : dto.parentId === null
            ? { disconnect: true }
            : undefined,
      },
      include: {
        parent: true,
        _count: {
          select: { children: true, products: true },
        },
      },
    });
  }

  /**
   * Удаление категории
   */
  async remove(id: string) {
    // Проверка существования
    const existing = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { children: true, products: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Категория не найдена');
    }

    // Нельзя удалить категорию с дочерними элементами
    if (existing._count.children > 0) {
      throw new BadRequestException('Нельзя удалить категорию с дочерними категориями');
    }

    // Нельзя удалить категорию с товарами
    if (existing._count.products > 0) {
      throw new BadRequestException('Нельзя удалить категорию с товарами');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Проверка уникальности slug
   */
  private async checkSlugUnique(slug: string) {
    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException('Категория с таким slug уже существует');
    }
  }
}

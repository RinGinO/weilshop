import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBrandDto, UpdateBrandDto, BrandQueryDto } from './dto/brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создание бренда
   */
  async create(dto: CreateBrandDto) {
    // Проверка уникальности slug
    await this.checkSlugUnique(dto.slug);

    return this.prisma.brand.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        logoMediaId: dto.logoMediaId,
        isActive: dto.isActive ?? true,
      },
      include: {
        logoMedia: true,
        _count: {
          select: { products: true },
        },
      },
    });
  }

  /**
   * Получение всех брендов с пагинацией и фильтрами
   */
  async findAll(query: BrandQueryDto) {
    const {
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

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [brands, total] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        include: {
          logoMedia: true,
          _count: {
            select: { products: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limitNum,
      }),
      this.prisma.brand.count({ where }),
    ]);

    return {
      page: pageNum,
      limit: limitNum,
      total,
      items: brands,
    };
  }

  /**
   * Получение бренда по ID
   */
  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        logoMedia: true,
        products: {
          take: 10,
          include: {
            category: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException('Бренд не найден');
    }

    return brand;
  }

  /**
   * Получение бренда по slug
   */
  async findBySlug(slug: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
      include: {
        logoMedia: true,
        products: {
          take: 10,
          include: {
            category: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException('Бренд не найден');
    }

    return brand;
  }

  /**
   * Обновление бренда
   */
  async update(id: string, dto: UpdateBrandDto) {
    // Проверка существования
    const existing = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Бренд не найден');
    }

    // Проверка уникальности slug если меняется
    if (dto.slug && dto.slug !== existing.slug) {
      await this.checkSlugUnique(dto.slug);
    }

    return this.prisma.brand.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        logoMediaId: dto.logoMediaId,
        isActive: dto.isActive,
      },
      include: {
        logoMedia: true,
        _count: {
          select: { products: true },
        },
      },
    });
  }

  /**
   * Удаление бренда
   */
  async remove(id: string) {
    // Проверка существования
    const existing = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Бренд не найден');
    }

    // Нельзя удалить бренд с товарами
    if (existing._count.products > 0) {
      throw new BadRequestException('Нельзя удалить бренд с товарами');
    }

    await this.prisma.brand.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Проверка уникальности slug
   */
  private async checkSlugUnique(slug: string) {
    const existing = await this.prisma.brand.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException('Бренд с таким slug уже существует');
    }
  }
}

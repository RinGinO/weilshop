import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создание товара
   */
  async create(dto: CreateProductDto) {
    // Проверка уникальности slug
    await this.checkSlugUnique(dto.slug);

    // Проверка уникальности SKU если указан
    if (dto.sku) {
      await this.checkSkuUnique(dto.sku);
    }

    // Проверка категории
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Категория не найдена');
      }
    }

    // Проверка бренда
    if (dto.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: dto.brandId },
      });

      if (!brand) {
        throw new NotFoundException('Бренд не найден');
      }
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        sku: dto.sku,
        shortDescription: dto.shortDescription,
        fullDescription: dto.fullDescription,
        usageMethod: dto.usageMethod,
        benefits: dto.benefits,
        precautions: dto.precautions,
        volume: dto.volume,
        isActive: dto.isActive ?? true,
        sortOrder: dto.sortOrder ?? 0,
        brand: dto.brandId ? { connect: { id: dto.brandId } } : undefined,
        category: dto.categoryId ? { connect: { id: dto.categoryId } } : undefined,
      },
      include: {
        brand: true,
        category: true,
      },
    });
  }

  /**
   * Получение всех товаров с пагинацией, фильтрами и сортировкой
   */
  async findAll(query: ProductQueryDto) {
    const {
      categoryId,
      brandId,
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

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          brand: true,
          category: true,
          taskLinks: {
            include: {
              careTask: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      page,
      limit,
      total,
      items: products,
    };
  }

  /**
   * Получение товара по ID
   */
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        taskLinks: {
          include: {
            careTask: true,
          },
        },
        faqItems: true,
        instructions: true,
        careKitItems: {
          include: {
            careKit: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return product;
  }

  /**
   * Получение товара по slug
   */
  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        taskLinks: {
          include: {
            careTask: true,
          },
        },
        faqItems: true,
        instructions: true,
        careKitItems: {
          include: {
            careKit: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return product;
  }

  /**
   * Поиск связанных товаров
   */
  async findRelated(productId: string, limit: number = 6) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        categoryId: true,
        brandId: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      id: { not: productId },
      isActive: true,
    };

    // Приоритет: товары из той же категории
    if (product.categoryId) {
      where.categoryId = product.categoryId;
    } else if (product.brandId) {
      // Если категории нет, ищем товары того же бренда
      where.brandId = product.brandId;
    }

    const relatedProducts = await this.prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    return relatedProducts;
  }

  /**
   * Обновление товара
   */
  async update(id: string, dto: UpdateProductDto) {
    // Проверка существования
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Товар не найден');
    }

    // Проверка уникальности slug если меняется
    if (dto.slug && dto.slug !== existing.slug) {
      await this.checkSlugUnique(dto.slug);
    }

    // Проверка уникальности SKU если меняется
    if (dto.sku && dto.sku !== existing.sku) {
      await this.checkSkuUnique(dto.sku);
    }

    // Проверка категории
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Категория не найдена');
      }
    }

    // Проверка бренда
    if (dto.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: dto.brandId },
      });

      if (!brand) {
        throw new NotFoundException('Бренд не найден');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        sku: dto.sku,
        shortDescription: dto.shortDescription,
        fullDescription: dto.fullDescription,
        usageMethod: dto.usageMethod,
        benefits: dto.benefits,
        precautions: dto.precautions,
        volume: dto.volume,
        isActive: dto.isActive,
        sortOrder: dto.sortOrder,
        brand: dto.brandId
          ? { connect: { id: dto.brandId } }
          : dto.brandId === null
            ? { disconnect: true }
            : undefined,
        category: dto.categoryId
          ? { connect: { id: dto.categoryId } }
          : dto.categoryId === null
            ? { disconnect: true }
            : undefined,
      },
      include: {
        brand: true,
        category: true,
      },
    });
  }

  /**
   * Удаление товара (мягкое удаление через isActive)
   */
  async remove(id: string) {
    // Проверка существования
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Товар не найден');
    }

    // Мягкое удаление
    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return { success: true, message: 'Товар деактивирован' };
  }

  /**
   * Проверка уникальности slug
   */
  private async checkSlugUnique(slug: string) {
    const existing = await this.prisma.product.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException('Товар с таким slug уже существует');
    }
  }

  /**
   * Проверка уникальности SKU
   */
  private async checkSkuUnique(sku: string) {
    const existing = await this.prisma.product.findUnique({
      where: { sku },
    });

    if (existing) {
      throw new BadRequestException('Товар с таким SKU уже существует');
    }
  }
}

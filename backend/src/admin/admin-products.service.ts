import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';

@Injectable()
export class AdminProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    await this.checkSlugUnique(dto.slug);

    if (dto.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: dto.brandId },
      });
      if (!brand) {
        throw new NotFoundException('Бренд не найден');
      }
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Категория не найдена');
      }
    }

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        sku: dto.sku,
        brandId: dto.brandId,
        categoryId: dto.categoryId,
        shortDescription: dto.shortDescription,
        fullDescription: dto.fullDescription,
        usageMethod: dto.usageMethod,
        benefits: dto.benefits,
        precautions: dto.precautions,
        volume: dto.volume,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
        taskLinks: dto.taskIds
          ? {
              create: dto.taskIds.map((taskId) => ({
                careTask: { connect: { id: taskId } },
              })),
            }
          : undefined,
      },
      include: {
        brand: true,
        category: true,
        taskLinks: {
          include: {
            careTask: true,
          },
        },
      },
    });

    return product;
  }

  async findAllProducts(query: ProductQueryDto) {
    const {
      brandId,
      categoryId,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;
    if (isActive !== undefined) where.isActive = isActive;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
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

    return { page, limit, total, items: products };
  }

  async findProductById(id: string) {
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
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Товар не найден');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      await this.checkSlugUnique(dto.slug);
    }

    if (dto.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: dto.brandId },
      });
      if (!brand) {
        throw new NotFoundException('Бренд не найден');
      }
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Категория не найдена');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        sku: dto.sku,
        brandId: dto.brandId,
        categoryId: dto.categoryId,
        shortDescription: dto.shortDescription,
        fullDescription: dto.fullDescription,
        usageMethod: dto.usageMethod,
        benefits: dto.benefits,
        precautions: dto.precautions,
        volume: dto.volume,
        sortOrder: dto.sortOrder,
        isActive: dto.isActive,
      },
      include: {
        brand: true,
        category: true,
        taskLinks: {
          include: {
            careTask: true,
          },
        },
      },
    });
  }

  async deleteProduct(id: string) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Товар не найден');
    }

    await this.prisma.product.update({
      where: { id },
      data: { isActive: false }, // Мягкое удаление
    });

    return { success: true };
  }

  private async checkSlugUnique(slug: string) {
    const existing = await this.prisma.product.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('Товар с таким slug уже существует');
    }
  }
}

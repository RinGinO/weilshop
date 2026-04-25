import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AdminCategoriesService {
  constructor(private prisma: PrismaService) {}

  async createCategory(dto: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
  }) {
    await this.checkSlugUnique(dto.slug);

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
        parent: dto.parentId ? { connect: { id: dto.parentId } } : undefined,
      },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        products: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async updateCategory(
    id: string,
    dto: {
      name?: string;
      slug?: string;
      description?: string;
      parentId?: string;
      isActive?: boolean;
    },
  ) {
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Категория не найдена');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      await this.checkSlugUnique(dto.slug);
    }

    if (dto.parentId && dto.parentId !== existing.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('Родительская категория не найдена');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        parentId: dto.parentId,
        isActive: dto.isActive,
      },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async deleteCategory(id: string) {
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Категория не найдена');
    }

    await this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    return { success: true };
  }

  private async checkSlugUnique(slug: string) {
    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('Категория с таким slug уже существует');
    }
  }
}

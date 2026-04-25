import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AdminBrandsService {
  constructor(private prisma: PrismaService) {}

  async createBrand(dto: {
    name: string;
    slug: string;
    description?: string;
    logoMediaId?: string;
  }) {
    await this.checkSlugUnique(dto.slug);

    if (dto.logoMediaId) {
      const media = await this.prisma.mediaFile.findUnique({
        where: { id: dto.logoMediaId },
      });
      if (!media) {
        throw new NotFoundException('Медиафайл не найден');
      }
    }

    return this.prisma.brand.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        logoMediaId: dto.logoMediaId,
      },
      include: {
        logoMedia: true,
      },
    });
  }

  async findAllBrands() {
    return this.prisma.brand.findMany({
      include: {
        logoMedia: true,
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

  async findBrandById(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        logoMedia: true,
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

    if (!brand) {
      throw new NotFoundException('Бренд не найден');
    }

    return brand;
  }

  async updateBrand(
    id: string,
    dto: {
      name?: string;
      slug?: string;
      description?: string;
      logoMediaId?: string;
      isActive?: boolean;
    },
  ) {
    const existing = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Бренд не найден');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      await this.checkSlugUnique(dto.slug);
    }

    if (dto.logoMediaId) {
      const media = await this.prisma.mediaFile.findUnique({
        where: { id: dto.logoMediaId },
      });
      if (!media) {
        throw new NotFoundException('Медиафайл не найден');
      }
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
      },
    });
  }

  async deleteBrand(id: string) {
    const existing = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Бренд не найден');
    }

    await this.prisma.brand.update({
      where: { id },
      data: { isActive: false },
    });

    return { success: true };
  }

  private async checkSlugUnique(slug: string) {
    const existing = await this.prisma.brand.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('Бренд с таким slug уже существует');
    }
  }
}

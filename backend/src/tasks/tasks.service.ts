import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateCareTaskDto,
  UpdateCareTaskDto,
  CareTaskQueryDto,
  AddProductToTaskDto,
  RemoveProductFromTaskDto,
} from './dto/care-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создание задачи ухода
   */
  async create(dto: CreateCareTaskDto) {
    await this.checkSlugUnique(dto.slug);

    return this.prisma.careTask.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        shortDescription: dto.shortDescription,
        fullDescription: dto.fullDescription,
        problemDescription: dto.problemDescription,
        stepByStep: dto.stepByStep,
        faqBlock: dto.faqBlock,
        isActive: dto.isActive ?? true,
      },
      include: {
        productLinks: {
          include: {
            product: true,
          },
        },
        careKits: true,
        _count: {
          select: {
            productLinks: true,
            careKits: true,
            instructions: true,
            faqItems: true,
          },
        },
      },
    });
  }

  /**
   * Получение всех задач ухода с пагинацией
   */
  async findAll(query: CareTaskQueryDto) {
    const { isActive, search, sortBy = 'name', sortOrder = 'asc', page = 1, limit = 20 } = query;

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { fullDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tasks, total] = await Promise.all([
      this.prisma.careTask.findMany({
        where,
        include: {
          productLinks: {
            include: {
              product: {
                include: {
                  brand: true,
                  category: true,
                },
              },
            },
          },
          careKits: {
            take: 5,
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          },
          _count: {
            select: {
              productLinks: true,
              careKits: true,
              instructions: true,
              faqItems: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.careTask.count({ where }),
    ]);

    return {
      page,
      limit,
      total,
      items: tasks,
    };
  }

  /**
   * Получение задачи ухода по ID
   */
  async findOne(id: string) {
    const task = await this.prisma.careTask.findUnique({
      where: { id },
      include: {
        productLinks: {
          include: {
            product: {
              include: {
                brand: true,
                category: true,
              },
            },
          },
        },
        careKits: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
        instructions: true,
        faqItems: true,
        consultationRequests: true,
        _count: {
          select: {
            productLinks: true,
            careKits: true,
            instructions: true,
            faqItems: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Задача ухода не найдена');
    }

    return task;
  }

  /**
   * Получение задачи ухода по slug
   */
  async findBySlug(slug: string) {
    const task = await this.prisma.careTask.findUnique({
      where: { slug },
      include: {
        productLinks: {
          include: {
            product: {
              include: {
                brand: true,
                category: true,
              },
            },
          },
        },
        careKits: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
        instructions: true,
        faqItems: true,
        _count: {
          select: {
            productLinks: true,
            careKits: true,
            instructions: true,
            faqItems: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Задача ухода не найдена');
    }

    return task;
  }

  /**
   * Обновление задачи ухода
   */
  async update(id: string, dto: UpdateCareTaskDto) {
    const existing = await this.prisma.careTask.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Задача ухода не найдена');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      await this.checkSlugUnique(dto.slug);
    }

    return this.prisma.careTask.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        shortDescription: dto.shortDescription,
        fullDescription: dto.fullDescription,
        problemDescription: dto.problemDescription,
        stepByStep: dto.stepByStep,
        faqBlock: dto.faqBlock,
        isActive: dto.isActive,
      },
      include: {
        productLinks: {
          include: {
            product: true,
          },
        },
        careKits: true,
        _count: {
          select: {
            productLinks: true,
            careKits: true,
          },
        },
      },
    });
  }

  /**
   * Удаление задачи ухода
   */
  async remove(id: string) {
    const existing = await this.prisma.careTask.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            productLinks: true,
            careKits: true,
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Задача ухода не найдена');
    }

    if (existing._count.productLinks > 0) {
      throw new BadRequestException('Нельзя удалить задачу ухода с связанными товарами');
    }

    if (existing._count.careKits > 0) {
      throw new BadRequestException('Нельзя удалить задачу ухода с комплектами');
    }

    await this.prisma.careTask.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Добавить товар к задаче ухода
   */
  async addProduct(dto: AddProductToTaskDto) {
    const [product, task] = await Promise.all([
      this.prisma.product.findUnique({ where: { id: dto.productId } }),
      this.prisma.careTask.findUnique({ where: { id: dto.careTaskId } }),
    ]);

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    if (!task) {
      throw new NotFoundException('Задача ухода не найдена');
    }

    const existing = await this.prisma.productCareTask.findUnique({
      where: {
        productId_careTaskId: {
          productId: dto.productId,
          careTaskId: dto.careTaskId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Товар уже связан с задачей ухода');
    }

    return this.prisma.productCareTask.create({
      data: {
        productId: dto.productId,
        careTaskId: dto.careTaskId,
      },
      include: {
        product: true,
        careTask: true,
      },
    });
  }

  /**
   * Удалить товар из задачи ухода
   */
  async removeProduct(dto: RemoveProductFromTaskDto) {
    const existing = await this.prisma.productCareTask.findUnique({
      where: {
        productId_careTaskId: {
          productId: dto.productId,
          careTaskId: dto.careTaskId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Связь не найдена');
    }

    await this.prisma.productCareTask.delete({
      where: {
        productId_careTaskId: {
          productId: dto.productId,
          careTaskId: dto.careTaskId,
        },
      },
    });

    return { success: true };
  }

  /**
   * Проверка уникальности slug
   */
  private async checkSlugUnique(slug: string) {
    const existing = await this.prisma.careTask.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException('Задача ухода с таким slug уже существует');
    }
  }
}

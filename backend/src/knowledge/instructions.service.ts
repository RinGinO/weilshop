import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateInstructionDto,
  UpdateInstructionDto,
  InstructionQueryDto,
} from './dto/instruction.dto';

@Injectable()
export class InstructionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создание инструкции
   */
  async create(dto: CreateInstructionDto) {
    await this.checkSlugUnique(dto.slug);

    // Проверка товара если указан
    if (dto.relatedProductId) {
      const product = await this.prisma.product.findUnique({
        where: { id: dto.relatedProductId },
      });

      if (!product) {
        throw new NotFoundException('Товар не найден');
      }
    }

    // Проверка задачи если указана
    if (dto.relatedTaskId) {
      const task = await this.prisma.careTask.findUnique({
        where: { id: dto.relatedTaskId },
      });

      if (!task) {
        throw new NotFoundException('Задача ухода не найдена');
      }
    }

    return this.prisma.instruction.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        content: dto.content,
        isPublished: dto.isPublished ?? false,
        relatedProduct: dto.relatedProductId
          ? { connect: { id: dto.relatedProductId } }
          : undefined,
        relatedTask: dto.relatedTaskId ? { connect: { id: dto.relatedTaskId } } : undefined,
      },
      include: {
        relatedProduct: true,
        relatedTask: true,
      },
    });
  }

  /**
   * Получение всех инструкций с пагинацией
   */
  async findAll(query: InstructionQueryDto) {
    const {
      relatedProductId,
      relatedTaskId,
      isPublished,
      search,
      sortBy = 'title',
      sortOrder = 'asc',
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    if (relatedProductId) {
      where.relatedProductId = relatedProductId;
    }

    if (relatedTaskId) {
      where.relatedTaskId = relatedTaskId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [instructions, total] = await Promise.all([
      this.prisma.instruction.findMany({
        where,
        include: {
          relatedProduct: true,
          relatedTask: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.instruction.count({ where }),
    ]);

    return {
      page,
      limit,
      total,
      items: instructions,
    };
  }

  /**
   * Получение инструкции по ID
   */
  async findOne(id: string) {
    const instruction = await this.prisma.instruction.findUnique({
      where: { id },
      include: {
        relatedProduct: true,
        relatedTask: true,
      },
    });

    if (!instruction) {
      throw new NotFoundException('Инструкция не найдена');
    }

    return instruction;
  }

  /**
   * Получение инструкции по slug
   */
  async findBySlug(slug: string) {
    const instruction = await this.prisma.instruction.findUnique({
      where: { slug },
      include: {
        relatedProduct: true,
        relatedTask: true,
      },
    });

    if (!instruction) {
      throw new NotFoundException('Инструкция не найдена');
    }

    return instruction;
  }

  /**
   * Обновление инструкции
   */
  async update(id: string, dto: UpdateInstructionDto) {
    const existing = await this.prisma.instruction.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Инструкция не найдена');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      await this.checkSlugUnique(dto.slug);
    }

    // Проверка товара если указан
    if (dto.relatedProductId) {
      const product = await this.prisma.product.findUnique({
        where: { id: dto.relatedProductId },
      });

      if (!product) {
        throw new NotFoundException('Товар не найден');
      }
    }

    // Проверка задачи если указана
    if (dto.relatedTaskId) {
      const task = await this.prisma.careTask.findUnique({
        where: { id: dto.relatedTaskId },
      });

      if (!task) {
        throw new NotFoundException('Задача ухода не найдена');
      }
    }

    return this.prisma.instruction.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        content: dto.content,
        isPublished: dto.isPublished,
        relatedProduct: dto.relatedProductId
          ? { connect: { id: dto.relatedProductId } }
          : dto.relatedProductId === null
            ? { disconnect: true }
            : undefined,
        relatedTask: dto.relatedTaskId
          ? { connect: { id: dto.relatedTaskId } }
          : dto.relatedTaskId === null
            ? { disconnect: true }
            : undefined,
      },
      include: {
        relatedProduct: true,
        relatedTask: true,
      },
    });
  }

  /**
   * Удаление инструкции
   */
  async remove(id: string) {
    const existing = await this.prisma.instruction.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Инструкция не найдена');
    }

    await this.prisma.instruction.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Проверка уникальности slug
   */
  private async checkSlugUnique(slug: string) {
    const existing = await this.prisma.instruction.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException('Инструкция с таким slug уже существует');
    }
  }
}

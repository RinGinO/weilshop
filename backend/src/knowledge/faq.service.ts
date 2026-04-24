import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateFaqItemDto, UpdateFaqItemDto, FaqQueryDto } from './dto/faq.dto';

@Injectable()
export class FaqService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создание FAQ элемента
   */
  async create(dto: CreateFaqItemDto) {
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

    return this.prisma.faqItem.create({
      data: {
        question: dto.question,
        answer: dto.answer,
        sortOrder: dto.sortOrder ?? 0,
        isPublished: dto.isPublished ?? true,
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
   * Получение всех FAQ элементов с пагинацией
   */
  async findAll(query: FaqQueryDto) {
    const {
      relatedProductId,
      relatedTaskId,
      isPublished,
      search,
      sortBy = 'sortOrder',
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
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [faqItems, total] = await Promise.all([
      this.prisma.faqItem.findMany({
        where,
        include: {
          relatedProduct: true,
          relatedTask: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.faqItem.count({ where }),
    ]);

    return {
      page,
      limit,
      total,
      items: faqItems,
    };
  }

  /**
   * Получение FAQ элемента по ID
   */
  async findOne(id: string) {
    const faqItem = await this.prisma.faqItem.findUnique({
      where: { id },
      include: {
        relatedProduct: true,
        relatedTask: true,
      },
    });

    if (!faqItem) {
      throw new NotFoundException('FAQ элемент не найден');
    }

    return faqItem;
  }

  /**
   * Обновление FAQ элемента
   */
  async update(id: string, dto: UpdateFaqItemDto) {
    const existing = await this.prisma.faqItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('FAQ элемент не найден');
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

    return this.prisma.faqItem.update({
      where: { id },
      data: {
        question: dto.question,
        answer: dto.answer,
        sortOrder: dto.sortOrder,
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
   * Удаление FAQ элемента
   */
  async remove(id: string) {
    const existing = await this.prisma.faqItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('FAQ элемент не найден');
    }

    await this.prisma.faqItem.delete({
      where: { id },
    });

    return { success: true };
  }
}

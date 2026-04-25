import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateFaqDto, UpdateFaqDto, FaqQueryDto } from './dto/content.dto';

@Injectable()
export class AdminFaqService {
  constructor(private prisma: PrismaService) {}

  async createFaq(dto: CreateFaqDto) {
    if (dto.relatedProductId) {
      const product = await this.prisma.product.findUnique({
        where: { id: dto.relatedProductId },
      });
      if (!product) {
        throw new NotFoundException('Товар не найден');
      }
    }

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
        relatedProductId: dto.relatedProductId,
        relatedTaskId: dto.relatedTaskId,
        isPublished: dto.isPublished ?? true,
      },
      include: {
        relatedProduct: true,
        relatedTask: true,
      },
    });
  }

  async findAllFaqs(query: FaqQueryDto) {
    const { isPublished, relatedProductId, relatedTaskId, search, page = 1, limit = 20 } = query;

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (isPublished !== undefined) where.isPublished = isPublished;
    if (relatedProductId) where.relatedProductId = relatedProductId;
    if (relatedTaskId) where.relatedTaskId = relatedTaskId;

    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [faqs, total] = await Promise.all([
      this.prisma.faqItem.findMany({
        where,
        include: {
          relatedProduct: true,
          relatedTask: true,
        },
        orderBy: { sortOrder: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.faqItem.count({ where }),
    ]);

    return { page, limit, total, items: faqs };
  }

  async findFaqById(id: string) {
    const faq = await this.prisma.faqItem.findUnique({
      where: { id },
      include: {
        relatedProduct: true,
        relatedTask: true,
      },
    });

    if (!faq) {
      throw new NotFoundException('FAQ не найден');
    }

    return faq;
  }

  async updateFaq(id: string, dto: UpdateFaqDto) {
    const existing = await this.prisma.faqItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('FAQ не найден');
    }

    return this.prisma.faqItem.update({
      where: { id },
      data: {
        question: dto.question,
        answer: dto.answer,
        sortOrder: dto.sortOrder,
        isPublished: dto.isPublished,
      },
      include: {
        relatedProduct: true,
        relatedTask: true,
      },
    });
  }

  async deleteFaq(id: string) {
    const existing = await this.prisma.faqItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('FAQ не найден');
    }

    await this.prisma.faqItem.delete({
      where: { id },
    });

    return { success: true };
  }
}

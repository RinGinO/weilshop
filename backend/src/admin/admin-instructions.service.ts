import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateInstructionDto, UpdateInstructionDto, InstructionQueryDto } from './dto/content.dto';

@Injectable()
export class AdminInstructionsService {
  constructor(private prisma: PrismaService) {}

  async createInstruction(dto: CreateInstructionDto) {
    await this.checkSlugUnique(dto.slug);

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

    return this.prisma.instruction.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        content: dto.content,
        relatedProductId: dto.relatedProductId,
        relatedTaskId: dto.relatedTaskId,
        isPublished: dto.isPublished ?? false,
      },
      include: {
        relatedProduct: true,
        relatedTask: true,
      },
    });
  }

  async findAllInstructions(query: InstructionQueryDto) {
    const { isPublished, relatedProductId, relatedTaskId, search, page = 1, limit = 20 } = query;

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (isPublished !== undefined) where.isPublished = isPublished;
    if (relatedProductId) where.relatedProductId = relatedProductId;
    if (relatedTaskId) where.relatedTaskId = relatedTaskId;

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
        orderBy: { title: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.instruction.count({ where }),
    ]);

    return { page, limit, total, items: instructions };
  }

  async findInstructionById(id: string) {
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

  async updateInstruction(id: string, dto: UpdateInstructionDto) {
    const existing = await this.prisma.instruction.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Инструкция не найдена');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      await this.checkSlugUnique(dto.slug);
    }

    return this.prisma.instruction.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        content: dto.content,
        isPublished: dto.isPublished,
      },
      include: {
        relatedProduct: true,
        relatedTask: true,
      },
    });
  }

  async deleteInstruction(id: string) {
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

  private async checkSlugUnique(slug: string) {
    const existing = await this.prisma.instruction.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('Инструкция с таким slug уже существует');
    }
  }
}

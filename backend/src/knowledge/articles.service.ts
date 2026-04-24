import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto, ArticleQueryDto } from './dto/article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создание статьи
   */
  async create(dto: CreateArticleDto) {
    await this.checkSlugUnique(dto.slug);

    // Проверка автора если указан
    if (dto.authorId) {
      const admin = await this.prisma.admin.findUnique({
        where: { id: dto.authorId },
      });

      if (!admin) {
        throw new NotFoundException('Автор не найден');
      }
    }

    // Проверка обложки если указана
    if (dto.coverMediaId) {
      const media = await this.prisma.mediaFile.findUnique({
        where: { id: dto.coverMediaId },
      });

      if (!media) {
        throw new NotFoundException('Медиафайл не найден');
      }
    }

    return this.prisma.article.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        previewText: dto.previewText,
        content: dto.content,
        isPublished: dto.isPublished ?? false,
        publishedAt: dto.isPublished ? new Date() : null,
        author: dto.authorId ? { connect: { id: dto.authorId } } : undefined,
        coverMedia: dto.coverMediaId ? { connect: { id: dto.coverMediaId } } : undefined,
      },
      include: {
        author: true,
        coverMedia: true,
      },
    });
  }

  /**
   * Получение всех статей с пагинацией
   */
  async findAll(query: ArticleQueryDto) {
    const {
      isPublished,
      authorId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { previewText: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          author: true,
          coverMedia: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      page,
      limit,
      total,
      items: articles,
    };
  }

  /**
   * Получение статьи по ID
   */
  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
        coverMedia: true,
      },
    });

    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    return article;
  }

  /**
   * Получение статьи по slug
   */
  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
        coverMedia: true,
      },
    });

    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    return article;
  }

  /**
   * Обновление статьи
   */
  async update(id: string, dto: UpdateArticleDto) {
    const existing = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Статья не найдена');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      await this.checkSlugUnique(dto.slug);
    }

    // Проверка автора если указан
    if (dto.authorId) {
      const admin = await this.prisma.admin.findUnique({
        where: { id: dto.authorId },
      });

      if (!admin) {
        throw new NotFoundException('Автор не найден');
      }
    }

    // Проверка обложки если указана
    if (dto.coverMediaId) {
      const media = await this.prisma.mediaFile.findUnique({
        where: { id: dto.coverMediaId },
      });

      if (!media) {
        throw new NotFoundException('Медиафайл не найден');
      }
    }

    // Обновление даты публикации если меняем статус на опубликовано
    const publishedAt =
      dto.isPublished && !existing.isPublished
        ? new Date()
        : dto.isPublished === false
          ? null
          : existing.publishedAt;

    return this.prisma.article.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        previewText: dto.previewText,
        content: dto.content,
        isPublished: dto.isPublished,
        publishedAt,
        author: dto.authorId ? { connect: { id: dto.authorId } } : undefined,
        coverMedia: dto.coverMediaId ? { connect: { id: dto.coverMediaId } } : undefined,
      },
      include: {
        author: true,
        coverMedia: true,
      },
    });
  }

  /**
   * Удаление статьи
   */
  async remove(id: string) {
    const existing = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Статья не найдена');
    }

    await this.prisma.article.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Проверка уникальности slug
   */
  private async checkSlugUnique(slug: string) {
    const existing = await this.prisma.article.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException('Статья с таким slug уже существует');
    }
  }
}

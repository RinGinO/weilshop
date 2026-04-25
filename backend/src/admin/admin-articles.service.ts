import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto, ArticleQueryDto } from './dto/article.dto';

@Injectable()
export class AdminArticlesService {
  constructor(private prisma: PrismaService) {}

  async createArticle(dto: CreateArticleDto) {
    await this.checkSlugUnique(dto.slug);

    if (dto.authorId) {
      const author = await this.prisma.admin.findUnique({
        where: { id: dto.authorId },
      });
      if (!author) {
        throw new NotFoundException('Автор не найден');
      }
    }

    if (dto.coverMediaId) {
      const media = await this.prisma.mediaFile.findUnique({
        where: { id: dto.coverMediaId },
      });
      if (!media) {
        throw new NotFoundException('Медиафайл не найден');
      }
    }

    const article = await this.prisma.article.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        previewText: dto.previewText,
        content: dto.content,
        coverMediaId: dto.coverMediaId,
        authorId: dto.authorId,
        isPublished: dto.isPublished ?? false,
      },
      include: {
        coverMedia: true,
        author: true,
      },
    });

    return article;
  }

  async findAllArticles(query: ArticleQueryDto) {
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

    if (isPublished !== undefined) where.isPublished = isPublished;
    if (authorId) where.authorId = authorId;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { previewText: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          coverMedia: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.article.count({ where }),
    ]);

    return { page, limit, total, items: articles };
  }

  async findArticleById(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        coverMedia: true,
        author: true,
      },
    });

    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    return article;
  }

  async updateArticle(id: string, dto: UpdateArticleDto) {
    const existing = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Статья не найдена');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      await this.checkSlugUnique(dto.slug);
    }

    if (dto.coverMediaId) {
      const media = await this.prisma.mediaFile.findUnique({
        where: { id: dto.coverMediaId },
      });
      if (!media) {
        throw new NotFoundException('Медиафайл не найден');
      }
    }

    return this.prisma.article.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        previewText: dto.previewText,
        content: dto.content,
        coverMediaId: dto.coverMediaId,
        isPublished: dto.isPublished,
      },
      include: {
        coverMedia: true,
        author: true,
      },
    });
  }

  async deleteArticle(id: string) {
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

  private async checkSlugUnique(slug: string) {
    const existing = await this.prisma.article.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('Статья с таким slug уже существует');
    }
  }
}

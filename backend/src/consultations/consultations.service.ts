import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateConsultationDto,
  RespondConsultationDto,
  ConsultationQueryDto,
} from './dto/consultation.dto';
import { ConsultationStatus } from '@prisma/client';

@Injectable()
export class ConsultationsService {
  constructor(private prisma: PrismaService) {}

  async createRequest(userId: string | null, dto: CreateConsultationDto) {
    if (dto.careTaskId) {
      const task = await this.prisma.careTask.findUnique({
        where: { id: dto.careTaskId },
      });

      if (!task) {
        throw new NotFoundException('Задача ухода не найдена');
      }
    }

    let products = [];
    if (dto.productIds && dto.productIds.length > 0) {
      products = await this.prisma.product.findMany({
        where: { id: { in: dto.productIds } },
      });

      if (products.length !== dto.productIds.length) {
        throw new NotFoundException('Некоторые товары не найдены');
      }
    }

    const consultation = await this.prisma.consultationRequest.create({
      data: {
        userId,
        careTaskId: dto.careTaskId,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        message: dto.message,
        status: ConsultationStatus.NEW,
        products: dto.productIds
          ? {
              create: dto.productIds.map((productId) => ({
                productId,
              })),
            }
          : undefined,
      },
      include: {
        products: { include: { product: true } },
        careTask: true,
      },
    });

    return consultation;
  }

  async findAll(query: ConsultationQueryDto) {
    const {
      status,
      assignedAdminId,
      userId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (status) where.status = status;
    if (assignedAdminId) where.assignedAdminId = assignedAdminId;
    if (userId) where.userId = userId;

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [consultations, total] = await Promise.all([
      this.prisma.consultationRequest.findMany({
        where,
        include: {
          products: { include: { product: true } },
          careTask: true,
          assignedAdmin: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.consultationRequest.count({ where }),
    ]);

    return { page, limit, total, items: consultations };
  }

  async findOne(id: string, userId?: string, isAdmin = false) {
    const consultation = await this.prisma.consultationRequest.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: { include: { brand: true, category: true } },
          },
        },
        careTask: true,
        assignedAdmin: true,
        user: true,
      },
    });

    if (!consultation) {
      throw new NotFoundException('Запрос на консультацию не найден');
    }

    if (!isAdmin && consultation.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этому запросу');
    }

    return consultation;
  }

  async assignAdmin(requestId: string, adminId: string) {
    const consultation = await this.prisma.consultationRequest.findUnique({
      where: { id: requestId },
    });

    if (!consultation) {
      throw new NotFoundException('Запрос на консультацию не найден');
    }

    if (consultation.status === ConsultationStatus.CLOSED) {
      throw new BadRequestException('Нельзя назначить администратора на завершённый запрос');
    }

    return this.prisma.consultationRequest.update({
      where: { id: requestId },
      data: {
        assignedAdminId: adminId,
        status: ConsultationStatus.IN_PROGRESS,
      },
      include: { assignedAdmin: true },
    });
  }

  async respond(requestId: string, dto: RespondConsultationDto, adminId: string) {
    const consultation = await this.prisma.consultationRequest.findUnique({
      where: { id: requestId },
    });

    if (!consultation) {
      throw new NotFoundException('Запрос на консультацию не найден');
    }

    if (consultation.assignedAdminId !== adminId) {
      throw new ForbiddenException('Только назначенный администратор может ответить');
    }

    return this.prisma.consultationRequest.update({
      where: { id: requestId },
      data: {
        response: dto.response,
        status: dto.status || ConsultationStatus.RESOLVED,
      },
      include: {
        products: { include: { product: true } },
        assignedAdmin: true,
      },
    });
  }

  async closeRequest(requestId: string, adminId: string) {
    const consultation = await this.prisma.consultationRequest.findUnique({
      where: { id: requestId },
    });

    if (!consultation) {
      throw new NotFoundException('Запрос на консультацию не найден');
    }

    if (consultation.assignedAdminId !== adminId) {
      throw new ForbiddenException('Только назначенный администратор может закрыть запрос');
    }

    return this.prisma.consultationRequest.update({
      where: { id: requestId },
      data: { status: ConsultationStatus.CLOSED },
    });
  }

  async cancelRequest(requestId: string, userId: string) {
    const consultation = await this.prisma.consultationRequest.findUnique({
      where: { id: requestId },
    });

    if (!consultation) {
      throw new NotFoundException('Запрос на консультацию не найден');
    }

    if (consultation.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этому запросу');
    }

    if (consultation.status !== ConsultationStatus.NEW) {
      throw new BadRequestException('Можно отменить только новый запрос');
    }

    return this.prisma.consultationRequest.update({
      where: { id: requestId },
      data: { status: ConsultationStatus.CLOSED },
    });
  }

  async getMyConsultations(userId: string, query: ConsultationQueryDto) {
    return this.findAll({ ...query, userId });
  }

  async getAssignedConsultations(adminId: string, query: ConsultationQueryDto) {
    return this.findAll({ ...query, assignedAdminId: adminId });
  }
}

// TODO: ConsultationsController
// GET /api/consultations
// POST /api/consultations
// GET /api/consultations/:id
export class ConsultationsController {}

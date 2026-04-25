import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  UpdateConsultationDto,
  AssignConsultationDto,
  ConsultationQueryDto,
} from './dto/consultation.dto';

@Injectable()
export class AdminConsultationsCrudService {
  constructor(private prisma: PrismaService) {}

  async findAllConsultations(query: ConsultationQueryDto) {
    const {
      status,
      assignedAdminId,
      careTaskId,
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
    if (careTaskId) where.careTaskId = careTaskId;

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
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          careTask: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          assignedAdmin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  isActive: true,
                },
              },
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.consultationRequest.count({ where }),
    ]);

    return { page, limit, total, items: consultations };
  }

  async findConsultationById(id: string) {
    const consultation = await this.prisma.consultationRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        careTask: true,
        assignedAdmin: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!consultation) {
      throw new NotFoundException('Консультация не найдена');
    }

    return consultation;
  }

  async assignConsultation(id: string, dto: AssignConsultationDto) {
    const consultation = await this.prisma.consultationRequest.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw new NotFoundException('Консультация не найдена');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id: dto.assignedAdminId },
    });

    if (!admin) {
      throw new NotFoundException('Администратор не найден');
    }

    return this.prisma.consultationRequest.update({
      where: { id },
      data: {
        assignedAdminId: dto.assignedAdminId,
        status: 'IN_PROGRESS',
      },
      include: {
        assignedAdmin: true,
      },
    });
  }

  async updateConsultation(id: string, dto: UpdateConsultationDto) {
    const consultation = await this.prisma.consultationRequest.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw new NotFoundException('Консультация не найдена');
    }

    if (dto.assignedAdminId) {
      const admin = await this.prisma.admin.findUnique({
        where: { id: dto.assignedAdminId },
      });

      if (!admin) {
        throw new NotFoundException('Администратор не найден');
      }
    }

    return this.prisma.consultationRequest.update({
      where: { id },
      data: {
        status: dto.status,
        response: dto.response,
        assignedAdminId: dto.assignedAdminId,
      },
      include: {
        assignedAdmin: true,
        careTask: true,
        user: true,
      },
    });
  }

  async resolveConsultation(id: string, response: string) {
    const consultation = await this.prisma.consultationRequest.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw new NotFoundException('Консультация не найдена');
    }

    return this.prisma.consultationRequest.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        response: response,
      },
      include: {
        assignedAdmin: true,
      },
    });
  }

  async closeConsultation(id: string) {
    const consultation = await this.prisma.consultationRequest.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw new NotFoundException('Консультация не найдена');
    }

    return this.prisma.consultationRequest.update({
      where: { id },
      data: {
        status: 'CLOSED',
      },
    });
  }

  async deleteConsultation(id: string) {
    const consultation = await this.prisma.consultationRequest.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw new NotFoundException('Консультация не найдена');
    }

    await this.prisma.consultationRequest.delete({
      where: { id },
    });

    return { success: true };
  }

  async getConsultationStatistics() {
    const [totalCount, newCount, inProgressCount, resolvedCount, closedCount] = await Promise.all([
      this.prisma.consultationRequest.count(),
      this.prisma.consultationRequest.count({ where: { status: 'NEW' } }),
      this.prisma.consultationRequest.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.consultationRequest.count({ where: { status: 'RESOLVED' } }),
      this.prisma.consultationRequest.count({ where: { status: 'CLOSED' } }),
    ]);

    return {
      totalCount,
      byStatus: {
        NEW: newCount,
        IN_PROGRESS: inProgressCount,
        RESOLVED: resolvedCount,
        CLOSED: closedCount,
      },
    };
  }
}

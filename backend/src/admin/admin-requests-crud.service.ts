import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  UpdateRequestDto,
  UpdateRequestStatusDto,
  RequestQueryDto,
} from './dto/request.dto';

@Injectable()
export class AdminRequestsCrudService {
  constructor(private prisma: PrismaService) {}

  async findAllRequests(query: RequestQueryDto) {
    const {
      status,
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
    if (userId) where.userId = userId;

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [requests, total] = await Promise.all([
      this.prisma.requestOrder.findMany({
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
          items: {
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
          statusHistory: {
            include: {
              changedByAdmin: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.requestOrder.count({ where }),
    ]);

    return { page, limit, total, items: requests };
  }

  async findRequestById(id: string) {
    const request = await this.prisma.requestOrder.findUnique({
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
        items: {
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
        statusHistory: {
          include: {
            changedByAdmin: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    return request;
  }

  async updateRequestStatus(
    id: string,
    dto: UpdateRequestStatusDto,
    adminId: string,
  ) {
    const request = await this.prisma.requestOrder.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    const oldStatus = request.status;

    const [updatedRequest] = await this.prisma.$transaction([
      this.prisma.requestOrder.update({
        where: { id },
        data: { status: dto.newStatus },
      }),
      this.prisma.requestStatusHistory.create({
        data: {
          requestOrderId: id,
          oldStatus: oldStatus,
          newStatus: dto.newStatus,
          changedByAdminId: adminId,
          comment: dto.comment,
        },
      }),
    ]);

    return this.findRequestById(id);
  }

  async updateRequest(id: string, dto: UpdateRequestDto, adminId: string) {
    const request = await this.prisma.requestOrder.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    const updateData: any = {
      adminComment: dto.adminComment,
    };

    if (dto.status && dto.status !== request.status) {
      updateData.status = dto.status;

      await this.prisma.requestStatusHistory.create({
        data: {
          requestOrderId: id,
          oldStatus: request.status,
          newStatus: dto.status,
          changedByAdminId: adminId,
        },
      });
    }

    return this.prisma.requestOrder.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
        statusHistory: {
          include: {
            changedByAdmin: true,
          },
        },
      },
    });
  }

  async deleteRequest(id: string) {
    const request = await this.prisma.requestOrder.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    await this.prisma.requestOrder.delete({
      where: { id },
    });

    return { success: true };
  }

  async getRequestStatistics() {
    const [totalCount, newCount, inReviewCount, confirmedCount, processingCount, completedCount, cancelledCount] = await Promise.all([
      this.prisma.requestOrder.count(),
      this.prisma.requestOrder.count({ where: { status: 'NEW' } }),
      this.prisma.requestOrder.count({ where: { status: 'IN_REVIEW' } }),
      this.prisma.requestOrder.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.requestOrder.count({ where: { status: 'PROCESSING' } }),
      this.prisma.requestOrder.count({ where: { status: 'COMPLETED' } }),
      this.prisma.requestOrder.count({ where: { status: 'CANCELLED' } }),
    ]);

    return {
      totalCount,
      byStatus: {
        NEW: newCount,
        IN_REVIEW: inReviewCount,
        CONFIRMED: confirmedCount,
        PROCESSING: processingCount,
        COMPLETED: completedCount,
        CANCELLED: cancelledCount,
      },
    };
  }
}

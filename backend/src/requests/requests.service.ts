import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateRequestOrderDto,
  AddRequestItemDto,
  UpdateRequestStatusDto,
  RequestQueryDto,
} from './dto/request.dto';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async createRequestOrder(userId: string, dto: CreateRequestOrderDto) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Корзина пуста');
    }

    const requestOrder = await this.prisma.requestOrder.create({
      data: {
        userId,
        status: RequestStatus.NEW,
        comment: dto.comment,
        customerName: dto.customerName ?? '',
        customerPhone: dto.customerPhone,
        customerEmail: dto.customerEmail,
        items: {
          create: cartItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            productNameSnapshot: item.product.name,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        statusHistory: true,
      },
    });

    await this.prisma.cartItem.deleteMany({ where: { userId } });

    return requestOrder;
  }

  async findAllByUser(userId: string, query: RequestQueryDto) {
    const {
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId };

    if (status) where.status = status;

    if (search) {
      where.OR = [
        { id: { contains: search } },
        { comment: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [requests, total] = await Promise.all([
      this.prisma.requestOrder.findMany({
        where,
        include: {
          items: { include: { product: true } },
          statusHistory: {
            orderBy: { createdAt: 'desc' },
            take: 1,
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

  async findOne(userId: string, id: string) {
    const requestOrder = await this.prisma.requestOrder.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { include: { brand: true, category: true } },
          },
        },
        statusHistory: { orderBy: { createdAt: 'desc' } },
        user: true,
      },
    });

    if (!requestOrder) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (requestOrder.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этой заявке');
    }

    return requestOrder;
  }

  async updateStatus(requestId: string, dto: UpdateRequestStatusDto, adminId: string) {
    const requestOrder = await this.prisma.requestOrder.findUnique({
      where: { id: requestId },
    });

    if (!requestOrder) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (
      requestOrder.status === RequestStatus.CANCELLED ||
      requestOrder.status === RequestStatus.COMPLETED
    ) {
      throw new BadRequestException('Нельзя изменить статус завершённой или отменённой заявки');
    }

    const [updatedRequest] = await this.prisma.$transaction([
      this.prisma.requestOrder.update({
        where: { id: requestId },
        data: { status: dto.status },
        include: { items: true, statusHistory: true },
      }),
      this.prisma.requestStatusHistory.create({
        data: {
          requestOrderId: requestId,
          newStatus: dto.status,
          comment: dto.comment,
          changedByAdminId: adminId,
        },
      }),
    ]);

    return updatedRequest;
  }

  async addItem(requestId: string, dto: AddRequestItemDto) {
    const requestOrder = await this.prisma.requestOrder.findUnique({
      where: { id: requestId },
      include: { items: true },
    });

    if (!requestOrder) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (
      requestOrder.status === RequestStatus.CANCELLED ||
      requestOrder.status === RequestStatus.COMPLETED
    ) {
      throw new BadRequestException('Нельзя изменить завершённую или отменённую заявку');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    const existingItem = requestOrder.items.find((item: any) => item.productId === dto.productId);

    if (existingItem) {
      return this.prisma.requestOrderItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
        include: { product: true },
      });
    }

    return this.prisma.requestOrderItem.create({
      data: {
        requestOrderId: requestId,
        productId: dto.productId,
        quantity: dto.quantity,
        productNameSnapshot: product.name,
      },
      include: { product: true },
    });
  }

  async removeItem(requestId: string, productId: string) {
    const requestOrder = await this.prisma.requestOrder.findUnique({
      where: { id: requestId },
    });

    if (!requestOrder) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (
      requestOrder.status === RequestStatus.CANCELLED ||
      requestOrder.status === RequestStatus.COMPLETED
    ) {
      throw new BadRequestException('Нельзя изменить завершённую или отменённую заявку');
    }

    const item = await this.prisma.requestOrderItem.findFirst({
      where: {
        requestOrderId: requestId,
        productId,
      },
    });

    if (!item) {
      throw new NotFoundException('Позиция не найдена в заявке');
    }

    await this.prisma.requestOrderItem.delete({
      where: { id: item.id },
    });

    return { success: true };
  }

  async cancelRequest(userId: string, requestId: string) {
    const requestOrder = await this.prisma.requestOrder.findUnique({
      where: { id: requestId },
    });

    if (!requestOrder) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (requestOrder.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этой заявке');
    }

    if (requestOrder.status !== RequestStatus.NEW) {
      throw new BadRequestException('Можно отменить только заявку в статусе NEW');
    }

    const [updatedRequest] = await this.prisma.$transaction([
      this.prisma.requestOrder.update({
        where: { id: requestId },
        data: { status: RequestStatus.CANCELLED },
      }),
      this.prisma.requestStatusHistory.create({
        data: {
          requestOrderId: requestId,
          newStatus: RequestStatus.CANCELLED,
          comment: 'Отменено пользователем',
        },
      }),
    ]);

    return updatedRequest;
  }

  async getStats() {
    const counts = await this.prisma.requestOrder.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const stats: Record<string, number> = {};
    counts.forEach((item: any) => {
      stats[item.status] = item._count.id;
    });

    const total = await this.prisma.requestOrder.count();

    return { total, byStatus: stats };
  }
}

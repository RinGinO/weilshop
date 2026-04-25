import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateAdminDto,
  UpdateAdminDto,
  ChangeAdminPasswordDto,
  AdminQueryDto,
} from './dto/admin.dto';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ==================== ADMINS ====================

  async createAdmin(dto: CreateAdminDto) {
    const existing = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Admin с таким email уже существует');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const admin = await this.prisma.admin.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        roles: dto.roleIds
          ? {
              create: dto.roleIds.map((roleId) => ({
                role: { connect: { id: roleId } },
              })),
            }
          : undefined,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return admin;
  }

  async findAllAdmins(query: AdminQueryDto) {
    const { status, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (status) where.status = status;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [admins, total] = await Promise.all([
      this.prisma.admin.findMany({
        where,
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.admin.count({ where }),
    ]);

    return { page, limit, total, items: admins };
  }

  async findAdminById(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin не найден');
    }

    return admin;
  }

  async updateAdmin(id: string, dto: UpdateAdminDto) {
    const existing = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Admin не найден');
    }

    if (dto.email && dto.email !== existing.email) {
      const emailExists = await this.prisma.admin.findUnique({
        where: { email: dto.email },
      });

      if (emailExists) {
        throw new ConflictException('Email уже занят');
      }
    }

    const updateData: any = {
      name: dto.name,
      email: dto.email,
      status: dto.status,
    };

    if (dto.roleIds) {
      await this.prisma.adminRole.deleteMany({
        where: { adminId: id },
      });

      if (dto.roleIds.length > 0) {
        updateData.roles = {
          create: dto.roleIds.map((roleId: string) => ({
            role: { connect: { id: roleId } },
          })),
        };
      }
    }

    return this.prisma.admin.update({
      where: { id },
      data: updateData,
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async changeAdminPassword(id: string, dto: ChangeAdminPasswordDto) {
    const passwordHash = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.admin.update({
      where: { id },
      data: { passwordHash },
    });

    return { success: true };
  }

  async deleteAdmin(id: string) {
    const existing = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Admin не найден');
    }

    await this.prisma.admin.delete({
      where: { id },
    });

    return { success: true };
  }

  // ==================== ROLES ====================

  async createRole(dto: CreateRoleDto) {
    const existing = await this.prisma.role.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException('Роль с таким code уже существует');
    }

    return this.prisma.role.create({
      data: {
        name: dto.name,
        code: dto.code,
      },
    });
  }

  async findAllRoles() {
    return this.prisma.role.findMany({
      orderBy: { name: 'asc' },
      include: {
        admins: {
          include: {
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findRoleById(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        admins: {
          include: {
            admin: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Роль не найдена');
    }

    return role;
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    const existing = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Роль не найдена');
    }

    return this.prisma.role.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }

  async deleteRole(id: string) {
    const existing = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Роль не найдена');
    }

    await this.prisma.role.delete({
      where: { id },
    });

    return { success: true };
  }
}

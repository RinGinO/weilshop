import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  CreateAdminDto,
  UpdateAdminDto,
  ChangeAdminPasswordDto,
  AdminQueryDto,
} from './dto/admin.dto';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@Controller('admin/admins')
export class AdminsController {
  constructor(private adminService: AdminService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto);
  }

  @Get()
  async findAll(@Query() query: AdminQueryDto) {
    return this.adminService.findAllAdmins(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.findAdminById(id);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAdminDto) {
    return this.adminService.updateAdmin(id, dto);
  }

  @Post(':id/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeAdminPasswordDto,
  ) {
    return this.adminService.changeAdminPassword(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteAdmin(id);
  }
}

@Controller('admin/roles')
export class RolesController {
  constructor(private adminService: AdminService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRoleDto) {
    return this.adminService.createRole(dto);
  }

  @Get()
  async findAll() {
    return this.adminService.findAllRoles();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.findRoleById(id);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto) {
    return this.adminService.updateRole(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteRole(id);
  }
}

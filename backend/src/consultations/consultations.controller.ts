import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import {
  CreateConsultationDto,
  AssignConsultationDto,
  RespondConsultationDto,
  ConsultationQueryDto,
} from './dto/consultation.dto';
import { Public } from '../common/decorators/public.decorator';

interface RequestWithUser {
  user?: {
    userId?: string;
    adminId?: string;
    roles?: string[];
    email?: string;
  };
}

@Controller('consultations')
export class ConsultationsController {
  constructor(private consultationsService: ConsultationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async create(@Request() req: RequestWithUser, @Body() dto: CreateConsultationDto) {
    const userId = req.user?.userId || null;
    return this.consultationsService.createRequest(userId, dto);
  }

  @Get()
  async findAll(@Query() query: ConsultationQueryDto) {
    return this.consultationsService.findAll(query);
  }

  @Get('my')
  async getMyConsultations(@Request() req: RequestWithUser, @Query() query: ConsultationQueryDto) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }
    return this.consultationsService.getMyConsultations(userId, query);
  }

  @Get('assigned')
  async getAssignedConsultations(
    @Request() req: RequestWithUser,
    @Query() query: ConsultationQueryDto,
  ) {
    const adminId = req.user?.adminId || req.user?.userId;
    if (!adminId) {
      throw new Error('Требуется авторизация администратора');
    }
    return this.consultationsService.getAssignedConsultations(adminId, query);
  }

  @Get(':id')
  async findOne(@Request() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    const userId = req.user?.userId;
    const isAdmin = !!req.user?.adminId || !!req.user?.roles;
    return this.consultationsService.findOne(id, userId, isAdmin);
  }

  @Post(':id/assign')
  @HttpCode(HttpStatus.OK)
  async assign(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AssignConsultationDto) {
    return this.consultationsService.assignAdmin(id, dto.adminId);
  }

  @Patch(':id/respond')
  @HttpCode(HttpStatus.OK)
  async respond(
    @Request() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RespondConsultationDto,
  ) {
    const adminId = req.user?.adminId || req.user?.userId;
    if (!adminId) {
      throw new Error('Требуется авторизация администратора');
    }
    return this.consultationsService.respond(id, dto, adminId);
  }

  @Post(':id/close')
  @HttpCode(HttpStatus.OK)
  async close(@Request() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    const adminId = req.user?.adminId || req.user?.userId;
    if (!adminId) {
      throw new Error('Требуется авторизация администратора');
    }
    return this.consultationsService.closeRequest(id, adminId);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Request() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }
    return this.consultationsService.cancelRequest(id, userId);
  }
}

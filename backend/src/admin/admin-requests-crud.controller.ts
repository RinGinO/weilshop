import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { AdminRequestsCrudService } from './admin-requests-crud.service';
import { UpdateRequestDto, UpdateRequestStatusDto, RequestQueryDto } from './dto/request.dto';

@Controller('admin/requests')
export class AdminRequestsCrudController {
  constructor(private requestsService: AdminRequestsCrudService) {}

  @Get()
  async findAll(@Query() query: RequestQueryDto) {
    return this.requestsService.findAllRequests(query);
  }

  @Get('statistics')
  async getStatistics() {
    return this.requestsService.getRequestStatistics();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.requestsService.findRequestById(id);
  }

  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRequestStatusDto,
    @Request() req: any,
  ) {
    const adminId = req.user?.userId;
    if (!adminId) {
      throw new Error('Требуется авторизация');
    }
    return this.requestsService.updateRequestStatus(id, dto, adminId);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRequestDto,
    @Request() req: any,
  ) {
    const adminId = req.user?.userId;
    if (!adminId) {
      throw new Error('Требуется авторизация');
    }
    return this.requestsService.updateRequest(id, dto, adminId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.requestsService.deleteRequest(id);
  }
}

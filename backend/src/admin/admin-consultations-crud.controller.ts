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
import { AdminConsultationsCrudService } from './admin-consultations-crud.service';
import {
  UpdateConsultationDto,
  AssignConsultationDto,
  ConsultationQueryDto,
} from './dto/consultation.dto';

@Controller('admin/consultations')
export class AdminConsultationsCrudController {
  constructor(private consultationsService: AdminConsultationsCrudService) {}

  @Get()
  async findAll(@Query() query: ConsultationQueryDto) {
    return this.consultationsService.findAllConsultations(query);
  }

  @Get('statistics')
  async getStatistics() {
    return this.consultationsService.getConsultationStatistics();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.consultationsService.findConsultationById(id);
  }

  @Post(':id/assign')
  @HttpCode(HttpStatus.OK)
  async assign(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AssignConsultationDto) {
    return this.consultationsService.assignConsultation(id, dto);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateConsultationDto) {
    return this.consultationsService.updateConsultation(id, dto);
  }

  @Post(':id/resolve')
  @HttpCode(HttpStatus.OK)
  async resolve(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { response: string }) {
    return this.consultationsService.resolveConsultation(id, dto.response);
  }

  @Post(':id/close')
  @HttpCode(HttpStatus.OK)
  async close(@Param('id', ParseUUIDPipe) id: string) {
    return this.consultationsService.closeConsultation(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.consultationsService.deleteConsultation(id);
  }
}

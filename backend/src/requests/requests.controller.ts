import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestOrderDto, RequestQueryDto } from './dto/request.dto';

@Controller('requests')
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
    @Body() dto: CreateRequestOrderDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }

    return this.requestsService.createRequestOrder(userId, dto);
  }

  @Get()
  async findAll(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
    @Query() query: RequestQueryDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      return { page: 1, limit: 20, total: 0, items: [] };
    }

    return this.requestsService.findAllByUser(userId, query);
  }

  @Get(':id')
  async findOne(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }

    return this.requestsService.findOne(userId, id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }

    return this.requestsService.cancelRequest(userId, id);
  }

  @Get('stats')
  async getStats() {
    return this.requestsService.getStats();
  }
}

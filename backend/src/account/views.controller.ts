import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AddViewDto, ViewsQueryDto } from './dto/views.dto';

@Controller('account/views')
export class ViewsController {
  constructor(private accountService: AccountService) {}

  @Get()
  async getViews(@Request() req: any, @Query() query: ViewsQueryDto) {
    const userId = req.user?.userId;
    if (!userId) {
      return { page: 1, limit: 20, total: 0, items: [] };
    }
    return this.accountService.getViews(userId, query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addView(@Request() req: any, @Body() dto: AddViewDto) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }
    return this.accountService.addView(userId, dto);
  }

  @Delete('clear')
  @HttpCode(HttpStatus.OK)
  async clearViews(@Request() req: any) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }
    return this.accountService.clearViews(userId);
  }
}

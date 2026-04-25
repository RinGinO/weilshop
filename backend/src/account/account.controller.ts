import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/profile.dto';

@Controller('account/profile')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  async getProfile(@Request() req: any) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }
    return this.accountService.getProfile(userId);
  }

  @Patch()
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }
    return this.accountService.updateProfile(userId, dto);
  }

  @Patch('password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }
    return this.accountService.changePassword(userId, dto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@Request() req: any) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Требуется авторизация');
    }
    return this.accountService.deleteAccount(userId);
  }
}

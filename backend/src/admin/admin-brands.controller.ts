import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdminBrandsService } from './admin-brands.service';

@Controller('admin/brands')
export class AdminBrandsController {
  constructor(private brandsService: AdminBrandsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: { name: string; slug: string; description?: string; logoMediaId?: string }) {
    return this.brandsService.createBrand(dto);
  }

  @Get()
  async findAll() {
    return this.brandsService.findAllBrands();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.findBrandById(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: { name?: string; slug?: string; description?: string; logoMediaId?: string; isActive?: boolean },
  ) {
    return this.brandsService.updateBrand(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.deleteBrand(id);
  }
}

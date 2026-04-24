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
import { InstructionsService } from './instructions.service';
import {
  CreateInstructionDto,
  UpdateInstructionDto,
  InstructionQueryDto,
} from './dto/instruction.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('knowledge/instructions')
export class InstructionsController {
  constructor(private instructionsService: InstructionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateInstructionDto) {
    return this.instructionsService.create(dto);
  }

  @Get()
  @Public()
  async findAll(@Query() query: InstructionQueryDto) {
    return this.instructionsService.findAll(query);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.instructionsService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  async findBySlug(@Param('slug') slug: string) {
    return this.instructionsService.findBySlug(slug);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateInstructionDto) {
    return this.instructionsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.instructionsService.remove(id);
  }
}

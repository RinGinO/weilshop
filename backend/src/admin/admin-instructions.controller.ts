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
import { AdminInstructionsService } from './admin-instructions.service';
import { CreateInstructionDto, UpdateInstructionDto, InstructionQueryDto } from './dto/content.dto';

@Controller('admin/instructions')
export class AdminInstructionsController {
  constructor(private instructionsService: AdminInstructionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateInstructionDto) {
    return this.instructionsService.createInstruction(dto);
  }

  @Get()
  async findAll(@Query() query: InstructionQueryDto) {
    return this.instructionsService.findAllInstructions(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.instructionsService.findInstructionById(id);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateInstructionDto) {
    return this.instructionsService.updateInstruction(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.instructionsService.deleteInstruction(id);
  }
}

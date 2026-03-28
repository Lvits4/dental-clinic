import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TreatmentsService } from '../services/treatments.service';
import { CreateTreatmentDto } from '../dto/create-treatment.dto';
import { UpdateTreatmentDto } from '../dto/update-treatment.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@ApiTags('Treatments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new treatment' })
  create(@Body() createDto: CreateTreatmentDto) {
    return this.treatmentsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all treatments' })
  findAll() {
    return this.treatmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get treatment by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.treatmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update treatment' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateTreatmentDto,
  ) {
    return this.treatmentsService.update(id, updateDto);
  }

  @Patch(':id/toggle')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Toggle treatment active/inactive' })
  toggle(@Param('id', ParseUUIDPipe) id: string) {
    return this.treatmentsService.toggle(id);
  }
}

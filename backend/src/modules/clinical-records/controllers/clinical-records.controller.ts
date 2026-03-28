import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClinicalRecordsService } from '../services/clinical-records.service';
import { CreateClinicalRecordDto } from '../dto/create-clinical-record.dto';
import { UpdateClinicalRecordDto } from '../dto/update-clinical-record.dto';
import { FilterClinicalRecordDto } from '../dto/filter-clinical-record.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@ApiTags('Clinical Records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinical-records')
export class ClinicalRecordsController {
  constructor(private readonly clinicalRecordsService: ClinicalRecordsService) {}

  @Post()
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Create clinical record' })
  create(@Body() createDto: CreateClinicalRecordDto) {
    return this.clinicalRecordsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List clinical records with filters' })
  findAll(@Query() filterDto: FilterClinicalRecordDto) {
    return this.clinicalRecordsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinical record by record ID or patient ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clinicalRecordsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Update clinical record' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateClinicalRecordDto,
  ) {
    return this.clinicalRecordsService.update(id, updateDto);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClinicalEvolutionsService } from '../services/clinical-evolutions.service';
import { CreateClinicalEvolutionDto } from '../dto/create-clinical-evolution.dto';
import { FilterClinicalEvolutionDto } from '../dto/filter-clinical-evolution.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@ApiTags('Clinical Evolutions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinical-evolutions')
export class ClinicalEvolutionsController {
  constructor(private readonly evolutionsService: ClinicalEvolutionsService) {}

  @Post()
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Register a clinical evolution' })
  create(@Body() createDto: CreateClinicalEvolutionDto) {
    return this.evolutionsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List clinical evolutions with filters' })
  findAll(@Query() filterDto: FilterClinicalEvolutionDto) {
    return this.evolutionsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinical evolution by evolution ID or clinical record ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.evolutionsService.findOne(id);
  }
}

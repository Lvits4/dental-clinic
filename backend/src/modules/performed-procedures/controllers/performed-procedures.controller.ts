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
import { PerformedProceduresService } from '../services/performed-procedures.service';
import { CreatePerformedProcedureDto } from '../dto/create-performed-procedure.dto';
import { FilterPerformedProcedureDto } from '../dto/filter-performed-procedure.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@ApiTags('Performed Procedures')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('performed-procedures')
export class PerformedProceduresController {
  constructor(private readonly proceduresService: PerformedProceduresService) {}

  @Post()
  @Roles(Role.DOCTOR, Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Register a performed procedure' })
  create(@Body() createDto: CreatePerformedProcedureDto) {
    return this.proceduresService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List performed procedures with filters' })
  findAll(@Query() filterDto: FilterPerformedProcedureDto) {
    return this.proceduresService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get performed procedure by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.proceduresService.findOne(id);
  }
}

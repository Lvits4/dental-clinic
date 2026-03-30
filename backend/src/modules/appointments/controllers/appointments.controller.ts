import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from '../services/appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { RescheduleAppointmentDto } from '../dto/reschedule-appointment.dto';
import { FilterAppointmentDto } from '../dto/filter-appointment.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Create a new appointment' })
  create(@Body() createDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List appointments with filters' })
  findAll(@Query() filterDto: FilterAppointmentDto) {
    return this.appointmentsService.findAll(filterDto);
  }

  @Get('agenda')
  @ApiOperation({ summary: 'Get agenda by day/week/month' })
  getAgenda(
    @Query('doctorId') doctorId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.appointmentsService.getAgenda(doctorId, dateFrom, dateTo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Update appointment' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Change appointment status' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.appointmentsService.updateStatus(id, updateStatusDto.status);
  }

  @Patch(':id/reschedule')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Reschedule appointment' })
  reschedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() rescheduleDto: RescheduleAppointmentDto,
  ) {
    return this.appointmentsService.reschedule(id, rescheduleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Delete appointment permanently' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.remove(id);
  }
}

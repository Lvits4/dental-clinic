import { IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { AppointmentStatus } from '../../../common/enums/appointment-status.enum';

export enum AppointmentSortBy {
  DATE_TIME = 'dateTime',
  PATIENT_NAME = 'patientName',
  DOCTOR_NAME = 'doctorName',
  REASON = 'reason',
  DURATION_MINUTES = 'durationMinutes',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
}

export enum AppointmentSortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterAppointmentDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by doctor UUID' })
  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @ApiPropertyOptional({ description: 'Filter by patient UUID' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({ enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({ description: 'Start date for range filter' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'End date for range filter' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ enum: AppointmentSortBy })
  @IsOptional()
  @IsEnum(AppointmentSortBy)
  sortBy?: AppointmentSortBy;

  @ApiPropertyOptional({ enum: AppointmentSortOrder })
  @IsOptional()
  @IsEnum(AppointmentSortOrder)
  sortOrder?: AppointmentSortOrder;
}

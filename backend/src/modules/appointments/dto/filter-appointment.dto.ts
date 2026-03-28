import { IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { AppointmentStatus } from '../../../common/enums/appointment-status.enum';

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
}

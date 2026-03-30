import { IsOptional, IsUUID, IsDateString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

const PERFORMED_PROCEDURE_SORT_FIELDS = [
  'performedAt',
  'patient',
  'doctor',
  'treatment',
  'tooth',
] as const;

export type PerformedProcedureSortBy = (typeof PERFORMED_PROCEDURE_SORT_FIELDS)[number];

export class FilterPerformedProcedureDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ enum: PERFORMED_PROCEDURE_SORT_FIELDS })
  @IsOptional()
  @IsIn([...PERFORMED_PROCEDURE_SORT_FIELDS])
  sortBy?: PerformedProcedureSortBy;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

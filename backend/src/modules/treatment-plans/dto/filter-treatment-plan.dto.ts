import { IsOptional, IsString, IsEnum, IsUUID, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { TreatmentPlanStatus } from '../../../common/enums/treatment-plan-status.enum';

export enum TreatmentPlanSortBy {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  STATUS = 'status',
  ITEMS = 'items',
  CREATED_AT = 'createdAt',
}

export enum TreatmentPlanSortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterTreatmentPlanDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({ enum: TreatmentPlanStatus })
  @IsOptional()
  @IsEnum(TreatmentPlanStatus)
  status?: TreatmentPlanStatus;

  @ApiPropertyOptional({ description: 'Paciente u observaciones' })
  @IsOptional()
  @Transform(({ value }) => (value == null || value === '' ? undefined : String(value).trim()))
  @IsString()
  @MaxLength(255)
  search?: string;

  @ApiPropertyOptional({ enum: TreatmentPlanSortBy })
  @IsOptional()
  @IsEnum(TreatmentPlanSortBy)
  sortBy?: TreatmentPlanSortBy;

  @ApiPropertyOptional({ enum: TreatmentPlanSortOrder })
  @IsOptional()
  @IsEnum(TreatmentPlanSortOrder)
  sortOrder?: TreatmentPlanSortOrder;
}

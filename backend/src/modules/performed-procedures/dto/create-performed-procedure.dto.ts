import { IsUUID, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePerformedProcedureDto {
  @ApiProperty()
  @IsUUID()
  patientId: string;

  @ApiProperty()
  @IsUUID()
  doctorId: string;

  @ApiProperty()
  @IsUUID()
  treatmentId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  treatmentPlanItemId?: string;

  @ApiPropertyOptional({ example: '14' })
  @IsOptional()
  @IsString()
  tooth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '2025-06-15T10:00:00Z' })
  @IsDateString()
  @Type(() => Date)
  performedAt: Date;
}

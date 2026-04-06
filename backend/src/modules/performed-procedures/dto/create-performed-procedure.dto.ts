import { IsUUID, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({ description: 'Vincula el procedimiento al plan (sin ítem)' })
  @IsOptional()
  @IsUUID()
  treatmentPlanId?: string;

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
  performedAt: string;
}

import { IsUUID, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClinicalEvolutionDto {
  @ApiProperty({ description: 'Clinical record ID' })
  @IsUUID()
  clinicalRecordId: string;

  @ApiProperty({ description: 'Doctor ID' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ example: '2025-06-15T10:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  consultationReason: string;

  @ApiProperty()
  @IsString()
  findings: string;

  @ApiProperty()
  @IsString()
  diagnosis: string;

  @ApiProperty()
  @IsString()
  procedurePerformed: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recommendations?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observations?: string;
}

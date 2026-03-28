import { IsUUID, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClinicalEvolutionDto {
  @ApiProperty({ description: 'Clinical record ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  clinicalRecordId: string;

  @ApiProperty({ description: 'Doctor ID', example: '550e8400-e29b-41d4-a716-446655440001' })
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

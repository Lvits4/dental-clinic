import { IsUUID, IsDateString, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Patient ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'Doctor ID', example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ example: '2025-06-15T10:00:00Z' })
  @IsDateString()
  dateTime: string;

  @ApiPropertyOptional({ default: 30 })
  @IsOptional()
  @IsInt()
  @Min(15)
  durationMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

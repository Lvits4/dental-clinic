import { IsString, IsEmail, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiPropertyOptional({ description: 'ID del usuario vinculado', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ example: 'Carlos' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Rodríguez' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: 'Ortodoncia' })
  @IsString()
  specialty: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'dr.carlos@dentalclinic.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'LIC-12345' })
  @IsString()
  licenseNumber: string;
}

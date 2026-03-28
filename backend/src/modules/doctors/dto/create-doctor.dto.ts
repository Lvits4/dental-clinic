import { IsString, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
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

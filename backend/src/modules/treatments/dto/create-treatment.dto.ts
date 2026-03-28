import { IsString, IsOptional, IsNumber, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTreatmentDto {
  @ApiProperty({ example: 'Limpieza dental' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'Limpieza dental profunda con ultrasonido' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Preventivo' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 50.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultPrice?: number;
}

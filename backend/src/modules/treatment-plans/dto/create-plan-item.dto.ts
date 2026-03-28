import { IsUUID, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlanItemDto {
  @ApiProperty()
  @IsUUID()
  treatmentId: string;

  @ApiPropertyOptional({ example: '14' })
  @IsOptional()
  @IsString()
  tooth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

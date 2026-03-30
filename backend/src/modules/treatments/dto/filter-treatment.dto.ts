import { IsOptional, IsString, IsBoolean, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export enum TreatmentSortBy {
  NAME = 'name',
  CATEGORY = 'category',
  DEFAULT_PRICE = 'defaultPrice',
  CREATED_AT = 'createdAt',
}

export enum TreatmentSortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterTreatmentDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Buscar por nombre (parcial, sin distinguir mayúsculas)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ enum: TreatmentSortBy })
  @IsOptional()
  @IsEnum(TreatmentSortBy)
  sortBy?: TreatmentSortBy;

  @ApiPropertyOptional({ enum: TreatmentSortOrder })
  @IsOptional()
  @IsEnum(TreatmentSortOrder)
  sortOrder?: TreatmentSortOrder;
}

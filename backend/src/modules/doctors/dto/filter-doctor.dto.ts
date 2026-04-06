import { IsOptional, IsString, IsEnum, IsBoolean, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export enum DoctorSortBy {
  NAME = 'name',
  SPECIALTY = 'specialty',
  PHONE = 'phone',
  EMAIL = 'email',
  LICENSE_NUMBER = 'licenseNumber',
  IS_ACTIVE = 'isActive',
}

export enum DoctorSortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterDoctorDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'false = solo inactivos; omitido o true = solo activos',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value == null || value === '' ? undefined : String(value).trim()))
  @IsString()
  @MaxLength(255)
  search?: string;

  @ApiPropertyOptional({ enum: DoctorSortBy })
  @IsOptional()
  @IsEnum(DoctorSortBy)
  sortBy?: DoctorSortBy;

  @ApiPropertyOptional({ enum: DoctorSortOrder })
  @IsOptional()
  @IsEnum(DoctorSortOrder)
  sortOrder?: DoctorSortOrder;
}

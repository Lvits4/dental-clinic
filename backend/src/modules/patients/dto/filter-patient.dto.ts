import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export enum PatientSortBy {
  CREATED_AT = 'createdAt',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  NAME = 'name',
  SEX = 'sex',
  PHONE = 'phone',
  EMAIL = 'email',
}

export enum PatientSortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterPatientDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ enum: PatientSortBy })
  @IsOptional()
  @IsEnum(PatientSortBy)
  sortBy?: PatientSortBy;

  @ApiPropertyOptional({ enum: PatientSortOrder })
  @IsOptional()
  @IsEnum(PatientSortOrder)
  sortOrder?: PatientSortOrder;
}

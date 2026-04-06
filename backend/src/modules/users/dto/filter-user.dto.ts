import { IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Role } from '../../../common/enums/role.enum';

export enum UserSortBy {
  FULL_NAME = 'fullName',
  USERNAME = 'username',
  EMAIL = 'email',
  ROLE = 'role',
}

export enum UserSortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterUserDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Buscar en nombre, usuario o correo' })
  @IsOptional()
  @Transform(({ value }) => (value == null || value === '' ? undefined : String(value).trim()))
  @IsString()
  @MaxLength(255)
  search?: string;

  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ enum: UserSortBy })
  @IsOptional()
  @IsEnum(UserSortBy)
  sortBy?: UserSortBy;

  @ApiPropertyOptional({ enum: UserSortOrder })
  @IsOptional()
  @IsEnum(UserSortOrder)
  sortOrder?: UserSortOrder;
}

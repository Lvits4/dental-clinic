import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class UpdateAccountDto {
  @ApiPropertyOptional({ example: 'jperez' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @ApiPropertyOptional({ example: 'jperez@clinica.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Juan Pérez' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({ description: 'Nueva contraseña (mín. 6 caracteres)' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  newPassword?: string;

  @ApiPropertyOptional({ description: 'Obligatoria si se envía newPassword' })
  @ValidateIf((o) => o.newPassword != null && String(o.newPassword).length > 0)
  @IsString()
  @MinLength(1, { message: 'La contraseña actual es obligatoria para cambiar la contraseña' })
  currentPassword?: string;
}

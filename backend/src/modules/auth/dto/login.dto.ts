import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin01', description: 'Username or email' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'SecurePass123' })
  @IsString()
  @MinLength(6)
  password: string;
}

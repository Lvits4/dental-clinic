import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateTreatmentDto } from './create-treatment.dto';

export class UpdateTreatmentDto extends PartialType(CreateTreatmentDto) {
  @ApiPropertyOptional({ description: 'Activate or deactivate treatment', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

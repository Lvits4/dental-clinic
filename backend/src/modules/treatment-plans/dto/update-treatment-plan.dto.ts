import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateTreatmentPlanDto } from './create-treatment-plan.dto';
import { TreatmentPlanStatus } from '../../../common/enums/treatment-plan-status.enum';

export class UpdateTreatmentPlanDto extends PartialType(CreateTreatmentPlanDto) {
  @ApiPropertyOptional({ enum: TreatmentPlanStatus })
  @IsOptional()
  @IsEnum(TreatmentPlanStatus)
  status?: TreatmentPlanStatus;
}

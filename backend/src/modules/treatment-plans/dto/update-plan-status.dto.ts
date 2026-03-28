import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TreatmentPlanStatus } from '../../../common/enums/treatment-plan-status.enum';

export class UpdatePlanStatusDto {
  @ApiProperty({ enum: TreatmentPlanStatus })
  @IsEnum(TreatmentPlanStatus)
  status: TreatmentPlanStatus;
}

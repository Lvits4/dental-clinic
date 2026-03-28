import { PartialType } from '@nestjs/swagger';
import { CreateTreatmentPlanDto } from './create-treatment-plan.dto';

export class UpdateTreatmentPlanDto extends PartialType(CreateTreatmentPlanDto) {}

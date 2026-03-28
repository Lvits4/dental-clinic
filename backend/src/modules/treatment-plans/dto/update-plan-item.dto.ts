import { PartialType } from '@nestjs/swagger';
import { CreatePlanItemDto } from './create-plan-item.dto';

export class UpdatePlanItemDto extends PartialType(CreatePlanItemDto) {}

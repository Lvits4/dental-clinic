import { PartialType } from '@nestjs/swagger';
import { CreatePerformedProcedureDto } from './create-performed-procedure.dto';

/** Actualización parcial; `treatmentPlanId` / `treatmentPlanItemId` pueden enviarse o anularse con `null`. */
export class UpdatePerformedProcedureDto extends PartialType(CreatePerformedProcedureDto) {}

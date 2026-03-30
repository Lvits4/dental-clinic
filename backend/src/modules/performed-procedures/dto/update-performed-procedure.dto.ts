import { PartialType } from '@nestjs/swagger';
import { CreatePerformedProcedureDto } from './create-performed-procedure.dto';

/** Actualización parcial; la vinculación al plan no se modifica por PATCH. */
export class UpdatePerformedProcedureDto extends PartialType(CreatePerformedProcedureDto) {}

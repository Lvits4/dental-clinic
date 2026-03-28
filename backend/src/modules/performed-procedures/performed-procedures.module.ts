import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformedProcedure } from './entities/performed-procedure.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Treatment } from '../treatments/entities/treatment.entity';
import { TreatmentPlanItem } from '../treatment-plans/entities/treatment-plan-item.entity';
import { PerformedProceduresService } from './services/performed-procedures.service';
import { PerformedProceduresController } from './controllers/performed-procedures.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PerformedProcedure, Patient, Doctor, Treatment, TreatmentPlanItem])],
  controllers: [PerformedProceduresController],
  providers: [PerformedProceduresService],
  exports: [PerformedProceduresService],
})
export class PerformedProceduresModule {}

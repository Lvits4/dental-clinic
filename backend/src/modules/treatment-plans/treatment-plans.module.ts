import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreatmentPlan } from './entities/treatment-plan.entity';
import { TreatmentPlanItem } from './entities/treatment-plan-item.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Treatment } from '../treatments/entities/treatment.entity';
import { PerformedProcedure } from '../performed-procedures/entities/performed-procedure.entity';
import { TreatmentPlansService } from './services/treatment-plans.service';
import { TreatmentPlansController } from './controllers/treatment-plans.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TreatmentPlan, TreatmentPlanItem, Patient, Doctor, Treatment, PerformedProcedure]),
  ],
  controllers: [TreatmentPlansController],
  providers: [TreatmentPlansService],
  exports: [TreatmentPlansService],
})
export class TreatmentPlansModule {}

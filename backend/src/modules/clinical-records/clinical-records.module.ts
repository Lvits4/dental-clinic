import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalRecord } from './entities/clinical-record.entity';
import { ClinicalRecordsService } from './services/clinical-records.service';
import { ClinicalRecordsController } from './controllers/clinical-records.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicalRecord])],
  controllers: [ClinicalRecordsController],
  providers: [ClinicalRecordsService],
  exports: [ClinicalRecordsService],
})
export class ClinicalRecordsModule {}

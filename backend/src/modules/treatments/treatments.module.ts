import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treatment } from './entities/treatment.entity';
import { TreatmentsService } from './services/treatments.service';
import { TreatmentsController } from './controllers/treatments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Treatment])],
  controllers: [TreatmentsController],
  providers: [TreatmentsService],
  exports: [TreatmentsService],
})
export class TreatmentsModule {}

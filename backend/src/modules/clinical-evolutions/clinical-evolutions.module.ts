import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalEvolution } from './entities/clinical-evolution.entity';
import { ClinicalEvolutionsService } from './services/clinical-evolutions.service';
import { ClinicalEvolutionsController } from './controllers/clinical-evolutions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicalEvolution])],
  controllers: [ClinicalEvolutionsController],
  providers: [ClinicalEvolutionsService],
  exports: [ClinicalEvolutionsService],
})
export class ClinicalEvolutionsModule {}

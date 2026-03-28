import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ClinicalFile } from './entities/clinical-file.entity';
import { ClinicalFilesService } from './services/clinical-files.service';
import { ClinicalFilesController } from './controllers/clinical-files.controller';
import { FileStorageService } from './services/file-storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClinicalFile]),
    MulterModule.register({
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  ],
  controllers: [ClinicalFilesController],
  providers: [ClinicalFilesService, FileStorageService],
  exports: [ClinicalFilesService],
})
export class ClinicalFilesModule {}

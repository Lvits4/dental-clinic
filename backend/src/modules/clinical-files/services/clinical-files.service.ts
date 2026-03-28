import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalFile } from '../entities/clinical-file.entity';
import { FileStorageService } from './file-storage.service';
import { FilterFileDto } from '../dto/filter-file.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

@Injectable()
export class ClinicalFilesService {
  constructor(
    @InjectRepository(ClinicalFile)
    private readonly fileRepository: Repository<ClinicalFile>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async upload(
    file: Express.Multer.File,
    patientId: string,
    uploadedBy: string,
    clinicalEvolutionId?: string,
  ): Promise<ClinicalFile> {
    const uploadResult = await this.fileStorageService.upload(file);

    const clinicalFile = this.fileRepository.create({
      patientId,
      clinicalEvolutionId,
      fileName: uploadResult.fileName,
      fileKey: uploadResult.fileKey,
      fileType: file.originalname.split('.').pop(),
      mimeType: uploadResult.mimeType,
      fileSize: uploadResult.fileSize,
      uploadedBy,
    });

    return this.fileRepository.save(clinicalFile);
  }

  async findAll(filterDto: FilterFileDto): Promise<PaginatedResponseDto<ClinicalFile>> {
    const { page = 1, limit = 10, patientId, clinicalEvolutionId } = filterDto;
    const query = this.fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.patient', 'patient')
      .leftJoinAndSelect('file.uploader', 'uploader');

    if (patientId) {
      query.andWhere('file.patient_id = :patientId', { patientId });
    }
    if (clinicalEvolutionId) {
      query.andWhere('file.clinical_evolution_id = :clinicalEvolutionId', { clinicalEvolutionId });
    }

    query.orderBy('file.created_at', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, totalItems] = await query.getManyAndCount();
    return new PaginatedResponseDto(data, totalItems, page, limit);
  }

  async findOne(id: string): Promise<ClinicalFile> {
    const file = await this.fileRepository.findOne({
      where: { id },
      relations: ['patient', 'uploader'],
    });
    if (!file) {
      throw new NotFoundException(`Clinical file with ID ${id} not found`);
    }
    return file;
  }

  async getFilePath(id: string): Promise<{ path: string; fileName: string; mimeType: string }> {
    const file = await this.findOne(id);
    return {
      path: this.fileStorageService.getFilePath(file.fileKey),
      fileName: file.fileName,
      mimeType: file.mimeType,
    };
  }

  async remove(id: string): Promise<void> {
    const file = await this.findOne(id);
    await this.fileStorageService.delete(file.fileKey);
    await this.fileRepository.remove(file);
  }
}

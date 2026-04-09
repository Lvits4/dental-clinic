import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  fileKey: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
}

@Injectable()
export class FileStorageService {
  private uploadPath: string;

  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get<string>('UPLOAD_PATH', './uploads');
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File): Promise<UploadResult> {
    const ext = path.extname(file.originalname);
    const fileKey = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadPath, fileKey);

    let buffer: Buffer;
    if (file.buffer != null && Buffer.isBuffer(file.buffer)) {
      buffer = file.buffer;
    } else if (file.path) {
      buffer = fs.readFileSync(file.path);
    } else {
      throw new BadRequestException('No se pudo leer el contenido del archivo');
    }

    fs.writeFileSync(filePath, buffer);

    return {
      fileKey,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
    };
  }

  async delete(fileKey: string): Promise<void> {
    const filePath = path.join(this.uploadPath, fileKey);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }

  getFilePath(fileKey: string): string {
    return path.join(this.uploadPath, fileKey);
  }
}

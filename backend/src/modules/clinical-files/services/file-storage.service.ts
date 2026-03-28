import { Injectable } from '@nestjs/common';
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

    fs.writeFileSync(filePath, file.buffer);

    return {
      fileKey,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
    };
  }

  async delete(fileKey: string): Promise<void> {
    const filePath = path.join(this.uploadPath, fileKey);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getFilePath(fileKey: string): string {
    return path.join(this.uploadPath, fileKey);
  }
}

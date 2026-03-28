import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseUUIDPipe,
  Res,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { ClinicalFilesService } from '../services/clinical-files.service';
import { UploadFileDto } from '../dto/upload-file.dto';
import { FilterFileDto } from '../dto/filter-file.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Clinical Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinical-files')
export class ClinicalFilesController {
  constructor(private readonly filesService: ClinicalFilesService) {}

  @Post('upload')
  @Roles(Role.DOCTOR, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a clinical file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        patientId: { type: 'string', format: 'uuid' },
        clinicalEvolutionId: { type: 'string', format: 'uuid' },
      },
      required: ['file', 'patientId'],
    },
  })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadFileDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.filesService.upload(
      file,
      uploadDto.patientId,
      userId,
      uploadDto.clinicalEvolutionId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List clinical files with filters' })
  findAll(@Query() filterDto: FilterFileDto) {
    return this.filesService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinical file details' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.filesService.findOne(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download a clinical file' })
  async download(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const fileInfo = await this.filesService.getFilePath(id);
    res.setHeader('Content-Type', fileInfo.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.fileName}"`);
    res.sendFile(fileInfo.path, { root: '.' });
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a clinical file' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.filesService.remove(id);
  }
}

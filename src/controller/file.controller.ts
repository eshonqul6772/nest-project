import { Controller, Post, UseInterceptors, UploadedFile, Get, Res, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '@services/file.service';

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is required');
    }
    return await this.fileService.uploadFile(file);
  }

  @Get(':id')
  async getFile(@Param('id') id: number) {
    return await this.fileService.getFileById(id);
  }

  @Get('download/:uuid')
  async downloadFile(@Param('uuid') uuid: string, @Res() res: any) {
    const file = await this.fileService.getFileByUuid(uuid);

    res.set({
      'Content-Type': file.contentType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.name}"`,
      'Content-Length': file.size.toString(),
    });

    return res.sendFile(file.uploadPath, { root: process.cwd() });
  }
}

import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpStatus } from '@nestjs/common';

import { STATUS } from '@utils/enum';

import { FileEntity } from '@entities/file.entity';
import { BaseResponse } from '@common/base.response';
import { DbExceptions } from '@common/exceptions/db.exception';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}


  async uploadFile(file: Express.Multer.File): Promise<BaseResponse<any>> {
    try {
      // Fayl ma'lumotlarini FileEntity ga saqlash
      const fileEntity = new FileEntity();
      fileEntity.status = STATUS.ACTIVE;
      fileEntity.contentType = file.mimetype; // Masalan, image/jpeg
      fileEntity.extension = extname(file.originalname).replace('.', ''); // .jpg -> jpg
      fileEntity.name = file.originalname; // Asl fayl nomi
      fileEntity.size = file.size; // Fayl hajmi (bytes)
      fileEntity.type = 'ACTIVE';
      fileEntity.uploadPath = file.path; // Fayl yo‘li (masalan, upload/files/file-123456789.jpg)
      fileEntity.uuid = uuidv4(); // Unikal UUID generatsiyasi

      const savedFile = await this.fileRepository.save(fileEntity);

      return {
        status: HttpStatus.OK,
        message: 'File uploaded successfully',
        data: {
          createdAt: savedFile.createdAt,
          updatedAt: savedFile.updatedAt,
          status: savedFile.status,
          id: savedFile.id,
          name: savedFile.name,
          extension: savedFile.extension,
          size: savedFile.size,
          uuid: savedFile.uuid,
          type: savedFile.type,
        },
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async getFileById(id: number): Promise<BaseResponse<any>> {
    try {
      const file = await this.fileRepository.findOne({ where: { id } });
      if (!file) {
        throw new Error('File not found');
      }

      const filePath = join(process.cwd(), file.uploadPath);
      if (!existsSync(filePath)) {
        throw new Error('File does not exist on server');
      }

      return {
        status: HttpStatus.OK,
        message: 'File retrieved successfully',
        data: {
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
          status: file.status,
          id: file.id,
          name: file.name,
          extension: file.extension,
          size: file.size,
          uuid: file.uuid,
          type: file.type,
        },
      };
    } catch (error) {
      throw DbExceptions.handle(error);
    }
  }

  async getFileByUuid(uuid: string): Promise<FileEntity> {
    try {
      const file = await this.fileRepository.findOne({ where: { uuid } });
      if (!file) {
        throw new Error('File does not exist on server');
      }

      // Fayl yo‘li bo‘sh yoki undefined bo‘lsa
      if (!file.uploadPath) {
        throw new Error('File does not exist on server');
      }

      // Yo‘lni standartlashtirish (Windows/Linux moslashuvi uchun)
      const normalizedPath = file.uploadPath.replace(/\\/g, '/');
      const filePath = join(process.cwd(), normalizedPath);

      if (!existsSync(filePath)) {
        throw new Error('File does not exist on server');
      }

      return file;
    } catch (error) {
      throw DbExceptions.handle(error);
    }
  }
}

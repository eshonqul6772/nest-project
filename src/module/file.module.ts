import { extname } from 'path';
import { diskStorage } from 'multer';
import { Module } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { FileEntity } from '@entities/file.entity';
import { FileController } from '@controller/file.controller';
import { FileService } from '@services/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = './upload/files'; // Fayllarni saqlash uchun papka
          if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true }); // Agar papka mavjud bo‘lmasa, yaratamiz
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname); // Fayl kengaytmasi (masalan, .jpg)
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Fayl nomi: file-123456789.jpg
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // Maksimal fayl hajmi: 5MB
      },
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}

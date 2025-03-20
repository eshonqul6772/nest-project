import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const generateFilename = (file: Express.Multer.File): string =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${extname(file.originalname)}`;

export const multerOptions = {
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Faqat JPG, PNG yoki GIF fayllar qo'llab-quvvatlanadi`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
      const uploadPath = resolve('upload/avatars');
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (_req: any, file: Express.Multer.File, cb: any) => {
      cb(null, generateFilename(file));
    },
  }),
};

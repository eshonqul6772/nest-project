import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { HttpStatus, Logger } from '@nestjs/common';

import { bcryptSaltOrRounds } from './constants';

const logger = new Logger('Helper');

export const jwtHelper = {
  sign(data: { id: number }) {
    try {
      return jwt.sign(data, process.env.JWT_KEY);
    } catch (error) {
      return new Error(error);
    }
  },

  verify(data: string) {
    try {
      return jwt.verify(data, process.env.JWT_KEY);
    } catch (error) {
      return new Error(error);
    }
  },
};
export const bcryptHelper = {
  async hash(passwd: string): Promise<string> {
    return await bcrypt.hash(passwd, bcryptSaltOrRounds);
  },
  async isMatch(hashedPasswd: string, passwd: string): Promise<boolean> {
    return bcrypt.compare(passwd, hashedPasswd);
  },
};

export function logErrorIfNoHttpError(err) {
  if (err.code > 511) {
    logger.error(`[${err}]`);
  }
}

export function getStatusCode(err) {
  logErrorIfNoHttpError(err);
  return err.code > 511 ? HttpStatus.INTERNAL_SERVER_ERROR : err.code;
}

export function formatDate(date: Date): string {
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}-${date.getFullYear()} ${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
    .getMilliseconds()
    .toString()
    .padStart(2, '0')}`;
}

export function extractDate(date: string): Date {
  if (isNaN(Date.parse(date))) {
    const [day, month, year] = date.split('-');
    return new Date(+year, +month - 1, +day);
  }

  const time = new Date(date);
  return new Date(time.getFullYear(), time.getMonth(), time.getDate());
}

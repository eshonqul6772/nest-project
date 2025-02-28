import { SetMetadata } from '@nestjs/common';

export const PUBLIC_FIELDS = 'publicFields';
export const PublicFields = (...fields: string[]) => SetMetadata(PUBLIC_FIELDS, fields);

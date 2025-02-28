import { SetMetadata } from '@nestjs/common';

import { Permissions } from '@utils/enum';

export const Permission = (...permissions: Permissions[]) =>
  SetMetadata('permissions', permissions);

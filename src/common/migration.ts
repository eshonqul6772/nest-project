import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { RolesEntity } from '@entities/role.entity';
import { UsersEntity } from '@entities/users.entity';
import { RolePermissionEntity } from '@entities/role-permissions.entity';

import { Permissions } from '@utils/enum';

export async function seedDatabase(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(RolesEntity);
  const rolePermRepo = dataSource.getRepository(RolePermissionEntity);
  const userRepo = dataSource.getRepository(UsersEntity);

  const existingUser = await userRepo.findOne({ where: {} });
  const existingRole = await roleRepo.findOne({ where: {} });
  if (existingUser || existingRole) {
    return;
  }

  const permissions = Object.values(Permissions);

  const savedRole = roleRepo.create({
    name: 'admin',
    permissions: permissions,
    description: 'Admin role',
  });

  await roleRepo.save(savedRole);

  const rolePermissions = permissions.map(perm =>
    rolePermRepo.create({ role: savedRole, permission: perm }),
  );
  await rolePermRepo.save(rolePermissions);

  const hashedPassword = await bcrypt.hash('admin', 10);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const adminUser = userRepo.create({
    username: 'admin',
    firstName: 'Admin',
    lastName: 'Admin',
    password: hashedPassword,
    role: savedRole.id,
  });

  await userRepo.save(adminUser);
}

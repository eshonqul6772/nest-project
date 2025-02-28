import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RolesEntity } from '@entities/role.entity';

import { Permissions } from '@utils/enum';

@Entity('role_permissions')
export class RolePermissionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: Permissions })
  permission: Permissions;

  @ManyToOne(() => RolesEntity, { onDelete: 'CASCADE' })
  role: RolesEntity;
}

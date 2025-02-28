import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';

import { GeneralEntity } from '@common/base.entity';
import { RolePermissionEntity } from './role-permissions.entity';

import { Permissions, STATUS } from '@utils/enum';

import { PublicFields } from '@utils/public-fields.decorator';

@Entity('roles')
@PublicFields('id', 'name', 'permissions', 'description', 'createdAt', 'updatedAt', 'status')
export class RolesEntity extends GeneralEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('enum', {
    enum: Permissions,
    array: true,
    default: [],
  })
  permissions: Permissions[];

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => RolePermissionEntity, rp => rp.role)
  rolePermissions: RolePermissionEntity[];

  @Column({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE })
  status: STATUS;
}

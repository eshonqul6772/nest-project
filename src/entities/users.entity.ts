import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RolesEntity } from './role.entity';
import { GeneralEntity } from '@common/base.entity';

import { STATUS } from '@utils/enum';
import { PublicFields } from '@utils/public-fields.decorator';

@Entity('users')
@PublicFields(
  'id',
  'firstName',
  'lastName',
  'username',
  'status',
  'createdAt',
  'updatedAt',
  'role',
  'photoId',
)
export class UsersEntity extends GeneralEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', name: 'firstName', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', name: 'lastName', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', name: 'username', nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', name: 'password', nullable: false })
  password: string;

  @Column({ type: 'bigint', name: 'photoId', nullable: true })
  photoId: number;

  @Column({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE })
  status: STATUS;

  @ManyToOne(() => RolesEntity, { nullable: false, eager: true })
  role: RolesEntity;
}

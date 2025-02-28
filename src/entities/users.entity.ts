import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RolesEntity } from './role.entity';
import { GeneralEntity } from '@common/base.entity';

import { STATUS } from '@utils/enum';
import { PublicFields } from '@utils/public-fields.decorator';

@Entity('users')
@PublicFields('id', 'firstName', 'lastName', 'username', 'status', 'createdAt', 'updatedAt', 'role')
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

  @Column({ type: 'varchar', name: 'image', nullable: true })
  image: string;

  @Column({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE })
  status: STATUS;

  @ManyToOne(() => RolesEntity, { nullable: false, eager: true })
  role: RolesEntity;
}

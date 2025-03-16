import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { GeneralEntity } from '@common/base.entity';

import { STATUS } from '@utils/enum';

@Entity('file')
export class FileEntity extends GeneralEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  extension: string;

  @Column({ type: 'bigint', nullable: true })
  size: number;

  @Column({ type: 'varchar', nullable: true })
  contentType: string;

  @Column({ type: 'uuid', nullable: true })
  uuid: string;

  @Column({ type: 'varchar', default: 'ACTIVE' })
  type: string;

  @Column({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE })
  status: STATUS;

  @Column({ type: 'character varying', nullable: true })
  uploadPath: string;
}

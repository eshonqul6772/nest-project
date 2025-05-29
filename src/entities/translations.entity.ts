import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { GeneralEntity } from '@common/base.entity';

import { LANG, LANG_TYPE, STATUS } from '@utils/enum';
import { PublicFields } from '@utils/public-fields.decorator';

@Entity('translation')
@PublicFields('id', 'tag', 'types', 'name', 'status', 'createdAt', 'updatedAt')
export class TranslationsEntity extends GeneralEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false })
  tag: string;

  @Column({ type: 'enum', enum: LANG_TYPE, array: true })
  types: LANG_TYPE[];

  @Column({ type: 'json', name: 'name', nullable: false })
  name: LANG;

  @Column({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE })
  status: STATUS;
}

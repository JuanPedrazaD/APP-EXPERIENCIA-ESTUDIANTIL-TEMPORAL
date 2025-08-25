import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('BAS_TERCERO', { schema: 'SINU' })
export class UserInfoEntity {
  @PrimaryColumn({
    name: 'NUM_IDENTIFICACION',
    type: 'varchar2',
    length: 30,
    nullable: false,
  })
  document: string;

  @Column({
    name: 'DIR_EMAIL',
    type: 'varchar2',
    length: 100,
  })
  email: string;

  @Column({
    name: 'NOM_LARGO',
    type: 'varchar2',
    length: 1000,
    nullable: false,
  })
  fullName: string;

  @Column({
    name: 'NOM_TERCERO',
    type: 'varchar2',
    length: 250,
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'PRI_APELLIDO',
    type: 'varchar2',
    length: 250,
    nullable: false,
  })
  lastName: string;

  @Column({
    name: 'GEN_TERCERO',
    type: 'varchar2',
    length: 6,
    nullable: false,
  })
  StudentGender: string;
}

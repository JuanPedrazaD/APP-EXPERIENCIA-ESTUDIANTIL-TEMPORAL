import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'grupos_usuarios' })
export class UserGroupsEntity {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'grupo', length: 255, nullable: false })
  group: string;

  @Column({ name: 'estado', type: 'int' })
  state: number;
}

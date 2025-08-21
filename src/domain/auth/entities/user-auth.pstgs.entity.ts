import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'USUARIOS' })
export class UserAuthEntity {
  @PrimaryColumn({ name: 'ID', type: 'int' }) // Se maneja con una secuencia en Oracle
  id: number;

  @Column({ name: 'USERNAME', length: 150, unique: true })
  username: string;

  @Column({ name: 'PASSWORD', length: 255 })
  password: string;
}

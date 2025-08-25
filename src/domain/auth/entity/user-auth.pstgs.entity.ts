import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserAuthEntity {
  @PrimaryColumn({ name: 'id', type: 'int' }) // Se maneja con una secuencia en Oracle
  id: number;

  @Column({ name: 'username', length: 150 })
  username: string;

  @Column({ name: 'password', length: 255 })
  password: string;
}

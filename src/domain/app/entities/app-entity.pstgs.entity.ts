import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'apps' })
export class AppEntity {
  @PrimaryColumn({ name: 'id', type: 'int' }) // Se maneja con una secuencia en Oracle
  id: number;

  @Column({ name: 'nombre', length: 255, unique: true, nullable: false })
  appName: string;

  @Column({ name: 'descripcion', length: 255, unique: true })
  appDescription: string;

  @Column({ name: 'estado', type: 'int' })
  state: number;

  @Column({ name: 'fecha_creacion', type: 'timestamp' })
  creationDate: Date;
}

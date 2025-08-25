import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'apps' })
export class AppEntity {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'nombre', length: 255, nullable: false })
  appName: string;

  @Column({ name: 'descripcion', length: 255 })
  appDescription: string;

  @Column({ name: 'estado', type: 'int' })
  state: number;

  @Column({ name: 'fecha_creacion', type: 'timestamp' })
  creationDate: Date;
}

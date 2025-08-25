import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tipo_dispositivo' })
export class DeviceTypeEntity {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'nombre', length: 255, nullable: false })
  deviceName: string;

  @Column({ name: 'estado', type: 'int' })
  deviceState: number;

  @Column({ name: 'fecha_creacion', type: 'timestamp' })
  creationDate: Date;
}

import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'historial_notificaciones' })
export class NotificationHistoryEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'titulo', length: 255, nullable: false })
  title: string;

  @Column({ name: 'mensaje', length: 1000, nullable: false })
  message: string;

  @Column({ name: 'app_id', type: 'int' })
  appId: number;

  @Column({ name: 'tipo_envio', length: 50 })
  send_type: string;

  @Column({ name: 'imagen_url', length: 500 })
  urlImage: string;

  @Column({ name: 'creado_por', length: 500 })
  createdBy: string;

  @Column({ name: 'fecha_programada', type: 'timestamptz' })
  programatedDate: Date;
}

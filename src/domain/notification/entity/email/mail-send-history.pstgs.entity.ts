import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'historial_envios_mail' })
export class MailSendHistoryEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'notificacion_id', type: 'int' })
  notificationId: number;

  @Column({ name: 'app_id', type: 'int' })
  appId: number;

  @Column({ name: 'estado_envio', length: 50 })
  sendState: string;
}

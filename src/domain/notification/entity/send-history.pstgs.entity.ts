import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'historial_envios' })
export class SendHistoryEntity {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'notificacion_id', type: 'int' })
  notificationId: number;

  @Column({ name: 'fcm_token_id', type: 'int' })
  tokenId: number;

  @Column({ name: 'estado_envio', length: 50 })
  sendState: string;

  @Column({ name: 'anotaciones', length: 500 })
  anotations: string;
}

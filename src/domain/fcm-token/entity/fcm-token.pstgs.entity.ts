import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'fcm_token_usuario' })
export class FcmTokenEntity {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'fcm_token', length: 500 })
  fcmToken: string;

  @Column({ name: 'app_id', type: 'int' })
  appId: number;

  @Column({ name: 'tipo_dispositivo_id', type: 'int' })
  deviceTypeId: number;

  @Column({ name: 'numero_identificacion', type: 'varchar' })
  document: string;

  @Column({ name: 'correo_electronico', type: 'varchar' })
  email: string;

  @Column({ name: 'fecha_registro', type: 'timestamp' })
  registerDate: Date;

  @Column({ name: 'fecha_modificacion', type: 'timestamp' })
  modificationDate: Date;

  @Column({ name: 'estado', type: 'int' })
  state: number;
}

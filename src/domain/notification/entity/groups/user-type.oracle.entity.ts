import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('SRC_ALUM_PROGRAMA', { schema: 'SINU' })
export class StudentProgramEntity {
  @PrimaryColumn({ name: 'ID_ALUM_PROGRAMA', type: 'number' })
  studentProgramId: number;

  @Column({ name: 'ID_TERCERO', type: 'number' })
  thirdId: number;

  @Column({ name: 'COD_UNIDAD', type: 'varchar', length: 5 })
  unitCode: string;

  @Column({ name: 'COD_PENSUM', type: 'varchar', length: 5 })
  pensumCode: string;

  @Column({ name: 'COD_PERIODO', type: 'varchar', length: 5 })
  periodCode: string;

  @Column({ name: 'EST_ALUMNO', type: 'varchar', length: 6 })
  studentState: number;
}

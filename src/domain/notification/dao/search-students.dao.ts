import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { DataSource } from 'typeorm';

import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';
import { SearchUserInterface } from '../interface/search/search-student.interface';

@Injectable()
export class SearchStudentsDao {
  constructor(
    @Inject('DATA_SOURCE_ORACLE') private readonly dataSource: DataSource,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async *searchStudentsPaginated(
    groupId: number,
    batchSize = 5000,
  ): AsyncGenerator<SearchUserInterface[]> {
    try {
      let offset = 0;

      while (true) {
        const query = `
        SELECT NUM_IDENTIFICACION, DIR_EMAIL, EST_ALUMNO, FEC_CREACION
        FROM (
            SELECT bt.NUM_IDENTIFICACION, bt.DIR_EMAIL, sap.EST_ALUMNO, sap.FEC_CREACION,
                   ROW_NUMBER() OVER (PARTITION BY bt.NUM_IDENTIFICACION ORDER BY sap.FEC_CREACION DESC) AS rn
            FROM sinu.src_alum_programa sap
            INNER JOIN sinu.bas_tercero bt ON bt.ID_TERCERO = sap.ID_TERCERO
            WHERE sap.est_alumno = :1
        )
        WHERE rn = 1
        OFFSET :2 ROWS FETCH NEXT :3 ROWS ONLY
      `;

        const result: SearchUserInterface[] = await this.dataSource.query<
          SearchUserInterface[]
        >(query, [groupId, offset, batchSize]);

        if (result.length === 0) break;

        yield result;

        offset += batchSize;
      }
    } catch (e) {
      const message = `Error al obtener estudiantes paginados: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}

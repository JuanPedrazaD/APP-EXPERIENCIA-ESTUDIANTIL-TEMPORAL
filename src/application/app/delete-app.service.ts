import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { AppEntity } from 'src/domain/app/entity/app.pstgs.entity';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';

@Injectable()
export class DeleteAppService {
  constructor(
    @Inject('APP_REPOSITORY')
    private readonly appRepository: Repository<AppEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async deleteApp(appId: number): Promise<void> {
    try {
      const app: AppEntity | null = await this.appRepository.findOne({
        where: {
          id: appId,
        },
      });

      if (!app) {
        throw new NotFoundException(
          `No se encontró una aplicación con el id ${appId}`,
        );
      }

      if (app.state == 0) {
        throw new ConflictException('la aplicación ya se encuentra inactiva');
      }

      await this.appRepository.update({ id: appId }, { state: 0 });
    } catch (e) {
      const message = `Ocurrió un error al eliminar la aplicación: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { AppEntity } from 'src/domain/app/entities/app-entity.pstgs.entity';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';

@Injectable()
export class ShowAllAppsService {
  constructor(
    @Inject('APP_REPOSITORY')
    private readonly appRepository: Repository<AppEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async showAllApps(): Promise<AppEntity[]> {
    try {
      return await this.appRepository.find();
    } catch (e) {
      const message = `Ocurrió un error al encontrar las aplicaciones: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}

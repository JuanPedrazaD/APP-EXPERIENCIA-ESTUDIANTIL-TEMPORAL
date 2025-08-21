import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { AppEntity } from 'src/domain/app/entities/app-entity.pstgs.entity';

@Injectable()
export class DeleteAppService {
  constructor(
    @Inject('APP_REPOSITORY')
    private readonly appRepository: Repository<AppEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async deleteApp(appId: number) {
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

    await this.appRepository.update();
  }
}

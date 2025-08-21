import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { AppEntity } from 'src/domain/app/entities/app-entity.pstgs.entity';

@Injectable()
export class ShowAllAppsService {
  constructor(
    @Inject('APP_REPOSITORY')
    private readonly appRepository: Repository<AppEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async showAllApps(): Promise<AppEntity[]> {
    return await this.appRepository.find();
  }
}

import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { CreateAppRequestDto } from 'src/domain/app/dtos/create-app-request.dto';
import { AppEntity } from 'src/domain/app/entities/app-entity.pstgs.entity';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';

@Injectable()
export class SaveAppService {
  constructor(
    @Inject('APP_REPOSITORY')
    private readonly appRepository: Repository<AppEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async saveApp(createAppRequestDto: CreateAppRequestDto): Promise<void> {
    try {
      const alreadyRegistered: AppEntity | null =
        await this.appRepository.findOne({
          where: {
            appName: createAppRequestDto.name,
            appDescription: createAppRequestDto.description,
          },
        });

      if (alreadyRegistered) {
        throw new ConflictException(
          'La plataforma ya ha sido registrada anteiormente',
        );
      }

      await this.appRepository.save({
        appName: createAppRequestDto.name,
        appDescription: createAppRequestDto.description,
        state: createAppRequestDto.state,
      });
    } catch (e) {
      const message = `Ocurrió un error al guardar la aplicación: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}

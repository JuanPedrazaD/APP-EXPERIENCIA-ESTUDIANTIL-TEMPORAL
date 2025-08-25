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
import { UpdateAppRequestDto } from 'src/domain/app/dto/update-app-request.dto';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';

@Injectable()
export class UpdateAppService {
  constructor(
    @Inject('APP_REPOSITORY')
    private readonly appRepository: Repository<AppEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async updateApp(updateAppRequestDto: UpdateAppRequestDto) {
    try {
      const app: AppEntity | null = await this.appRepository.findOne({
        where: {
          id: updateAppRequestDto.appId,
        },
      });

      if (!app) {
        throw new NotFoundException(
          `No se encontró una aplicación con el id ${updateAppRequestDto.appId}`,
        );
      }

      if (
        app.appName == updateAppRequestDto.name &&
        app.appDescription == updateAppRequestDto.description &&
        app.state == updateAppRequestDto.state
      ) {
        throw new ConflictException(
          'Ya existe una aplicación con los mismos parámetros',
        );
      }

      await this.appRepository.update(
        { id: updateAppRequestDto.appId },
        {
          appName: updateAppRequestDto.name,
          appDescription: updateAppRequestDto.description,
          state: updateAppRequestDto.state,
        },
      );
    } catch (e) {
      const message = `Ocurrió un error al actualizar la aplicación: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}

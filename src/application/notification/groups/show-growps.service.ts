import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { UserGroupsEntity } from 'src/domain/notification/entity/user-groups.pstgs.entity';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';

@Injectable()
export class ShowGroupsService {
  constructor(
    @Inject('USER_GROUPS_REPOSITORY')
    private readonly userGroupsRepository: Repository<UserGroupsEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getGroups(): Promise<UserGroupsEntity[]> {
    try {
      const groups: UserGroupsEntity[] = await this.userGroupsRepository.find({
        where: {
          state: 1,
        },
      });

      if (groups.length > 0) {
        throw new NotFoundException(
          'No se encontraron grupos de usuarios activos',
        );
      }

      return groups;
    } catch (e) {
      const message = `Ocurrió un error al obtener los grupos de usuarios: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}

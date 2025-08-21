import { Module } from '@nestjs/common';
import { CfmTokenController } from 'src/infrastructure/fcm-token/fcm-token.controller';

import { DatabasesModule } from 'src/infrastructure/interface/common/databases/databases.module';

@Module({
  providers: [],
  controllers: [CfmTokenController],
  imports: [DatabasesModule],
  exports: [],
})
export class CfmTokenModule {}

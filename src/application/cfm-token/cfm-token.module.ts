import { Module } from '@nestjs/common';
import { CfmTokenController } from 'src/infrastructure/fcm-token/fcm-token.controller';

import { DatabasesModule } from 'src/infrastructure/interface/common/databases/databases.module';
import { HandleTokenService } from './save-token.service';

@Module({
  providers: [HandleTokenService],
  controllers: [CfmTokenController],
  imports: [DatabasesModule],
  exports: [],
})
export class CfmTokenModule {}

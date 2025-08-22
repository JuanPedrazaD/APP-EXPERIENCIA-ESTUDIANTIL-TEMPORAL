import { Module } from '@nestjs/common';
import { AppController } from 'src/infrastructure/app/app.controller';

import { DatabasesModule } from 'src/infrastructure/interface/common/databases/databases.module';
import { SaveAppService } from './save-app.service';
import { ShowAllAppsService } from './show-all-apps.service';
import { DeleteAppService } from './delete-app.service';

@Module({
  providers: [SaveAppService, ShowAllAppsService, DeleteAppService],
  controllers: [AppController],
  imports: [DatabasesModule],
  exports: [],
})
export class NewAppModule {}

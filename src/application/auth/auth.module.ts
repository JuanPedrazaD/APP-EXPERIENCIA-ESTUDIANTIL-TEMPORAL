import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { RegisterService } from './register.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from 'src/infrastructure/auth/auth.controller';
import { DatabasesModule } from 'src/infrastructure/interface/common/databases/databases.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    DatabasesModule,
  ],
  providers: [LoginService, RegisterService],
  controllers: [AuthController],
})
export class AuthModule {}

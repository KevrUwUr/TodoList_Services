import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { envs, AUTH_SERVICE } from 'src/config';

@Module({
  controllers: [AuthController],
  providers: [JwtAuthGuard],
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.AUTH_MS_HOST,
          port: envs.AUTH_MS_PORT,
        },
      },
    ]),
  ],
  exports: [JwtAuthGuard, ClientsModule],
})
export class AuthModule {}

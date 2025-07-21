import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { envs, USER_SERVICE } from 'src/config';

@Module({
  controllers: [UsersController],
  providers: [],
  imports: [
    AuthModule, // Para usar JwtAuthGuard
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.USER_MS_HOST,
          port: envs.USER_MS_PORT,
        },
      },
    ]),
  ],
})
export class UsersModule {}

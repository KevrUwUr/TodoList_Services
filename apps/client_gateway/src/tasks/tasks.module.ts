import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { envs, TASKS_SERVICE } from 'src/config';

@Module({
  controllers: [TasksController],
  providers: [],
  imports: [
    AuthModule, // Para usar JwtAuthGuard
    ClientsModule.register([
      {
        name: TASKS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.TASKS_MS_HOST,
          port: envs.TASKS_MS_PORT,
        },
      },
    ]),
  ],
})
export class TasksModule {}

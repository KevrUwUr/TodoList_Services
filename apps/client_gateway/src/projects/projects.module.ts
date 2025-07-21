import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { envs, PROJECTS_SERVICE } from 'src/config';

@Module({
  controllers: [ProjectsController],
  providers: [],
  imports: [
    AuthModule, // Para usar JwtAuthGuard
    ClientsModule.register([
      {
        name: PROJECTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.PROJECTS_MS_HOST,
          port: envs.PROJECTS_MS_PORT,
        },
      },
    ]),
  ],
})
export class ProjectsModule {}

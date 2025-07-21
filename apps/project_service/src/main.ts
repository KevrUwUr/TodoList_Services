import { AppModule } from './app.module';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.port,
      },
    },
  );
  const logger = new Logger('ProjectMS');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Manejo de errores globales
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  await app.listen();
  logger.log(`Project MS is running on port ${envs.port}`);
}
bootstrap().catch((error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});

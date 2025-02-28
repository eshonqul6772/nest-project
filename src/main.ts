import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as process from 'process';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

const logger = new Logger('Main');

import { seedDatabase } from '@common/migration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept,Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    maxAge: 3600,
  });
  const config = new DocumentBuilder()
    .setDescription('RESTFULL API.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT || 4445);
  const dataSource = app.get(DataSource);

  await seedDatabase(dataSource);
}
bootstrap()
  .then(() => {
    logger.log(`Server is running on port: [${process.env.PORT || '4445'}]`);
  })
  .catch(err => {
    logger.log(`Error is occurred during initialization the server: [${err}]`);
  });

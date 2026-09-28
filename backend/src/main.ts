import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import express from 'express';
import { resolve } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.use(express.static(resolve(__dirname, '../../dist')));
  await app.listen(Number(process.env.PORT || 4300), '0.0.0.0');
}

bootstrap().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

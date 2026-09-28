import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { copyFileSync, existsSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { resolve } from 'node:path';
import { AppModule } from './app.module';

type Listener = (req: IncomingMessage, res: ServerResponse) => void;

const database = '/tmp/profile.db';

if (!existsSync(database)) {
  copyFileSync(resolve(__dirname, '../prisma/profile.db'), database);
}

process.env.DATABASE_URL = `file:${database}`;

let server: Promise<Listener> | undefined;

async function createServer(): Promise<Listener> {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  server ??= createServer();
  const listener = await server;
  listener(req, res);
}

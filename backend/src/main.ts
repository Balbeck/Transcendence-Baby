import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as express from 'express';
config();
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  // app.use(bodyParser.json());
  app.enableCors({
    origin: '*',
    methods: 'GET,POST',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });

  // app.use(cors({
  //   origin: 'http://localhost:5173', // URL frontend
  //   credentials: true, // Pour entêtes d'autorisation ou cookies
  // }));
  await app.listen(3000);
  console.log(`Backend is running on port 3000.`);
}
bootstrap();

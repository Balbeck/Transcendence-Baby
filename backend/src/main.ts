import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as express from 'express';
config();
import * as session from 'express-session';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  // app.use(bodyParser.json());
  app.enableCors({
    origin: '*',
    methods: 'GET,POST',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });
  // app.use(
  //   session({
  //     secret: 'votre-secret', // Changez cette valeur par une chaîne de caractères secrète
  //     resave: false,
  //     saveUninitialized: true,
  //   }),
  // );
  // app.use(cors({
  //   origin: 'http://localhost:5173', // Remplacez l'URL par l'URL de votre frontend
  //   credentials: true, // Si vous utilisez des cookies ou des entêtes d'autorisation, assurez-vous d'inclure cette option
  // }));
  await app.listen(3000);
  console.log(`Backend is running on port 3000.`);
}
bootstrap();

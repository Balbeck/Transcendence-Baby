import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as express from 'express';
import { Server } from 'socket.io';
config();
import { createServer } from 'http';

async function bootstrap() {

  // Creation server [ Port - 3000 ] 
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.use(express.json());
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });
  await app.listen(3000);

  // Creation server WebSocket [ Port - 3001 ]
  const server = createServer(app.getHttpAdapter().getInstance());
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization, Accept',
    },
  });
  io.listen(3001);

  console.log(`Backend is running on port 3000.`);
  console.log(`io.listen(3001).`);
}
bootstrap();

// app.use(bodyParser.json());

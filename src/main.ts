import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";
import {getEnv} from "./utils/getenv";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {
  const appPort = getEnv('PORT', 3000);


  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [getEnv('RABBITMQ_URL', 'amqp://localhost:5672')],
      queue: 'auth_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
      .setTitle('auth-service')
      .setDescription('The auth-service for todo-service')
      .setVersion('1.0')
      .addTag('auth-service')
      .build();

  const swaggerApp = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(swaggerApp, config);
  SwaggerModule.setup('/swagger/auth', swaggerApp, document);

  await swaggerApp.listen(appPort, () => console.log('Swagger is listening on port ${appPort}'));


  await app.listen();
  console.log('Microservice is listening')
}

bootstrap();
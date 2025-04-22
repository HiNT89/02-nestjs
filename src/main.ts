import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('02-nestjs')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth() // Nếu sử dụng JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:5000/api
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

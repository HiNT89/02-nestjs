import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('02-nestjs')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth() // Nếu sử dụng JWT
    .build();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // loại bỏ field thừa
        forbidNonWhitelisted: true, // lỗi nếu có field lạ
        transform: true, // tự cast types
      }),
    );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // http://localhost:5000/api
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();

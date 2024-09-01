import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({transform: true}));

  const config = new DocumentBuilder()
  .setTitle('Tutorials API')
  .setDescription('Tutorials API with user authentication')
  .setVersion('1.0')
  .addBearerAuth(  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'JWT',
    description: 'Enter JWT token',
    in: 'header',
  }, 'jwt')
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();

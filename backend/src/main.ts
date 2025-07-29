import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// Se deja de importar el archivo de configuración de GraphQL
//import { graphqlUploadExpress } from 'graphql-upload';

const { graphqlUploadExpress } = require('graphql-upload');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(3000);
}
bootstrap();

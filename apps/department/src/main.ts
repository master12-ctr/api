import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from "@nestjs/swagger";
import { AllExceptionFilter } from './department/infrastructure/filter/exception.filter';
import { LoggerService } from './department/infrastructure/logger/logger.service';
import { LoggingInterceptor } from './department/infrastructure/interceptors/logger.interceptor';


async function bootstrap() {
  const port=4300
  const app = await NestFactory.create(AppModule,{cors:true});
  app.setGlobalPrefix("api");



// Filter
app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

// pipes
app.useGlobalPipes(new ValidationPipe());

// interceptors
app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
//  app.useGlobalInterceptors(new ResponseInterceptor());


  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const config = new DocumentBuilder()
    .setTitle("Management of Department")
    .setDescription("department API Documentation")
    .setVersion("1.0")
    .setContact(
      "Perago Information Systems",
      "http://peragosystems.com/",
      "tadeactor@gmail.com"
    )
    .build();
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup("/", app, document);


  await app.listen(port);
}
bootstrap();

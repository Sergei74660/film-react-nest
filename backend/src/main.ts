import { LoggerService, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

// Выбираем реализацию логгера по переменной окружения LOGGER_TYPE:
// dev (по умолчанию) — цветной консольный вывод для разработки,
// json — построчный JSON для машинного разбора,
// tskv — формат Tab-Separated Key-Value для внешних агентов сбора логов.
function createLogger(): LoggerService {
  switch (process.env.LOGGER_TYPE) {
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
    default:
      return new DevLogger();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(createLogger());
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();

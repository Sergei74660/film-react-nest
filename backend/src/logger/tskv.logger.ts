import { Injectable, LoggerService } from '@nestjs/common';

// Логгер в формате TSKV (Tab-Separated Key-Value): плоские записи вида
// key1=value1\tkey2=value2\n. Формат не поддерживает вложенность и типы —
// все значения приводятся к строке, табы внутри значений экранируются
// пробелом, чтобы не сломать разбиение по колонкам.
@Injectable()
export class TskvLogger implements LoggerService {
  private escape(value: unknown): string {
    return String(value).replace(/\t/g, ' ').replace(/\n/g, ' ');
  }

  private formatMessage(
    level: string,
    message: unknown,
    optionalParams: unknown[],
  ): string {
    const fields: Record<string, string> = {
      time: new Date().toISOString(),
      level,
      message: this.escape(message),
    };

    optionalParams.forEach((param, index) => {
      fields[`param${index}`] = this.escape(param);
    });

    return Object.entries(fields)
      .map(([key, value]) => `${key}=${value}`)
      .join('\t');
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('error', message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('warn', message, optionalParams));
  }

  debug?(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('debug', message, optionalParams));
  }

  verbose?(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('verbose', message, optionalParams));
  }
}
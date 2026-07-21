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
    message: any,
    optionalParams: any[],
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

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('error', message, optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('warn', message, optionalParams));
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('debug', message, optionalParams));
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, optionalParams));
  }
}

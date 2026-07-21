import { ConsoleLogger, Injectable } from '@nestjs/common';

// Логгер для разработчиков: обычный цветной консольный вывод Nest,
// расширяем класс, чтобы при необходимости добавить свою логику
@Injectable()
export class DevLogger extends ConsoleLogger {}

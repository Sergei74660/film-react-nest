//TODO реализовать DTO для /orders
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

// Один билет в составе заказа
export class OrderItemDto {
  @IsString()
  readonly film: string;

  @IsString()
  readonly session: string;

  @IsString()
  readonly daytime: string;

  @Type(() => Number)
  @IsNumber()
  readonly row: number;

  @Type(() => Number)
  @IsNumber()
  readonly seat: number;

  @Type(() => Number)
  @IsNumber()
  readonly price: number;
}

// Тело запроса POST /order — контактные данные и список билетов
export class CreateOrderDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly phone: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  readonly tickets: OrderItemDto[];
}

// Билет, обогащённый идентификатором после успешного оформления заказа
export class OrderResultItemDto extends OrderItemDto {
  readonly id: string;
}

// Ответ на POST /order
export class CreateOrderResultDto {
  readonly total: number;
  readonly items: OrderResultItemDto[];
}

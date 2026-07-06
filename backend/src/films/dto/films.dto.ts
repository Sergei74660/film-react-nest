//TODO описать DTO для запросов к /films
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

// Расписание сеанса, вложенное в фильм
export class ScheduleDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly daytime: string;

  @IsNumber()
  readonly hall: number;

  @IsNumber()
  readonly rows: number;

  @IsNumber()
  readonly seats: number;

  @IsNumber()
  readonly price: number;

  @IsArray()
  @IsString({ each: true })
  readonly taken: string[];
}

// Описывает структуру фильма для входящих/исходящих запросов
export class FilmDto {
  @IsString()
  readonly id: string;

  @IsNumber()
  readonly rating: number;

  @IsString()
  readonly director: string;

  @IsArray()
  @IsString({ each: true })
  readonly tags: string[];

  @IsString()
  readonly title: string;

  @IsString()
  readonly about: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly image: string;

  @IsString()
  readonly cover: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  readonly schedule: ScheduleDto[];
}

// Ответ на GET /films — список фильмов
export class FilmsListDto {
  readonly total: number;
  readonly items: FilmDto[];
}

// Ответ на GET /films/:id/schedule — список сеансов фильма
export class FilmScheduleListDto {
  readonly total: number;
  readonly items: ScheduleDto[];
}

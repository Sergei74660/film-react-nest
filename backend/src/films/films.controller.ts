import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

// Принимает HTTP-запросы, связанные с фильмами и их расписанием
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  // GET /api/afisha/films/ — список всех фильмов
  @Get()
  async getFilms() {
    return this.filmsService.getFilms();
  }

  // GET /api/afisha/films/:id/schedule — расписание сеансов конкретного фильма
  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string) {
    return this.filmsService.getFilmSchedule(id);
  }
}

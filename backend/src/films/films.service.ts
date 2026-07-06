import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository';
import { FilmDto } from './dto/films.dto';

// Бизнес-логика работы с фильмами: обращается к репозиторию, а не напрямую к mongoose
@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms() {
    const films = await this.filmsRepository.findAll();

    return {
      total: films.length,
      items: films,
    };
  }

  async createFilm(dto: FilmDto) {
    return this.filmsRepository.create(dto);
  }

  async getFilmSchedule(id: string) {
    const film = await this.filmsRepository.findByFilmId(id);

    if (!film) {
      throw new NotFoundException({ error: 'film not found' });
    }

    return {
      total: film.schedule?.length ?? 0,
      items: film.schedule ?? [],
    };
  }
}

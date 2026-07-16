import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FilmDto } from 'src/films/dto/films.dto';
import { Film } from 'src/films/films.entity';
import { Schedule } from 'src/schedule/schedule.entity';

// Слой доступа к данным: единственное место, где приложение обращается к TypeORM
@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return this.filmRepository.find({ relations: ['schedule'] });
  }

  async create(data: Partial<FilmDto>) {
    const film = this.filmRepository.create(data as Film);
    return this.filmRepository.save(film);
  }

  async findByFilmId(filmId: string) {
    return this.filmRepository.findOne({
      where: { id: filmId },
      relations: ['schedule'],
      order: { schedule: { daytime: 'ASC' } },
    });
  }

  // Атомарно бронирует место: в рамках одной транзакции блокирует строку
  // сеанса (SELECT ... FOR UPDATE), проверяет "место свободно" и сразу же
  // сохраняет обновлённый список занятых мест. Блокировка на время транзакции
  // сериализует параллельные запросы к одному и тому же сеансу, поэтому два
  // конкурентных запроса на одно место не могут оба увидеть его свободным.
  async reserveSeat(
    filmId: string,
    sessionId: string,
    seat: string,
  ): Promise<Schedule | null> {
    return this.dataSource.transaction(async (manager) => {
      const schedule = await manager
        .createQueryBuilder(Schedule, 'schedule')
        .innerJoin('schedule.film', 'film')
        .where('schedule.id = :sessionId', { sessionId })
        .andWhere('film.id = :filmId', { filmId })
        .setLock('pessimistic_write')
        .getOne();

      if (!schedule) {
        return null;
      }

      const taken = (schedule.taken || []).filter(Boolean);

      if (taken.includes(seat)) {
        return null;
      }

      taken.push(seat);
      schedule.taken = taken;

      return manager.save(Schedule, schedule);
    });
  }
}

import { Test } from '@nestjs/testing';
import { FilmsController } from '../films/films.controller';
import { FilmsService } from '../films/films.service';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

const scheduleDto: ScheduleDto = {
  id: '2',
  daytime: '21:00',
  hall: 1,
  rows: 5,
  seats: 10,
  price: 350,
  taken: ['1:1', '2:2'],
};

const filmDto: FilmDto = {
  id: '1',
  rating: 8.5,
  director: 'Jack',
  tags: ['drama'],
  title: 'Some film',
  about: 'about',
  description: 'description',
  image: 'image.jpg',
  cover: 'cover.jpg',
  schedule: [scheduleDto],
};

const filmsResponse = { total: 1, items: [filmDto] };
const scheduleResponse = { total: 1, items: [scheduleDto] };

describe('FilmsController: делегирование вызовов в FilmsService', () => {
  let filmsController: FilmsController;
  let filmsService: FilmsService;

  beforeEach(async () => {
    // Контроллер тестируется изолированно: сервис подменяется моком,
    // чтобы проверять только факт делегирования вызова, без похода в БД
    const moduleRef = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            getFilms: jest.fn(),
            getFilmSchedule: jest.fn(),
          },
        },
      ],
    }).compile();

    filmsController = moduleRef.get(FilmsController);
    filmsService = moduleRef.get(FilmsService);
  });

  it('getFilms() вызывает FilmsService.getFilms() и возвращает его результат', async () => {
    (filmsService.getFilms as jest.Mock).mockResolvedValue(filmsResponse);

    const result = await filmsController.getFilms();

    expect(filmsService.getFilms).toHaveBeenCalledTimes(1);
    expect(result).toEqual(filmsResponse);
  });

  it('getFilmSchedule() вызывает FilmsService.getFilmSchedule() с переданным id', async () => {
    (filmsService.getFilmSchedule as jest.Mock).mockResolvedValue(
      scheduleResponse,
    );

    const result = await filmsController.getFilmSchedule(filmDto.id);

    expect(filmsService.getFilmSchedule).toHaveBeenCalledWith(filmDto.id);
    expect(filmsService.getFilmSchedule).toHaveBeenCalledTimes(1);
    expect(result).toEqual(scheduleResponse);
  });
});

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmDto } from 'src/films/dto/films.dto';
import { Film, FilmDocument } from 'src/films/films.schema';

// Слой доступа к данным: единственное место, где приложение обращается к mongoose
@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll() {
    return this.filmModel.find().exec();
  }

  async create(data: Partial<FilmDto>) {
    return this.filmModel.create(data);
  }

  async findByFilmId(filmId: string) {
    return this.filmModel.findOne({ id: filmId }).exec();
  }
}

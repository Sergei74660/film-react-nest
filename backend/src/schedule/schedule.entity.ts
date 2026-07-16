import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Film } from '../films/films.entity';

// Сеанс фильма: хранит время показа, параметры зала и занятые места
@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column('int')
  hall: number;

  @Column('int')
  rows: number;

  @Column('int')
  seats: number;

  @Column('float')
  price: number;

  @Column('simple-array', { default: '' })
  taken: string[];

  @ManyToOne(() => Film, (film) => film.schedule, { onDelete: 'CASCADE' })
  film: Film;
}

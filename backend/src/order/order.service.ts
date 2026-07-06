import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsRepository } from 'src/repository/films.repository';
import { OrderItemDto } from './dto/order.dto';

// Бизнес-логика бронирования билетов: следит, чтобы одно и то же место
// на одном и том же сеансе не могло быть занято дважды
@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(tickets: OrderItemDto[]) {
    if (!Array.isArray(tickets) || tickets.length === 0) {
      throw new BadRequestException({
        error: 'order is not a list or the order is an empty list',
      });
    }

    for (const ticket of tickets) {
      const film = await this.filmsRepository.findByFilmId(ticket.film);

      if (!film) {
        throw new BadRequestException({ error: 'film not found' });
      }

      const session = film.schedule.find(
        (item) => String(item.id) === String(ticket.session),
      );

      if (!session) {
        throw new BadRequestException({ error: 'session not found' });
      }

      const seat = `${ticket.row}:${ticket.seat}`;

      // Проверяем, что место ещё не занято — как в базе, так и внутри
      // уже обработанных билетов текущего заказа
      if (session.taken.includes(seat)) {
        throw new BadRequestException({
          error: 'the seat is already taken',
        });
      }

      session.taken.push(seat);

      await film.save();
    }

    return {
      total: tickets.length,
      items: tickets.map((ticket) => ({
        ...ticket,
        id: randomUUID(),
      })),
    };
  }
}

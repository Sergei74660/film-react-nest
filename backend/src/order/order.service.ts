import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsRepository } from 'src/repository/films.repository';
import { OrderItemDto } from './dto/order.dto';

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
      const seat = `${ticket.row}:${ticket.seat}`;

      const updated = await this.filmsRepository.reserveSeat(
        ticket.film,
        ticket.session,
        seat,
      );

      if (!updated) {
        throw new BadRequestException({
          error: 'film/session not found or the seat is already taken',
        });
      }
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

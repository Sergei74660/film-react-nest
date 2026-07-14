import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

// Принимает HTTP-запросы, связанные с оформлением заказа билетов
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // POST /order — создать заказ (бронирование билетов)
  @Post()
  async createOrder(@Body() body: CreateOrderDto) {
    return this.orderService.createOrder(body.tickets);
  }
}

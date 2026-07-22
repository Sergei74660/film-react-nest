import { Test } from '@nestjs/testing';
import { OrderController } from '../order/order.controller';
import { OrderService } from '../order/order.service';
import { CreateOrderDto, OrderItemDto } from '../order/dto/order.dto';

const orderItemDto: OrderItemDto = {
  film: 'film-id',
  session: 'session-id',
  daytime: '21:00',
  row: 1,
  seat: 2,
  price: 350,
};

const createOrderDto: CreateOrderDto = {
  email: 'user@example.com',
  phone: '+71234567890',
  tickets: [orderItemDto],
};

const createOrderResponse = {
  total: 1,
  items: [{ ...orderItemDto, id: 'generated-id' }],
};

describe('OrderController: делегирование вызова в OrderService', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    orderController = moduleRef.get(OrderController);
    orderService = moduleRef.get(OrderService);
  });

  it('createOrder() передаёт в сервис только список билетов (tickets) из тела запроса', async () => {
    (orderService.createOrder as jest.Mock).mockResolvedValue(
      createOrderResponse,
    );

    const result = await orderController.createOrder(createOrderDto);

    expect(orderService.createOrder).toHaveBeenCalledWith(
      createOrderDto.tickets,
    );
    expect(orderService.createOrder).toHaveBeenCalledTimes(1);
    expect(result).toEqual(createOrderResponse);
  });
});

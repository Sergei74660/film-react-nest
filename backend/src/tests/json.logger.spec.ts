import { JsonLogger } from '../logger/json.logger';

describe('JsonLogger: форматирование логов в JSON', () => {
  let logSpy: jest.SpyInstance;
  const logger = new JsonLogger();

  // глушим консоль, чтобы не спамить терминал, создаём шпиона
  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('форматирует сообщение как валидный JSON с нужными полями', () => {
    logger.warn('message', { a: 1 });

    expect(logSpy).toHaveBeenCalledTimes(1);

    const loggedString = logSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedString);

    expect(parsed.level).toBe('warn');
    expect(parsed.message).toBe('message');
    expect(parsed.optionalParams).toEqual([{ a: 1 }]);
  });

  it('поддерживает остальные уровни логирования (log/error/debug/verbose)', () => {
    logger.log('a');
    logger.error('b');
    logger.debug?.('c');
    logger.verbose?.('d');

    expect(logSpy).toHaveBeenCalledTimes(4);

    const levels = logSpy.mock.calls.map((call) => JSON.parse(call[0]).level);
    expect(levels).toEqual(['log', 'error', 'debug', 'verbose']);
  });
});

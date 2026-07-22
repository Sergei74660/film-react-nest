import { TskvLogger } from '../logger/tskv.logger';

describe('TskvLogger: форматирование логов в TSKV', () => {
  let logSpy: jest.SpyInstance;
  const logger = new TskvLogger();

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('форматирует сообщение как TSKV-строку с нужными полями', () => {
    logger.warn('hello', 'world', 'tskv');

    expect(logSpy).toHaveBeenCalledTimes(1);

    const loggedString = logSpy.mock.calls[0][0];
    const timeRegex = /time=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;

    expect(loggedString).toMatch(timeRegex);
    expect(loggedString).toContain('level=warn');
    expect(loggedString).toContain('message=hello');
    expect(loggedString).toContain('param0=world');
    expect(loggedString).toContain('param1=tskv');
  });

  it('разделяет поля табуляцией и не содержит переносов строк', () => {
    logger.log('msg');
    const loggedString = logSpy.mock.calls[0][0];

    expect(loggedString).not.toContain('\n');
    expect(loggedString.split('\t').length).toBeGreaterThanOrEqual(3);
  });

  it('экранирует символы табуляции и переноса строк внутри значений', () => {
    logger.log('line1\nline2', 'a\tb');
    const loggedString = logSpy.mock.calls[0][0];

    // после экранирования исходных \t и \n внутри значений не должно остаться,
    // а разделителями полей остаются только "настоящие" табы форматтера
    const fieldCount = loggedString.split('\t').length;
    expect(loggedString).toContain('message=line1 line2');
    expect(loggedString).toContain('param0=a b');
    expect(fieldCount).toBe(4); // time, level, message, param0
  });
});

import { ILogger, NoOpLogger, ConsoleLogger, noOpLogger } from './logger';

describe('Logger', () => {
  describe('NoOpLogger', () => {
    it('should implement ILogger interface', () => {
      const logger = new NoOpLogger();

      expect(logger.debug).toBeDefined();
      expect(logger.info).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.error).toBeDefined();
    });

    it('should not throw when calling any log method', () => {
      const logger = new NoOpLogger();

      expect(() => logger.debug('test', { data: 1 })).not.toThrow();
      expect(() => logger.info('test', 'extra')).not.toThrow();
      expect(() => logger.warn('test')).not.toThrow();
      expect(() => logger.error('test', 'a', 'b', 'c')).not.toThrow();
    });

    it('should export singleton noOpLogger instance', () => {
      expect(noOpLogger).toBeInstanceOf(NoOpLogger);
    });
  });

  describe('ConsoleLogger', () => {
    let consoleSpy: {
      debug: jest.SpyInstance;
      info: jest.SpyInstance;
      warn: jest.SpyInstance;
      error: jest.SpyInstance;
    };

    beforeEach(() => {
      consoleSpy = {
        debug: jest.spyOn(console, 'debug').mockImplementation(),
        info: jest.spyOn(console, 'info').mockImplementation(),
        warn: jest.spyOn(console, 'warn').mockImplementation(),
        error: jest.spyOn(console, 'error').mockImplementation(),
      };
    });

    afterEach(() => {
      consoleSpy.debug.mockRestore();
      consoleSpy.info.mockRestore();
      consoleSpy.warn.mockRestore();
      consoleSpy.error.mockRestore();
    });

    it('should log debug messages to console', () => {
      const logger = new ConsoleLogger();
      logger.debug('test message', { foo: 'bar' });

      expect(consoleSpy.debug).toHaveBeenCalledWith('[FormConfigurator]', 'test message', { foo: 'bar' });
    });

    it('should log info messages to console', () => {
      const logger = new ConsoleLogger();
      logger.info('test message', { foo: 'bar' });

      expect(consoleSpy.info).toHaveBeenCalledWith('[FormConfigurator]', 'test message', { foo: 'bar' });
    });

    it('should log warn messages to console', () => {
      const logger = new ConsoleLogger();
      logger.warn('test message', { foo: 'bar' });

      expect(consoleSpy.warn).toHaveBeenCalledWith('[FormConfigurator]', 'test message', { foo: 'bar' });
    });

    it('should log error messages to console', () => {
      const logger = new ConsoleLogger();
      logger.error('test message', { foo: 'bar' });

      expect(consoleSpy.error).toHaveBeenCalledWith('[FormConfigurator]', 'test message', { foo: 'bar' });
    });

    it('should support custom prefix', () => {
      const logger = new ConsoleLogger('[CustomPrefix]');
      logger.info('test message');

      expect(consoleSpy.info).toHaveBeenCalledWith('[CustomPrefix]', 'test message');
    });
  });

  describe('ILogger interface compatibility', () => {
    it('should accept custom logger implementations', () => {
      const customLogger: ILogger = {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      customLogger.debug('test', { data: 'value' });
      customLogger.info('test');
      customLogger.warn('test');
      customLogger.error('test', 'extra');

      expect(customLogger.debug).toHaveBeenCalledWith('test', { data: 'value' });
      expect(customLogger.info).toHaveBeenCalledWith('test');
      expect(customLogger.warn).toHaveBeenCalledWith('test');
      expect(customLogger.error).toHaveBeenCalledWith('test', 'extra');
    });
  });
});

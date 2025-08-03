import { formatTargetDir, isValidPackageName, toValidPackageName } from '../src/utils/files';
import { pkgFromUserAgent } from '../src/utils/helpers';

describe('File Utils', () => {
  describe('formatTargetDir', () => {
    it('should format target directory correctly', () => {
      expect(formatTargetDir('test-dir')).toBe('test-dir');
      expect(formatTargetDir('test-dir/')).toBe('test-dir');
      expect(formatTargetDir('test-dir//')).toBe('test-dir');
      expect(formatTargetDir('  test-dir  ')).toBe('test-dir');
      expect(formatTargetDir('')).toBe('');
      expect(formatTargetDir(undefined)).toBe('');
    });
  });

  describe('isValidPackageName', () => {
    it('should validate package names correctly', () => {
      expect(isValidPackageName('my-package')).toBe(true);
      expect(isValidPackageName('@scope/my-package')).toBe(true);
      expect(isValidPackageName('my_package')).toBe(true);
      expect(isValidPackageName('MyPackage')).toBe(false);
      expect(isValidPackageName('my package')).toBe(false);
      expect(isValidPackageName('')).toBe(false);
    });
  });

  describe('toValidPackageName', () => {
    it('should convert to valid package names', () => {
      expect(toValidPackageName('My Package')).toBe('my-package');
      expect(toValidPackageName('  My Package  ')).toBe('my-package');
      expect(toValidPackageName('My@Package#')).toBe('my-package');
      expect(toValidPackageName('.my-package')).toBe('my-package');
    });
  });
});

describe('Helper Utils', () => {
  describe('pkgFromUserAgent', () => {
    it('should parse user agent correctly', () => {
      expect(pkgFromUserAgent('npm/8.19.2 node/v18.12.1')).toEqual({
        name: 'npm',
        version: '8.19.2'
      });
      
      expect(pkgFromUserAgent('yarn/1.22.19')).toEqual({
        name: 'yarn',
        version: '1.22.19'
      });
      
      expect(pkgFromUserAgent(undefined)).toBeUndefined();
      expect(pkgFromUserAgent('')).toBeUndefined();
    });
  });
}); = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('call1');
      debouncedFn('call2');
      debouncedFn('call3');

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call3');
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('SimpleLogger', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(console, 'warn').mockImplementation();
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(console, 'debug').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log messages with timestamps', () => {
      const logger = new SimpleLogger();
      logger.log('info', 'test message');

      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\]/),
        'test message'
      );
    });

    it('should not log debug messages when debug is disabled', () => {
      const logger = new SimpleLogger(false);
      logger.log('debug', 'debug message');

      expect(console.debug).not.toHaveBeenCalled();
    });

    it('should log debug messages when debug is enabled', () => {
      const logger = new SimpleLogger(true);
      logger.log('debug', 'debug message');

      expect(console.debug).toHaveBeenCalled();
    });
  });
});
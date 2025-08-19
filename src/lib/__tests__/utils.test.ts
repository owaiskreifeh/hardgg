import {
  cn,
  formatFileSize,
  parseFileSize,
  parseSizeToMB,
  debounce,
  throttle,
  generateId,
  truncateText,
  isValidUrl,
  getInitials,
  formatDate,
  getRandomImage,
  sleep
} from '../utils';

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500');
    });

    it('should handle conditional classes', () => {
      expect(cn('base-class', true && 'conditional-class')).toBe('base-class conditional-class');
      expect(cn('base-class', false && 'conditional-class')).toBe('base-class');
    });

    it('should handle arrays and objects', () => {
      expect(cn(['class1', 'class2'], { 'class3': true, 'class4': false })).toBe('class1 class2 class3');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1572864)).toBe('1.5 MB');
    });
  });

  describe('parseFileSize', () => {
    it('should parse size strings to bytes', () => {
      expect(parseFileSize('1 KB')).toBe(1024);
      expect(parseFileSize('1 MB')).toBe(1024 * 1024);
      expect(parseFileSize('1 GB')).toBe(1024 * 1024 * 1024);
    });

    it('should handle decimal values', () => {
      expect(parseFileSize('1.5 KB')).toBe(1536);
      expect(parseFileSize('2.5 MB')).toBe(2621440);
    });

    it('should handle case insensitive input', () => {
      expect(parseFileSize('1 kb')).toBe(1024);
      expect(parseFileSize('1 MB')).toBe(1024 * 1024);
    });
  });

  describe('parseSizeToMB', () => {
    it('should parse size strings to MB', () => {
      expect(parseSizeToMB('1 MB')).toBe(1);
      expect(parseSizeToMB('1 GB')).toBe(1024);
      expect(parseSizeToMB('1024 KB')).toBe(1);
    });

    it('should handle decimal values', () => {
      expect(parseSizeToMB('1.5 MB')).toBe(1.5);
      expect(parseSizeToMB('2.5 GB')).toBe(2560);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      jest.useFakeTimers();
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test1');
      debouncedFn('test2');
      debouncedFn('test3');

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      await Promise.resolve(); // Wait for async execution

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test3');

      jest.useRealTimers();
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      jest.useFakeTimers();
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('test1');
      throttledFn('test2');
      throttledFn('test3');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test1');

      jest.advanceTimersByTime(100);
      await Promise.resolve();

      throttledFn('test4');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('test4');

      jest.useRealTimers();
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBe(9);
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than max length', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is a ...');
      expect(truncateText('Short', 10)).toBe('Short');
    });

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });

  describe('isValidUrl', () => {
    it('should validate URLs correctly', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('ftp://example.com')).toBe(true);
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('getInitials', () => {
    it('should extract initials from names', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Mary Jane Watson')).toBe('MJ');
      expect(getInitials('A')).toBe('A');
      expect(getInitials('')).toBe('');
    });

    it('should handle single word names', () => {
      expect(getInitials('John')).toBe('J');
    });
  });

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2023-12-25');
      const formatted = formatDate(date.toISOString());
      expect(formatted).toMatch(/December 25, 2023/);
    });

    it('should handle invalid dates', () => {
      expect(() => formatDate('invalid-date')).not.toThrow();
    });
  });

  describe('getRandomImage', () => {
    it('should generate random image URLs', () => {
      const url1 = getRandomImage(300, 200);
      const url2 = getRandomImage(300, 200);

      expect(url1).toMatch(/^https:\/\/picsum\.photos\/300\/200\?random=/);
      expect(url2).toMatch(/^https:\/\/picsum\.photos\/300\/200\?random=/);
      expect(url1).not.toBe(url2);
    });

    it('should use default dimensions', () => {
      const url = getRandomImage();
      expect(url).toMatch(/^https:\/\/picsum\.photos\/300\/200\?random=/);
    });
  });

  describe('sleep', () => {
    it('should sleep for specified milliseconds', async () => {
      jest.useFakeTimers();
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      const sleepPromise = sleep(1000);
      
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
      
      jest.advanceTimersByTime(1000);
      await sleepPromise;
      
      setTimeoutSpy.mockRestore();
      jest.useRealTimers();
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cn,
  formatRelativeTime,
  formatNumber,
  truncate,
  getInitials,
  debounce,
} from './utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('should handle undefined values', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });

  it('should handle null values', () => {
    expect(cn('foo', null, 'bar')).toBe('foo bar');
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-12T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return "방금 전" for times less than 60 seconds ago', () => {
    const date = new Date('2026-01-12T11:59:30Z');
    expect(formatRelativeTime(date)).toBe('방금 전');
  });

  it('should return minutes for times less than 60 minutes ago', () => {
    const date = new Date('2026-01-12T11:30:00Z');
    expect(formatRelativeTime(date)).toBe('30분 전');
  });

  it('should return hours for times less than 24 hours ago', () => {
    const date = new Date('2026-01-12T06:00:00Z');
    expect(formatRelativeTime(date)).toBe('6시간 전');
  });

  it('should return days for times less than 30 days ago', () => {
    const date = new Date('2026-01-05T12:00:00Z');
    expect(formatRelativeTime(date)).toBe('7일 전');
  });

  it('should return months for times less than 12 months ago', () => {
    const date = new Date('2025-10-12T12:00:00Z');
    expect(formatRelativeTime(date)).toBe('3개월 전');
  });

  it('should return years for times more than 12 months ago', () => {
    const date = new Date('2024-01-12T12:00:00Z');
    expect(formatRelativeTime(date)).toBe('2년 전');
  });

  it('should handle string date input', () => {
    expect(formatRelativeTime('2026-01-12T11:30:00Z')).toBe('30분 전');
  });
});

describe('formatNumber', () => {
  it('should format numbers less than 1000 as-is', () => {
    expect(formatNumber(999)).toBe('999');
  });

  it('should format thousands with 천', () => {
    expect(formatNumber(1500)).toBe('1.5천');
  });

  it('should format ten-thousands with 만', () => {
    expect(formatNumber(15000)).toBe('1.5만');
  });

  it('should format hundred-millions with 억', () => {
    expect(formatNumber(150000000)).toBe('1.5억');
  });

  it('should format zero correctly', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

describe('truncate', () => {
  it('should not truncate text shorter than maxLength', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('should truncate text longer than maxLength with ellipsis', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });

  it('should handle exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('should handle empty string', () => {
    expect(truncate('', 5)).toBe('');
  });
});

describe('getInitials', () => {
  it('should return initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('should return single initial for single word', () => {
    expect(getInitials('John')).toBe('J');
  });

  it('should limit to 2 characters', () => {
    expect(getInitials('John Michael Doe')).toBe('JM');
  });

  it('should return uppercase initials', () => {
    expect(getInitials('john doe')).toBe('JD');
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delay function execution', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should only call once for multiple rapid calls', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the debounced function', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });
});

// Functional programming utilities

export const pipe = <T>(...fns: Array<(arg: T) => T>) => (value: T): T =>
  fns.reduce((acc, fn) => fn(acc), value);

export const compose = <T>(...fns: Array<(arg: T) => T>) => (value: T): T =>
  fns.reduceRight((acc, fn) => fn(acc), value);

export const curry = <T, U, V>(fn: (a: T, b: U) => V) => (a: T) => (b: U) => fn(a, b);

export const partial = <T extends unknown[], U>(fn: (...args: T) => U, ...partialArgs: Partial<T>) =>
  (...remainingArgs: T) => fn(...partialArgs as T, ...remainingArgs);

export const memoize = <T extends unknown[], U>(fn: (...args: T) => U): ((...args: T) => U) => {
  const cache = new Map<string, U>();
  return (...args: T): U => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

export const debounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends unknown[]>(
  fn: (...args: T) => void,
  limit: number
) => {
  let inThrottle: boolean;
  return (...args: T) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
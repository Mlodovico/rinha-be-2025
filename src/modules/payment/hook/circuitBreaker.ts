import * as CircuitBreaker from 'opossum';

export function createCircuitBreaker<
  T extends (...args: any[]) => Promise<any>,
>(
  action: T,
  options?: CircuitBreaker.Options,
  fallback?: (...args: any[]) => any,
): CircuitBreaker {
  const breaker = new CircuitBreaker(action, {
    timeout: 3000, // Default timeout
    errorThresholdPercentage: 50, // Default error threshold
    resetTimeout: 10000, // Default reset timeout
    ...options, // Allow overriding defaults
  });

  if (fallback) {
    breaker.fallback(fallback);
  }

  breaker.on('open', () => console.warn('[CircuitBreaker] Circuit opened'));
  breaker.on('halfOpen', () =>
    console.info('[CircuitBreaker] Circuit is half-open'),
  );
  breaker.on('close', () => console.info('[CircuitBreaker] Circuit closed'));

  return breaker;
}

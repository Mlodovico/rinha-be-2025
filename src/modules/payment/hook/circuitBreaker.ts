// src/common/utils/circuit-breaker.util.ts
import CircuitBreaker from 'opossum';

export function createCircuitBreaker<
  T extends (...args: any[]) => Promise<any>,
>(action: T, options?: CircuitBreaker.Options): CircuitBreaker {
  const breaker = new CircuitBreaker(action, {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
    ...options,
  });

  breaker.fallback(() => {
    console.error('[CircuitBreaker] Fallback triggered');
    return {
      message: 'Service is currently unavailable, please try again later.',
    };
  });

  breaker.on('open', () => console.warn('[CircuitBreaker] Circuit opened'));
  breaker.on('halfOpen', () =>
    console.info('[CircuitBreaker] Circuit half-open'),
  );
  breaker.on('close', () => console.log('[CircuitBreaker] Circuit closed'));

  return breaker;
}

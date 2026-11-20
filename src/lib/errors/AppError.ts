/**
 * Base Application Error class with HTTP status code and machine-readable error code.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when client input fails validation (HTTP 400).
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * Thrown when an external dependency (Open-Meteo, WAQI, Vertex AI) fails or returns an invalid response (HTTP 502).
 */
export class UpstreamError extends AppError {
  public readonly service: string;

  constructor(service: string, message: string, details?: unknown) {
    super(`Upstream error from ${service}: ${message}`, 502, 'UPSTREAM_ERROR', details);
    this.service = service;
  }
}

/**
 * Thrown when client exceeds rate limits (HTTP 429).
 */
export class RateLimitError extends AppError {
  public readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds = 60, message = 'Rate limit exceeded. Please try again later.') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', { retryAfterSeconds });
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

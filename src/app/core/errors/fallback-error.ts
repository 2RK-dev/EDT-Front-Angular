/**
 * Transport-level fallback codes. These are not "backend business codes",
 * but codes the frontend uses when the backend response body is missing/unreadable.
 *
 * t(errors.fallback.NETWORK_ERROR, errors.fallback.UNEXPECTED_ERROR,
 * errors.fallback.UNAUTHORIZED_NO_BODY, errors.fallback.REQUEST_FAILED)
 */
export const FALLBACK_ERROR_CODES = [
  'NETWORK_ERROR',
  'UNEXPECTED_ERROR',
  'UNAUTHORIZED_NO_BODY',
  'REQUEST_FAILED',
] as const;

export type FallBackErrorCode = typeof FALLBACK_ERROR_CODES[number];

export class AppError extends Error {
  constructor (
    readonly code: FallBackErrorCode,
    message?: string,
    cause?: unknown
  ) {
    super(message ?? code, {cause: cause});
  }
}

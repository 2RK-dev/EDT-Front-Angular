import { HttpErrorResponse } from "@angular/common/http";
import { AppError } from "@core/errors/fallback-error";

export class ApiError<CODE extends string> extends Error {
  constructor (
    public readonly code: CODE,
    public readonly detail?: string,
    cause?: unknown
  ) {
    super(code, {cause: cause});
    this.name = 'ApiError';
  }
}

export interface ProblemDetail {
  code: string;
  detail?: string;
}

function isProblemDetailBody (body: unknown): body is ProblemDetail {
  return !!body
    && typeof body === 'object'
    && 'code' in body
    && typeof body.code === 'string'
    && (!('detail' in body) || typeof body.detail === 'string');
}

export function mapHttpError<DOMAIN_CODE extends string> (
  err: HttpErrorResponse,
  isDomainCode: (code: string) => code is DOMAIN_CODE
): ApiError<DOMAIN_CODE> | AppError {

  const status = err.status;
  if (status === 0) return new AppError('NETWORK_ERROR');
  const body = err.error;

  if (isProblemDetailBody(body)) {
    const rawCode = body.code;
    const detail = body.detail;
    if (isDomainCode(rawCode)) return new ApiError(rawCode, detail, err);
    console.warn(`${detail}, Unknown error code: ${rawCode}`);
    return new AppError('REQUEST_FAILED', `${detail}, Unknown error code: ${rawCode}`, err);
  }

  if (status === 401 || status === 403) return new AppError('UNAUTHORIZED_NO_BODY', undefined, err);
  return new AppError('REQUEST_FAILED', undefined, err);
}

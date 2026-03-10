import * as errors from '@backstage/errors';
import { LoggerService } from '@backstage/backend-plugin-api';
import { ErrorRequestHandler } from 'express';

function getStatusCode(error: errors.ErrorLike): number {
  const knownStatusCodeFields = ['statusCode', 'status'];
  for (const field of knownStatusCodeFields) {
    const statusCode = (error as Record<string, unknown>)[field];
    if (
      typeof statusCode === 'number' &&
      (statusCode | 0) === statusCode &&
      statusCode >= 100 &&
      statusCode <= 599
    ) {
      return statusCode;
    }
  }
  switch (error.name) {
    case errors.NotModifiedError.name:
      return 304;
    case errors.InputError.name:
      return 400;
    case errors.AuthenticationError.name:
      return 401;
    case errors.NotAllowedError.name:
      return 403;
    case errors.NotFoundError.name:
      return 404;
    case errors.ConflictError.name:
      return 409;
    case errors.NotImplementedError.name:
      return 501;
    case errors.ServiceUnavailableError.name:
      return 503;
    default:
      return 500;
  }
}

export interface ErrorHandlerOptions {
  logger?: LoggerService;
  logClientErrors?: boolean;
  showStackTraces?: boolean;
}

/**
 * Express error handler middleware compatible with the deprecated
 * @backstage/backend-common errorHandler.
 */
export function createErrorHandler(options: ErrorHandlerOptions = {}): ErrorRequestHandler {
  const showStackTraces =
    options.showStackTraces ?? process.env.NODE_ENV === 'development';
  const logAllErrors = options.logClientErrors ?? false;
  const logger = options.logger;

  return (rawError: unknown, req, res, next) => {
    let error: errors.ErrorLike;
    try {
      errors.assertError(rawError);
      error = rawError;
    } catch {
      if (res.headersSent) {
        next(rawError);
        return;
      }
      const statusCode = 500;
      const body = {
        error: errors.serializeError(new Error('An internal error occurred'), {
          includeStack: showStackTraces,
        }),
        request: { method: req.method, url: req.url },
        response: { statusCode },
      };
      res.status(statusCode).json(body);
      return;
    }

    const statusCode = getStatusCode(error);
    if (logger && (logAllErrors || statusCode >= 500)) {
      logger.error(`Request failed with status ${statusCode}`, error);
    }

    if (res.headersSent) {
      next(error);
      return;
    }

    const body = {
      error: errors.serializeError(error as Error, { includeStack: showStackTraces }),
      request: { method: req.method, url: req.url },
      response: { statusCode },
    };
    res.status(statusCode).json(body);
  };
}

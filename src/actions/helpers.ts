import { createLogger } from '@/logging/Logger';
import { InferSafeActionFnResult } from 'next-safe-action';

/**
 * next safe actions does not throw errors, it returns them. If we want the error to be catch by react query, we need to throw it.
 */
export function throwIfError<TAction extends (...args: any[]) => Promise<any>>(
  fn: TAction
) {
  return async (
    ...args: Parameters<TAction>
  ): Promise<NonNullable<InferSafeActionFnResult<TAction>['data']>> => {
    const result = await fn(...args);

    if (result.validationErrors) {
      // Triggers if the input fails the schema validation
      logger.error('⚠️ Validation errors', result.validationErrors);
      throw new Error('Por favor, rellena del formulario correctamente');
    }

    if (result.serverError) {
      throw new Error(
        result.serverError.userMessage || 'Ups! Algo fue mal! Prueba de nuevo'
      );
    }

    if (result.error) {
      throw new Error('Ups, no se encontró el recurso');
    }

    return result.data;
  };
}

const logger = createLogger('actions/helpers');

import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// import { withAuth } from '@/actions/middleware/withAuth.actionMiddleware';
// import { isAppError } from '@/errors/ErrorClases';

// Base client.
export const authedActionClient = createSafeActionClient({
  handleServerError(e) {
    // if (!isAppError(e)) {
    //   return {
    //     code: e?.name || 'UnknownError',
    //     message: e?.message || 'Ha ocurrido un error inesperado',
    //     details:
    //       process.env.NODE_ENV === 'development'
    //         ? {
    //             stack: e?.stack,
    //             name: e?.name,
    //           }
    //         : undefined,
    //   };
    // }

    return {
      code: e.name,
      message: e.message,
    };
  },

  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },

  // Define logging middleware.
});
// .use(withAuth);
// .use(withLogging);
// .use(withError) We are already handling errors in the action.

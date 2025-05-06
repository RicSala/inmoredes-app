// export const withAuth = createMiddleware<{
//   ctx: {};
//   metadata: { actionName: string };
//   serverError: ServerError;
// }>().define(
//   async ({
//     next,
//     ctx: _ctx,
//     metadata: _metadata,
//     clientInput: _clientInput,
//   }) => {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!session) {
//       throw new Error('Unauthorized');
//     }

//     return next({ ctx: { session } });
//   }
// );

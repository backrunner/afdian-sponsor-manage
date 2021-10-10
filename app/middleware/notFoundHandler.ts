export default () => {
  return async function notFoundHandler(ctx, next) {
    await next();
    if (ctx.status === 404 && !ctx.body) {
      ctx.body = {
        code: 10002,
        success: false,
        message: 'API not found',
      };
    }
  };
}

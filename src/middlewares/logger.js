export default async function logger(ctx, next) {
  console.warn('this is a logger middleware.')
  await next()
}
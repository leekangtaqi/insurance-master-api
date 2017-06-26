import Router from 'koa-router'

/**
 * Helper to define sub router.
 * @param {String} prefix 
 * @param {Function} routerCreator 
 * @return {Function}
 */
export default function mount(prefix, routerCreator) {
  return function (toMount, options) {
    let router = null
    if (toMount instanceof Router) {
      router = new Router()
      routerCreator(router)
      toMount
      .use(prefix, router.routes(), router.allowedMethods())
    } else {
      router = new Router({ prefix })
      routerCreator(router)
      toMount
      .use(router.routes())
      .use(router.allowedMethods())
    }
  }
}

export { Router }
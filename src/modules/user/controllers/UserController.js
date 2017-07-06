import wxApp from '../../../framework/wechatApp'
import botDispatcher from '../../../framework/botDispatcher'

export default class UserController {
  async getUserMid(ctx) {
    let userId = ctx.request.query.userId
    if (!ctx.user && userId) {
      ctx.user = await ctx.app.ctx.services.UserService().findById(userId)
    }
  }

  async getUser(ctx) {
    let { services, errors, Res, props, logger } = ctx.app.ctx
    try {
      if (ctx.user) {
        return ctx.body = ctx.user
      }
      let users = await app.ctx.services.UserService().find(ctx.request.query)
      return ctx.body = users
    } catch (e) {
      throw e
    }
  }

  async onLogin(ctx) {
    let {  services, errors, Res, props, logger } = ctx.app.ctx
    try {
      await wxApp.onLogin(ctx.request.body.code)
      ctx.body = Res(props.code.SUCCESS, props.messages.SUCCESS)
    } catch(e) {
      logger.error(e)
      ctx.body = Res(props.code.FAILED, props.messages.REQUEST_FAILED)
    }
  }

  async login(ctx) {
    let { services, errors, Res, props } = ctx.app.ctx
    let { rawData, signature, encryptedData, iv } = ctx.request.body
    if (!rawData || !signature || !encryptedData || !iv) {
      return ctx.body = Res(props.code.FAILED, props.messages.PARAM_FAILED)
    }
    let userRaw = await wxApp.decode(rawData, signature, encryptedData, iv)
    let user = await services.UserService().fetch(userRaw)
    return ctx.body = Res(props.code.SUCCESS, props.messages.SUCCESS, { token: null, user })
  }
}
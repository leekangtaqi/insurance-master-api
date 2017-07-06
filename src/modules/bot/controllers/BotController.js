export default class BotController {

  async toLoginByUserId(ctx) {
    console.warn(this)
    let { services, errors, Res, props, logger } = ctx.app.ctx
    let { type, platform, userId } = ctx.request.query

    if (!type) {
      return ctx.body = Res(props.code.FAILED, 'Failed to login website, expected a type')
    }
    if (!platform) {
      return ctx.body = Res(props.code.FAILED, 'Failed to login website, expected a platform')
    }
    if (!userId) {
      return ctx.body = Res(props.code.FAILED, 'Failed to login website, expected a userId')
    }
    let botService = services.BotService()
    try {
      let res = await botService.toLoginByUserId(type, platform, userId)
      ctx.body = Res(props.code.SUCCESS, props.messages.SUCCESS, res)
    } catch (e) {
      ctx.body = Res(props.code.FAILED, e.message, e)
    }
  }

  async loginByUserIdUsernamePwdAndVcode(ctx) {
    let { services, errors, Res, props, logger } = ctx.app.ctx
    let { type, platform, userId, username, password, vcode } = ctx.request.query

    if (!type) {
      return ctx.body = Res(props.code.FAILED, 'Failed to login website, expected a type')
    }
    if (!platform) {
      return ctx.body = Res(props.code.FAILED, 'Failed to login website, expected a platform')
    }
    if (!userId) {
      return ctx.body = Res(props.code.FAILED, 'Failed to login website, expected a userId')
    }
    let botService = services.BotService()
    let res = await botService.loginByUserIdUsernamePwdAndVcode(type, platform, userId, username, password)
    ctx.body = Res(props.code.SUCCESS, props.messages.SUCCESS, res)
  }
} 
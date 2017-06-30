export default class UserController {
  async getUser(ctx) {
    const { params, app } = ctx
    try {
      let { errors } = app.ctx
      let users = await app.ctx.services.UserService().find()
      // let userTmp = users[1]
      // await app.ctx.kvs.UserKv().save(userTmp)
      // let user = await app.ctx.kvs.UserKv().loadById(userTmp.id)
      ctx.body = users
    } catch (e) {
      throw e
    }
  }

  async getUserById(id) {
    try {
      console.warn('get user by id')
    } catch (e) {
      throw e
    }
  }

  async getSessionKey(code) {
    let {  services, errors, Res, props } = ctx.app.ctx
    let res = await services.UserService().getSessionKey(code)
    if (res.errcode) {
      return this.body = Res(props.code.FAILED, props.messages.REQUEST_FAILED)
    }
    this.body = Res(props.code.SUCCESS, props.messages.SUCCESS, res)
  }

  async fetchUser(ctx) {
    let { services, errors, Res, props } = ctx.app.ctx
    let { rawData, signature, encryptedData, iv, sessionKey } = ctx.request.body
    if (!rawData || !signature || !encryptedData || !iv) {
      return this.body = Res(props.code.FAILED, props.messages.PARAM_FAILED)
    }
    let userRaw = await services.UserService().decode(rawData, sessionKey, signature, encryptedData, iv)
    let user = await services.UserService().create(userRaw)
    return this.body = Res(props.code.SUCCESS, props.messages.SUCCESS, user._id)
  }
}
export default class UserController {
  async getUser(ctx) {
    const { params, app } = ctx
    try {
      console.warn(ctx.app.ctx)
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
}
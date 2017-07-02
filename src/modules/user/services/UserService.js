import qs from 'querystring'
import url from 'url'
import request from 'request-promise'

export default class UserService {
  constructor(context) {
    this.context = context;
  }

  async fetch(user) {
    // unionid
    if (!user.openid) {
      throw new this.context.errors.NoOpenid()
    }
    let User = this.context.models.User
    let doc = await User.findOne({ openid }).exec()
    if (!doc) {
      doc = await this.create(user)
    }
    return doc
  }

  async create(userMeta) {
    let User = this.context.models.User
    let user = new User(userMeta)
    await user.save()
    return user
  }

  async find() {
    let User = this.context.models.User
    return await User.find().exec()
  }

  
}
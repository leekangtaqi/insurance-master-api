import qs from 'querystring'
import url from 'url'
import request from 'request-promise'

export default class UserService {
  constructor(context) {
    this.context = context;
  }

  async create(userMeta) {
    let User = this.context.models.User
    let user = new User(userMeta)
    await user.save()
    return user
  }

  async getSessionKey(code) {
    let url = {
      protocol: 'https',
      host: 'api.weixin.qq.com/sns/jscode2session',
      query: {
        appid: this.context.config.wx.wxApp.appid,
        secret: this.context.config.wx.wxApp.appSecret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    }
    return await request.get(url.format(url))
  }

  async find() {
    let User = this.context.models.User
    return await User.find().exec()
  }

  async decode(rawData, sessionKey, signature, encryptedData, iv) {
    // todo security - signature === encode(rawData, sessionKey)
    
  }
}
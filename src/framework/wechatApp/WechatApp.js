import url from 'url'
import request from 'request-promise'
import crypto from 'crypto'
import u from './util'
import WechatAppBizCipherer from './WechatAppBizCipherer'

let baseUrl = 'api.weixin.qq.com'

class WechatApp {

  constructor(appid, appSecret){
    this.appid = appid
    this.appSecret = appSecret
    this.sessionKey = null
    this.bizCipherer = new WechatAppBizCipherer()
  }

  async onLogin(code) {
    try {
      let res = await this.getSessionKeyAndOpenid(code)
      this.sessionKey = res.sessionKey
      // todo maintain session
      return this.sessionKey
    } catch(e) {
      throw e
    }
  }

  /**
   * Exchange code to openid and session_key
   * @param {string} code 
   * @return {} | {}
   */
  async getSessionKeyAndOpenid(code) {
    let path = {
      protocol: 'https',
      host: `${baseUrl}/sns/jscode2session`,
      query: {
        appid: this.appid,
        secret: this.appSecret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    }

    try {
      let res = await request.get(url.format(path))
      res = JSON.parse(res)
      if (res.errcode) {
        throw new Error(res.errmsg)
      }
      return res
    } catch (e) {
      throw e
    }
  }

  async decode(rawData, signature, encryptedData, iv) {
    try {
      return this.bizCipherer.decode(rawData, this.sessionKey, signature, encryptedData, iv)
    } catch (e) {
      throw e
    }
  }
}

export default function createWechatApp(appid, appSecret) {
  return new WechatApp(appid, appSecret)
}


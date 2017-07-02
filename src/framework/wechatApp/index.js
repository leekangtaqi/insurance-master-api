import createWechatApp from './WechatApp'
import config from '../../config'

let { appid, appSecret } = config.wx.wxApp

export default createWechatApp(appid, appSecret)

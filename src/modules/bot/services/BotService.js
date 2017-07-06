import botDispatcher from '../../../framework/botDispatcher'
import types from '../../../framework/botDispatcher/events-definition'

export default class BotService {
  constructor(context) {
    this.context = context;
  }

  async toLoginByUserId(type='web', platform='ctrip_web', userId) {
    return await botDispatcher.requestAsync(types.CTRIP_WEB_TOLOGIN, { key: userId })
  }

  async loginByUserIdUsernamePwdAndVcode(type='web', platform='ctrip_web', userId, username, password, vcode) {
    return await botDispatcher.requestAsync(types.CTRIP_WEB_LOGIN, { key: userId, payload: { username: '15210383276', password: '40115891r' }})
  }
}
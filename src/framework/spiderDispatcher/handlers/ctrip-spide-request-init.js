require('babel-polyfill')
const Handler = require('./handler')
const types = require('../events-definition')

class CtripSpideRequestInit extends Handler {

  constructor() {
    super()
    this.type = 'spide-request-init'
  }

  async handle(key) {
    let payload = {}
    await this.executor.goto('http://www.ctrip.com/')
    try {
      await this.login(key)
    } catch (e) {
      await this.clearLogin()
      await this.needLogin()
    }
    await this.spider()
    await this.executor.wait(8000)
    await this.done(key, payload)
    await this.destroy(key)
  }

  async onToLogin() {
    await this.executor.goto('http://www.ctrip.com/')
  }

  async onLogin() {
    let vCode = await this.executor
      .click('#c_ph_login')
      .click('#txtUserName')
      .wait(500)
      .evaluate(function() {
        return document.querySelector('#imgCode').src
      })  
    
    let payload = null

    try {
      if (this.vCodeNeeded(vCode)) {
        payload = await this.request(types.CTRIP_LOGIN_REQUEST, { key })
      } else {
        payload = await this.request(types.CTRIP_LOGIN_SIMPLE_REQUEST, { key })
      }
    } catch (e) {
      console.warn(e)
      if (e.code === 500) {
        // timeout
        return await this.destroy(key)
      }
      return await this.destroy(key)
    }

    payload = payload.payload
    
    if (this.vCodeNeeded(vCode) && !payload.vcode
      || !payload.username
      || !payload.password
    ) {
      return await this.destroy(key)
    }
      
    await this.executor
      .type('#txtUserName', payload.username)
      .type('#txtPwd', payload.password)
    
    if (this.vCodeNeeded(vCode)) {
      await this.executor.type('#x', payload.vcode)
    }

    await this.executor.click('#btnSubmit')
  }

  async onToSpide() {
    await this.executor
      .wait('#c_ph_myhome')
      .click('#c_ph_myhome')
  }

  async onToDone() {
    process.emit(this.prefix + '-' + this.type)
    await this.destroy(key)
  }

  vCodeNeeded(vCode) {
    return vCode && vCode != 'https://accounts.ctrip.com/member/images/pic_verificationcode.gif'
  }

  async clearLogin() {
    await this.executor.type('#txtUserName', '')
    await this.executor.type('#txtPwd', '')
  }

  async needLogin() {
    process.send('')
  }









  async login(key) {
    let vCode = await this.executor
      .click('#c_ph_login')
      .click('#txtUserName')
      .wait(500)
      .evaluate(function() {
        return document.querySelector('#imgCode').src
      })  
    
    let payload = null

    try {
      if (this.vCodeNeeded(vCode)) {
        payload = await this.request(types.CTRIP_LOGIN_REQUEST, { key })
      } else {
        payload = await this.request(types.CTRIP_LOGIN_SIMPLE_REQUEST, { key })
      }
    } catch (e) {
      console.warn(e)
      if (e.code === 500) {
        // timeout
        return await this.destroy(key)
      }
      return await this.destroy(key)
    }

    payload = payload.payload
    
    if (this.vCodeNeeded(vCode) && !payload.vcode
      || !payload.username
      || !payload.password
    ) {
      return await this.destroy(key)
    }
      
    await this.executor
      .type('#txtUserName', payload.username)
      .type('#txtPwd', payload.password)
    
    if (this.vCodeNeeded(vCode)) {
      await this.executor.type('#x', payload.vcode)
    }

    await this.executor.click('#btnSubmit')
  }

  async spider() {
    await this.executor
      .wait('#c_ph_myhome')
      .click('#c_ph_myhome')
  }
}

async function main () {
  let args = [...process.argv.slice(2)]
  let handler = new CtripSpideRequestInit()
  await handler.init(args[0])
}

main()
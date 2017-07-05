require('babel-polyfill')
const Handler = require('./handler')
const types = require('../events-definition')
const StateMachine = require('../state-machine')

const ResType = {
  DONE: 'done',
  ABORT: 'abort',
  EXCEPTION: 'exception'
}

class CtripWebToLogin extends Handler {

  constructor(key, inbound, outbound={}) {
    super()
    this.key = key
    this.inbound = inbound
    this.outbound = outbound
    this.timeout = null
    this.fsm = new StateMachine({
      init: 'unlogin',
      transitions: [
        { name: 'ctripWebToLogin', from: 'unlogin',  to: 'login' },
        { name: 'ctripWebLogin',   from: 'login',    to: 'loggedin' },
        { name: 'ctripWebToSpide', from: 'loggedin', to: 'spide' },
        { name: 'ctripWebToDone',  from: 'spide',    to: 'done' }
      ],
      methods: {
        onCtripWebToLogin: this.onToLogin.bind(this),
        onCtripWebLogin:   this.onLogin.bind(this),
        onCtripWebToSpide: this.onToSpide.bind(this),
        onCtripWebToDone:  this.onToDone.bind(this)
      }
    })
    process.on('message', ({ action, payload }) => {
      switch (action) {
        case 'toLogin':
          this.fsm.doAction('ctripWebToLogin', payload)
          break
        case 'login':
          this.fsm.doAction('ctripWebLogin', payload)
          break
        case 'toSpide':
          this.fsm.doAction('ctripWebToSpide', payload)
          break
        case 'toDone':
          this.fsm.doAction('ctripWebToDone', payload)
          break
      }
    })
  }

  async handle(key) {
    console.warn('ctrip web to login startup.')
  }

  async onToLogin() {
    let vCode = await this.executor
      .goto('http://www.ctrip.com/')
      .click('#c_ph_login')
      .click('#txtUserName')
      .evaluate(function() {
        return document.querySelector('#imgCode').src
      })
    this.vcode = vCode
    this.needVcode = this.vCodeNeeded(vCode)
    if (!this.needVcode) {
      this.vcode = null
    }
    this.request({ action: 'ctripWebToLogin', key, payload: { vcode: this.vcode }}, { timeout: 60*1000})
  }

  async request(payload, opts) {
    process.send(payload)
    this.timeout = setTimeout(function() {
      this.destroy(ResType.ABORT)
    }, opts.timeout)
  }

  /**
   * Notify dispatcher and close process.
   * @param {enum} type => <Done, Abort, Expection>
   */
  async destroy(type) {
    try {
      process.send({ action: 'ctripWebToDone', origin: 'ctripWebToLogin', error: { message: type }, key })
      this.executor.end()
      process.exit()
    } catch (e) {}
  }

  async onLogin(payload) {
    payload = payload.payload
    
    if (this.vcode && !payload.vcode
      || !payload.username
      || !payload.password
    ) {
      return await this.executor.end()
    }
      
    await this.executor
      .type('#txtUserName', payload.username)
      .type('#txtPwd', payload.password)
    
    if (this.needVcode) {
      await this.executor.type('#x', payload.vcode)
    }

    await this.executor.click('#btnSubmit')

    await this.fsm.doAction('ctripWebToSpide', key)
  }

  async onToSpide() {
    await this.executor
      .wait('#c_ph_myhome')
      .click('#c_ph_myhome')

    await this.fsm.doAction('ctripWebToDone', key)
  }

  async onToDone() {
    process.send({ action: 'ctripWebToDone', key, payload: null})
    await this.executor.end()
  }

  vCodeNeeded(vCode) {
    return vCode && vCode != 'https://accounts.ctrip.com/member/images/pic_verificationcode.gif'
  }

}

async function main () {
  let args = [...process.argv.slice(2)]
  let handler = new CtripWebToLogin(args[0], args[1])
  await handler.init(args[0])
}

main()
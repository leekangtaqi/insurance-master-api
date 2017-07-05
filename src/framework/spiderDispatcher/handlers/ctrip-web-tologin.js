require('babel-polyfill')
const Handler = require('./handler')
const types = require('../events-definition')
const StateMachine = require('../state-machine')
const util = require('./util')

const ResType = {
  DONE: 'done',
  ABORT: 'abort',
  EXCEPTION: 'exception'
}

class CtripWebToLogin extends Handler {

  constructor(key) {
    super()
    this.key = key
    this.timeout = null
    this.fsm = new StateMachine({
      init: 'unlogin',
      transitions: [
        { name: 'ctripWebTologin',   from: 'unlogin',   to: 'login' },
        { name: 'ctripWebNeedlogin', from: 'login',     to: 'needLogin' },
        { name: 'ctripWebLogin',     from: 'needLogin', to: 'loggedin' },
        { name: 'ctripWebToSpide',   from: 'loggedin',  to: 'spide' },
        { name: 'ctripWebToDone',    from: 'spide',     to: 'done' }
      ],
      methods: {
        onCtripWebTologin:      this.onToLogin.bind(this),
        onAfterCtripWebTologin: async () => {
          await this.doAction('ctripWebNeedlogin', { vcode: this.vcode })
        },
        onCtripWebNeedlogin:    this.onCtripWebNeedlogin.bind(this),
        onCtripWebLogin:        this.onLogin.bind(this),
        onAfterCtripWebLogin:   async () => {
          await this.doAction('ctripWebToSpide')
        },
        onCtripWebToSpide:      this.onToSpide.bind(this),
        onAfterCtripWebToSpide:   async () => {
          await this.doAction('ctripWebToDone')
        },
        onCtripWebToDone:       this.onToDone.bind(this)
      }
    })
    process.on('message', async ({ action, payload }) => {
      await this.fsm.doAction(action, payload)
    })
  }

  async onToLogin() {
    try {
      let vCode = await this.executor
        .goto('http://www.ctrip.com/')
        .click('#c_ph_login')
        .click('#txtUserName')
        .evaluate(function() {
          return document.querySelector('#imgCode').src
        })
      this.vcode = vCode
      this.needVcode = util.vCodeNeeded(vCode)
      if (!this.needVcode) {
        this.vcode = null
      }
    } catch (e) {
      console.error(e)
    }
  }

  async onCtripWebNeedlogin(payload) {
    process.once('message', async ({ action, payload }) => {
      if (action === 'ctripWebNeedloginRequest') {
        await this.doAction('onCtripWebLogin', payload)
      }
    })
    payload.key = this.key
    payload.action = 'ctripWebNeedlogin'
    process.send({ action: 'ctripWebTologinResponse', payload, error: null })
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
  }

  async onToSpide() {
    await this.executor
      .wait('#c_ph_myhome')
      .click('#c_ph_myhome')
  }

  async onToDone() {
    this.response({ action: 'ctripWebLoginResponse', payload: { key: this.key }})
    await this.destroy()
  }

}

async function main () {
  let args = [...process.argv.slice(2)]
  new CtripWebToLogin(args[0], args[1])
}

main()
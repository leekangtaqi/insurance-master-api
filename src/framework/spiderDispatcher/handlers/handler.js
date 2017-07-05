const Nightmare = require('nightmare')
const types = require('../events-definition')
const { EventEmitter } = require('events')

module.exports =  class Handler extends EventEmitter {

  constructor() {
    super()
    this.executor = new Nightmare({ show: true })
  }

  async request() {}

  async response(data) {
    process.send(data)
  }

  async destroy() {
    try {
      await this.executor.end()
      process.exit()
    } catch (e) {}
  }

  async doAction(action, payload, opts) {
    try {
      let res = await this.fsm.doAction(action, 
        Object.assign({}, payload, { key: this.key, vcode: this.vcode }),
        opts)
    } catch (e) {
      if (e.code === 408) {
        return this.destroy(ResType.TIMEOUT)
      }
      this.destroy(ResType.ABORT)
    }
  }
}

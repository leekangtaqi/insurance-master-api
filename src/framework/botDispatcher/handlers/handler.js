const Nightmare = require('nightmare')
const types = require('../events-definition')
const { EventEmitter } = require('events')

const ResType = {
  DONE: 'done',
  ABORT: 'abort',
  EXCEPTION: 'exception'
}

module.exports =  class Handler extends EventEmitter {

  constructor() {
    super()
    this.executor = new Nightmare({ show: true })
    process.on('unhandledRejection', error => {
      this.ack({ action: types.EXCEPTION, payload: null, error: { message: error.message, code: error.code } })
    })
  }

  ack(data) {
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

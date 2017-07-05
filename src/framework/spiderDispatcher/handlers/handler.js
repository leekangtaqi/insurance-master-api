const Nightmare = require('nightmare')
const types = require('../events-definition')

module.exports =  class Handler {

  constructor() {}

  async init(key) {
    this.executor = new Nightmare({ show: true })
    process.on('disconnect', this.onHandle.bind(this))
    process.on('exit', this.onHandle.bind(this))
    process.on('error', this.onHandle.bind(this))
    await this.handle(key)
  }

  async done(id) {
    process.emit(this.prefix + '-' + this.type)
  }

  async onHandle() {
    try {
      await this.executor.end()
    } catch(e) {
      console.warn(`[Handler] process's expection occur.`)
    }
  }

  async request(type, content, opts={}) {
    try {
      let timeout = opts.timeout
      if (!opts.timeout) {
        timeout = this.timeout
      }
      return new Promise((resolve, reject) => {      
        let onSubscribe = async payload => {
          let tid = setTimeout(function() {
            process.removeListener(type, onSubscribe)
            let err = new Error(`Failed to request, [code]=timeout`)
            err.code = 500
            return reject(err)
          }, timeout)
          let { key } = payload
          if (key === content.key) {
            process.removeListener('message', onSubscribe)
            resolve(payload)
          }
        }
        process.on('message', ({ action, body }) => {
          let { key } = body
          if (type + '-response' && content.key === key){
            onSubscribe(body)
          }
        })
        process.send({ type: type, payload: content })
      })
    } catch (e) {
      console.warn(e)
    }
    
  }

  async destroy(key) {
    await this.executor.end()
    process.exit()
  }

  async done(key, payload) {
    process.send({type: types.CTRIP_SPIDE_REQUEST_DONE, payload: Object.assign({ key }, payload)})
  }

  async handle(id) {
    throw new Error(`method handle must be implement in subClass.`)
  }
}

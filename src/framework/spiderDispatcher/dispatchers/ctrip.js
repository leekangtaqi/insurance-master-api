import 'babel-polyfill'
import types from '../events-definition'
import Dispatcher from './dispatcher'
import { EventEmitter } from 'events'
import StateMachine from '../state-machine'
import _ from '../util'
import childProcess from 'child_process'
import path from 'path'

export default class Ctrip extends Dispatcher {
  constructor() {
    super()
    this.prefix = 'ctrip'
    this.defineWorkFlow([
      types.CTRIP_SPIDE_REQUEST_INIT, 
      [types.CTRIP_LOGIN_REQUEST, types.CTRIP_LOGIN_SIMPLE_REQUEST],
      [types.CTRIP_LOGIN_REQUEST_RESPONSE, types.CTRIP_LOGIN_SIMPLE_REQUEST_RESPONSE],
      types.CTRIP_SPIDE_REQUEST_DONE
    ])
    this.on(types.CTRIP_LOGIN_REQUEST_RESPONSE, body => { this.resolve(types.CTRIP_LOGIN_REQUEST_RESPONSE, body) })
    this.on(types.CTRIP_LOGIN_SIMPLE_REQUEST_RESPONSE, body => { this.resolve(types.CTRIP_LOGIN_SIMPLE_REQUEST_RESPONSE, body) })
  }

  async resolve(event, body) {
    let root1 = this.getWorker(event, body.key)
    let { key, worker } = root1 
    worker.send({action: event, body})
  }

  async destroy(key) {
    await this.executor.end()
    process.send({ type: types.CTRIP_PROCESS_DESTROY, payload: { key } })
  }

  getWorker(event, key) {
    !this.workerMap && (this.workerMap = {})
    return this.workerMap[event + key]
  }

  request(event, payload, callback) {
    let interfaces = {
      ctripWebTologin: 'ctripWebTologin'
    }
    let action = _.toCamel(event)
    let concerned = interfaces[action]
    let worker = this.getWorker(event, payload.key)

    if (!worker) {
      worker = childProcess.fork(path.join(__dirname, '../handlers', event), [payload.key, payload.payload])
      this.workerMap[event + payload.key] = worker
    }

    worker.send({ action, payload })

    worker.on('error', onDone)
    worker.on('exit', onDone)
    worker.on('disconnect', onDone)
    worker.on('message', ({ action, key, payload }) => {
      
    })
    function onDone() {

    }
  }

}
import 'babel-polyfill'
import types from '../events-definition'
import Dispatcher from './dispatcher'
import StateMachine from '../state-machine'
import _ from '../util'
import childProcess from 'child_process'
import path from 'path'
import InterfaceRegister from './interfaceRegister'

export default class Ctrip extends Dispatcher {
  constructor() {
    super()

    this.interfaces = new InterfaceRegister([
      {
        name: 'ctripWebTologin',
        ex: types.CTRIP_WEB_TOLOGIN,
        children: [
          {
            name: 'ctripWebLogin',
            ex: types.CTRIP_WEB_LOGIN
          }
        ]
      }
    ])
  }

  getWorker(action, key) {
    !this.workerMap && (this.workerMap = {})
    return this.workerMap[action + key]
  }

  removeWorker(action, key) {
    this.workerMap[action + key] = null
  }

  request(event, payload, callback=function noop(){}) {
    
    let action = _.toCamel(event)    

    if (!this.interfaces.has(action)) {
      callback(new Error(`no such action, [code]=${event}`))
    }

    let root = this.interfaces.getRoot(action)

    if (root) {
      event = root.ex
    }
    
    let worker = this.getWorker(event, payload.key)
    
    if (!worker) {
      worker = childProcess.fork(path.join(__dirname, '../handlers', event), [payload.key, payload.payload])
      this.workerMap[event + payload.key] = worker
    }

    let originAction = action

    worker.send({ action, payload })

    worker.on('error', onError.bind(this))
    worker.on('exit', onDone.bind(this))

    worker.on('message', ({ action, payload, error }) => {
      if (action === originAction + 'Response') {
        callback(error, payload)
      }
    })
    function onError() {
      this.removeWorker(action, payload.key)
    }
    function onDone() {
      this.removeWorker(action, payload.key)
    }
  }

}
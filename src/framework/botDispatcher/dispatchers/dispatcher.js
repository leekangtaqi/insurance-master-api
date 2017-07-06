import { EventEmitter } from 'events'
import childProcess from 'child_process'
import types from '../events-definition'
import _ from '../util'
import path from 'path'

export default class BotDispatcher extends EventEmitter {

  getWorker(action, key) {
    !this.workerMap && (this.workerMap = {})
    return this.workerMap[action + key]
  }

  removeWorker(action, key) {
    this.workerMap[action + key] = null
  }

  getWorkerBusy(action, key) {
    if (!this.workerBusyMap) {
      return false
    }
    return !!this.workerBusyMap[action + key]
  }

  setWorkerBusy(action, key, busy) {
    !this.workerBusyMap && (this.workerBusyMap = {})
    this.workerBusyMap[action + key] = busy
  }

  request(event, payload, callback=function noop(){}) {
    console.warn('request !!!!!!!!!!!!!!!!!')
    let action = _.toCamel(event)    

    if (!this.interfaces.has(action)) {
      return callback(new Error(`no such action, [code]=${event}`))
    }

    let root = this.interfaces.getRoot(action)

    if (root) {
      event = root.ex
    }
    
    let worker = this.getWorker(event, payload.key)
    
    if (this.getWorkerBusy(action, payload.key)) {
      return callback(new Error(`Worker is busy.`))
    }

    this.setWorkerBusy(event, payload.key, true)

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
        onDone.apply(this)
        return
      }
      if (action === types.EXCEPTION) {
        callback(error, payload)
        onDone.apply(this)
        return
      }
    })
    function onError() {
      this.removeWorker(action, payload.key)
    }
    function onDone() {
      this.removeWorker(action, payload.key)
    }
    function onDone() {
      this.setWorkerBusy(event, payload.key, false)
    }
  }

  requestAsync(event, payload) {
    return new Promise((resolve, reject) => {
      this.request(event, payload, function(err, data) {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }
}
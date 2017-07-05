import { EventEmitter } from 'events'
import childProcess from 'child_process'
import path from 'path'
import types from '../events-definition'

export default class SpiderDispatcher extends EventEmitter {

  constructor() {
    super()
    this.prefix = ''
    this.timeout = 60 * 1000
    this.actions = []
    // @type {object} => { key: event, worker: process  }
    this.queueMap = {}
  }

  isBusy(event, key) {
    let tasks = this.queueMap[event]
    if (tasks) {
      return tasks.filter(t => t.key === key).length
    }
    return false
  }

  getWorker(type, key) {
    let rootType = this.getRootFlow(type)
    let tasks = this.queueMap[rootType]
    if (tasks) {
      return tasks.filter(t => t.key === key)[0]
    }
    return null
  }

  removeWorker(type, k, isForce) {
    let t = this.queueMap[type].filter((t, i) => {
      if (k === t.key) {
        this.queueMap[type].splice(i, 1)
        return t
      }
    })

    if (isForce) {
      let worker = t.worker
      worker.disconnect()
    }

    this.emit(types.CTRIP_PROCESS_DESTROY, { key: t.key })
  }

  /**
   * @param {Array} actions
   */
  defineWorkFlow(actions) {
    if (!Array.isArray(actions) || !actions.length) {
      throw new Error(`Failed to define workflow, expected a array of string`)
    }
    this.actions = actions
  }

  getRootFlow(event) {
    for (let i = 0, len = this.actions.length; i<len; i++) {
      let action = this.actions[i]
      if (!action) {
        throw new Error(`Failed to get root flow, next is out of bounds.`)
      }
      if (action === event) {
        return this.actions[0]
      }
      if (Array.isArray(action)) {
        let index = action.indexOf(event)
        if (index >= 0) {
          return this.actions[0]
        }
      }
    }
  }

  /**
   * @param {string} event
   */
  getNextFlow(event) {
    for (let i = 0, len = this.actions.length; i<len; i++) {
      let action = this.actions[i]
      if (!action) {
        throw new Error(`Failed to request event, next is out of bounds.`)
      }
      if (action === event) {
        return this.actions[i+1]
      }
      if (Array.isArray(action)) {
        let index = action.indexOf(event)
        if (index >= 0) {
          return this.actions[i + 1]
        }
      }
    }

    throw new Error(`Failed to request event, next is out of bounds.`)
  }

  request(event, body, callback) {
    let actions = this.getNextFlow(event)
    if (!Array.isArray(actions)) {
      actions = [actions]
    }
    actions.forEach(action => {
      this.once(action, onDone.bind(this))
    })
    
    this.once(types.CTRIP_PROCESS_DESTROY, onAbort.bind(this))
    function onDone(payload) {
      if (payload.key === body.key) {
        actions.forEach(action => {
          this.removeListener(types.CTRIP_PROCESS_DESTROY, onDone)
        })
        callback(null, payload)
      }
    }
    function onAbort(payload) {
      if (payload.key === body.key) {
        this.removeListener(types.CTRIP_PROCESS_DESTROY, onAbort)
        callback(payload)
      }
    }
    this.emit(event, body)
  }

  async requestAsync(event, body) {
    return new Promise((resovle, reject) => {
      this.request(event, body, function(err, data) {
        if (err) {
          return reject(err)
        }
        return resolve(data)
      })
    })
  }

  register(type) {
    this.on(type, ({ key, payload }) => {      
      if (this.isBusy(type, key)) {
        return
      }
      if (!this.queueMap[type]) {
        this.queueMap[type] = []
      }
      let channel = type.split('-')[0]
      if (channel != this.prefix) {
        return
      }

      let worker = childProcess.fork(path.join(__dirname, '../handlers', type), [key, payload])
      this.queueMap[type].push({
        key,
        worker
      })
      
      worker.on('disconnect', () => { this.removeWorker(type, key) })
      worker.on('exit', () => { this.removeWorker(type, key) })
      worker.on('close', () => { this.removeWorker(type, key) })
      worker.on('message', ({ type, payload }) => {
        if (type === types.CTRIP_LOGIN_REQUEST || type === types.CTRIP_LOGIN_SIMPLE_REQUEST) {
          return this.emit(types.CTRIP_LOGIN_REQUEST, payload)
        }
        if (type === types.CTRIP_SPIDE_REQUEST_DONE) {
          return this.emit(types.CTRIP_SPIDE_REQUEST_DONE, payload)
        }
      })
    })
  }
}
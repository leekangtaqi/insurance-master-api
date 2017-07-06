const _ = require('./util')

module.exports = class StateMachine {

  constructor({ init, transitions, methods }) {
    this.state = init
    this.transitions = transitions
    this.methods = methods
    this.stateFromToMap = {}
    this.transitionMap = {}
    this.transitions.map(({name, from, to}) => {
      if (typeof from == 'string') {
        from = [from]
      }
      from.forEach(f => {
        !this.stateFromToMap[f] && (this.stateFromToMap[f] = [])
        this.stateFromToMap[f].push({ to, name })
      })
      this.transitionMap[name] = { name, from, to }
    })
  }

  async doAction(action, payload, opts) {
    if (!this.can(action)) {
      let error = new Error(`the action is forbidden, from [state]=${this.state}`)
      error.code = 403
      throw new Error(`the action is forbidden, from [state]=${this.state}`)
    }

    if (opts && opts.timeout) {
      this.timeout = setTimeout(() => {
        let error = new Error(`Failed to execute action, [action]=${action}`)
        error.code = 408
        throw new Error(error)
      }, opts.timeout)
    }

    let refinedAction = action[0].toUpperCase() + action.slice(1)
    let beforehook = this.methods['onBefore' + refinedAction]
    let afterhook = this.methods['onAfter' + refinedAction]
    
    let method = this.methods['on' + refinedAction]

    let beforeRes = null
    let res = null
    let afterRes = null

    try {
      if (beforehook) {
        beforeRes = beforehook(payload)
        if (beforeRes && _.isPromise(beforeRes)) {
          beforeRes = await beforeRes
        }
      }

      res = method(payload, beforeRes)
      if (res && typeof _.isPromise(res)) {
        res = await res
      }

      this.timeout && clearTimeout(this.timeout) && (this.timeout = null)

      this.state = this.transitionMap[action].to

      if (afterhook) {
        afterRes = afterhook(payload, res)
        if (afterRes && _.isPromise(afterRes)) {
          afterRes = await afterRes
        }
      }
      
    } catch (e) {
      throw new Error(e)
    }

    return afterRes || res
  }

  can(action) {
    if (!this.transitionMap[action]) {
      return false
    }

    let f = this.stateFromToMap[this.state]
    
    if (Object.keys(f).filter(p => f[p].name === action).length) {
      return true
    }
    return false
  }
}
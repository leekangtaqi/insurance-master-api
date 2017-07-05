// init: 'unlogin',
// transitions: [
//   { name: 'ctripWebToLogin', from: 'unlogin',  to: 'login' },
//   { name: 'ctripWebLogin',   from: 'login',    to: 'loggedin' },
//   { name: 'ctripWebToSpide', from: 'loggedin', to: 'spide' },
//   { name: 'ctripWebToDone',  from: 'spide',    to: 'done' }
// ],
// methods: {
//   onCtripWebToLogin: this.onToLogin,
//   onCtripWebLogin:   this.onLogin,
//   onCtripWebToSpide: this.onToSpide,
//   onCtripWebToDone:  this.onToDone
// }
module.exports = class StateMachine {
  constructor({ init, transitions, methods }) {
    this.state = init
    this.transitions = transitions
    this.methods = methods
    this.stateFromToMap = {}
    this.transitionMap = {}
    this.transitions.map(({name, from, to}) => {
      !this.stateFromToMap[from] && (this.stateFromToMap[from] = [])
      this.stateFromToMap[from].push({ to, name })
      this.transitionMap[name] = { name, from, to }
    })
  }

  async doAction(action, payload) {
    if (!this.can(action)) {
      return
    }
    
    let method = this.methods['on' + action[0].toUpperCase() + action.slice(1)]
    console.warn('on' + action[0].toUpperCase() + action.slice(1))
    try {
      await method(payload)
    } catch (e) {
      console.warn(e)
    }
    this.state = this.transitionMap[action].to
    return this
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